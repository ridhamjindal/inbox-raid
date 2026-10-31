import crypto from 'crypto';

export interface OAuthTokens {
  access_token?: string | null;
  refresh_token?: string | null;
  scope?: string;
  token_type?: string | null;
  expiry_date?: number | null;
  id_token?: string | null;
}

export interface UserSession {
  id: string;
  tokens: OAuthTokens;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  createdAt: number;
  lastActive: number;
}

export class SessionService {
  // In-memory session store (sessionId -> UserSession)
  private static sessions = new Map<string, UserSession>();
  
  // Pending OAuth state tokens with expiration (state -> { createdAt: number })
  private static pendingStates = new Map<string, { createdAt: number }>();

  // State validity duration: 15 minutes
  private static STATE_EXPIRY_MS = 15 * 60 * 1000;
  // Session validity duration: 30 days
  private static SESSION_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

  /**
   * Generates a cryptographically secure random state parameter for OAuth CSRF protection.
   */
  static generateOAuthState(): string {
    const state = crypto.randomBytes(24).toString('hex');
    this.pendingStates.set(state, { createdAt: Date.now() });
    this.cleanupStates();
    return state;
  }

  /**
   * Validates and consumes an OAuth state parameter.
   */
  static validateOAuthState(state: string): boolean {
    if (!state) return false;
    const entry = this.pendingStates.get(state);
    if (!entry) return false;

    // Check expiry
    const isValid = Date.now() - entry.createdAt < this.STATE_EXPIRY_MS;
    this.pendingStates.delete(state); // One-time use
    return isValid;
  }

  /**
   * Creates a new user session with OAuth tokens and user info.
   */
  static createSession(user: UserSession['user'], tokens: OAuthTokens): string {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const now = Date.now();

    this.sessions.set(sessionId, {
      id: sessionId,
      tokens,
      user,
      createdAt: now,
      lastActive: now
    });

    return sessionId;
  }

  /**
   * Retrieves a session by ID and updates its lastActive timestamp.
   */
  static getSession(sessionId: string): UserSession | null {
    if (!sessionId) return null;
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    if (Date.now() - session.createdAt > this.SESSION_EXPIRY_MS) {
      this.sessions.delete(sessionId);
      return null;
    }

    session.lastActive = Date.now();
    return session;
  }

  /**
   * Updates tokens on an active session (e.g. after a token refresh).
   */
  static updateTokens(sessionId: string, newTokens: Partial<OAuthTokens>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.tokens = { ...session.tokens, ...newTokens };
      session.lastActive = Date.now();
    }
  }

  /**
   * Deletes a session (logout / disconnect).
   */
  static deleteSession(sessionId: string): void {
    if (sessionId) {
      this.sessions.delete(sessionId);
    }
  }

  /**
   * Cleans up expired OAuth states.
   */
  private static cleanupStates(): void {
    const now = Date.now();
    for (const [state, entry] of this.pendingStates.entries()) {
      if (now - entry.createdAt > this.STATE_EXPIRY_MS) {
        this.pendingStates.delete(state);
      }
    }
  }
}

