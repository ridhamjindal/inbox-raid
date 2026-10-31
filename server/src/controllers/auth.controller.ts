import { Request, Response } from 'express';
import { GmailService } from '../services/gmail.service.js';
import { SessionService } from '../services/session.service.js';
import { config } from '../config/env.js';

export class AuthController {
  /**
   * Generates the Google OAuth authorization URL with CSRF state protection.
   */
  static getAuthUrl(req: Request, res: Response) {
    try {
      const isConfigured = Boolean(
        config.googleClientId &&
        config.googleClientSecret &&
        !config.googleClientId.includes('your_google_client_id') &&
        !config.googleClientSecret.includes('your_google_client_secret')
      );

      if (!isConfigured) {
        return res.json({
          success: false,
          notConfigured: true,
          error: 'GOOGLE_CREDENTIALS_MISSING',
          message: 'Google OAuth Client ID & Secret are not configured in server/.env. Please configure your real GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Cloud Console.'
        });
      }

      const state = SessionService.generateOAuthState();
      const authUrl = GmailService.getAuthUrl(state);
      res.json({ success: true, url: authUrl });
    } catch (error: any) {
      console.error('Error generating Google OAuth URL:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Handles Google OAuth callback: validates state, exchanges code for tokens,
   * creates an encrypted server-side session, sets httpOnly cookie AND passes session ID
   * in redirect for seamless cross-port authentication.
   */
  static async handleGoogleCallback(req: Request, res: Response) {
    try {
      const { code, state, error } = req.query as { code?: string; state?: string; error?: string };

      // 1. Handle user cancellation or OAuth provider error
      if (error) {
        console.warn('Google OAuth returned error:', error);
        const reason = error === 'access_denied' ? 'cancelled' : encodeURIComponent(error);
        return res.redirect(`${config.clientUrl}/?auth_error=${reason}`);
      }

      if (!code || !state) {
        return res.redirect(`${config.clientUrl}/?auth_error=missing_parameters`);
      }

      // 2. Validate CSRF state token
      const isStateValid = SessionService.validateOAuthState(state);
      if (!isStateValid) {
        console.warn('OAuth state validation failed (expired or invalid state)');
        return res.redirect(`${config.clientUrl}/?auth_error=invalid_state`);
      }

      // 3. Exchange authorization code for tokens
      const tokens = await GmailService.exchangeCodeForTokens(code);

      // 4. Retrieve user profile from Google
      const user = await GmailService.getUserProfile(tokens);

      // 5. Create secure session on server
      const sessionId = SessionService.createSession(user, tokens);

      // 6. Set HTTP-only secure cookie
      res.cookie('inbox_raid_session', sessionId, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      // 7. Redirect back to frontend dashboard with success flag AND sid parameter
      // (This guarantees login succeeds even if cross-port cookie partitioning occurs between 5000 and 5173)
      return res.redirect(`${config.clientUrl}/?auth=success&sid=${sessionId}`);
    } catch (err: any) {
      console.error('Google OAuth callback exchange error:', err);
      const safeErrorMsg = encodeURIComponent(err.message || 'auth_failed');
      return res.redirect(`${config.clientUrl}/?auth_error=${safeErrorMsg}`);
    }
  }

  /**
   * Checks current authentication status using cookie or session header/query.
   */
  static getAuthStatus(req: Request, res: Response) {
    let sessionId =
      req.cookies?.inbox_raid_session ||
      (req.query?.sid as string) ||
      (req.headers['x-session-id'] as string) ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!sessionId) {
      return res.json({
        authenticated: false,
        isDemo: true,
        user: null
      });
    }

    const session = SessionService.getSession(sessionId);
    if (!session) {
      res.clearCookie('inbox_raid_session', { path: '/' });
      return res.json({
        authenticated: false,
        isDemo: true,
        user: null
      });
    }

    // Refresh the cookie on the current host/port connection
    res.cookie('inbox_raid_session', sessionId, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.json({
      authenticated: true,
      isDemo: false,
      sessionId: sessionId,
      user: session.user
    });
  }

  /**
   * Disconnects Gmail account, revokes token, and clears the session cookie.
   */
  static async disconnect(req: Request, res: Response) {
    try {
      const sessionId =
        req.cookies?.inbox_raid_session ||
        (req.headers['x-session-id'] as string) ||
        req.headers.authorization?.replace('Bearer ', '');

      if (sessionId) {
        const session = SessionService.getSession(sessionId);
        if (session) {
          await GmailService.revokeToken(session);
          SessionService.deleteSession(sessionId);
        }
      }

      res.clearCookie('inbox_raid_session', { path: '/' });
      res.json({
        success: true,
        message: 'Successfully disconnected from Gmail. Switched back to Demo Mode.'
      });
    } catch (error: any) {
      console.error('Error during disconnect:', error);
      res.clearCookie('inbox_raid_session', { path: '/' });
      res.json({ success: true, message: 'Session cleared locally.' });
    }
  }

  /**
   * Returns demo session for instant play without Google credentials.
   */
  static getDemoSession(req: Request, res: Response) {
    res.json({
      success: true,
      authenticated: false,
      isDemo: true,
      user: {
        id: 'demo_player_99',
        email: 'commander@inboxraid.demo',
        name: 'Demo Raid Commander',
        isDemo: true
      }
    });
  }
}
