import { google } from 'googleapis';
import { config } from '../config/env.js';
import { UserSession, SessionService } from './session.service.js';

export interface GmailEmailItem {
  id: string;
  threadId: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  date: string;
  category: 'PROMOTIONAL' | 'SPAM' | 'NEWSLETTER' | 'IMPORTANT' | 'OLD_UNREAD';
  unread: boolean;
  isArchived: boolean;
  importance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  enemyType: 'Drone' | 'Scout' | 'Alien' | 'Cruiser' | 'Boss';
  hp: number;
  maxHp: number;
  points: number;
  labels: string[];
}

export class GmailService {
  /**
   * Constructs an OAuth2Client instance using server environment variables.
   */
  static getOAuth2Client() {
    return new google.auth.OAuth2(
      config.googleClientId,
      config.googleClientSecret,
      config.googleRedirectUri
    );
  }

  /**
   * Generates Google OAuth authorization URL with gmail.modify scope.
   * STRICT SECURITY GUARANTEE: Requests only gmail.modify, never full delete permissions.
   */
  static getAuthUrl(state: string): string {
    const oauth2Client = this.getOAuth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      state,
      scope: [
        'openid',
        'profile',
        'email',
        'https://www.googleapis.com/auth/gmail.modify'
      ]
    });
  }

  /**
   * Exchanges authorization code for access and refresh tokens.
   */
  static async exchangeCodeForTokens(code: string) {
    const oauth2Client = this.getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }

  /**
   * Fetches user profile (email, name, picture) using authenticated OAuth credentials.
   */
  static async getUserProfile(tokens: any) {
    const oauth2Client = this.getOAuth2Client();
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    return {
      id: data.id || '',
      email: data.email || '',
      name: data.name || data.email || 'Raider',
      picture: data.picture || undefined
    };
  }

  /**
   * Prepares an authenticated OAuth2Client for a session, listening for token refreshes.
   */
  static getAuthenticatedClient(session: UserSession) {
    const oauth2Client = this.getOAuth2Client();
    oauth2Client.setCredentials(session.tokens);

    // Auto-update stored session whenever Google issues a refreshed access token
    oauth2Client.on('tokens', (newTokens) => {
      SessionService.updateTokens(session.id, newTokens);
    });

    return oauth2Client;
  }

  /**
   * Fetches the user's live Gmail inbox emails and converts them to game enemy entities.
   * STRICT SAFETY: Only queries messages with the INBOX label.
   */
  static async fetchInboxEmails(
    session: UserSession,
    maxResults: number = 20,
    pageToken?: string
  ): Promise<{ emails: GmailEmailItem[]; nextPageToken?: string; totalEstimated?: number }> {
    const auth = this.getAuthenticatedClient(session);
    const gmail = google.gmail({ version: 'v1', auth });

    // 1. Fetch message list from user's inbox
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:inbox',
      maxResults: Math.min(maxResults, 50),
      pageToken
    });

    const messages = listRes.data.messages || [];
    const nextPageToken = listRes.data.nextPageToken || undefined;
    const totalEstimated = listRes.data.resultSizeEstimate || messages.length;

    if (messages.length === 0) {
      return { emails: [], nextPageToken, totalEstimated };
    }

    // 2. Fetch metadata for each message
    const detailedPromises = messages.map(async (msg) => {
      if (!msg.id) return null;
      try {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'metadata',
          metadataHeaders: ['From', 'Subject', 'Date']
        });

        const headers = detail.data.payload?.headers || [];
        const fromHeader = headers.find((h) => h.name?.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const subject = headers.find((h) => h.name?.toLowerCase() === 'subject')?.value || '(No Subject)';
        const dateHeader = headers.find((h) => h.name?.toLowerCase() === 'date')?.value || new Date().toISOString();
        const snippet = detail.data.snippet || '';
        const labels = detail.data.labelIds || [];

        // Parse sender name & email from "Name <email@domain.com>"
        const parsedSender = this.parseSender(fromHeader);

        // Classify into game enemy attributes
        const classification = this.classifyEmail(subject, snippet, parsedSender.sender, labels, dateHeader);

        const emailItem: GmailEmailItem = {
          id: msg.id,
          threadId: detail.data.threadId || msg.id,
          sender: parsedSender.sender,
          senderEmail: parsedSender.senderEmail,
          subject,
          snippet,
          date: new Date(dateHeader).toISOString(),
          category: classification.category,
          unread: labels.includes('UNREAD'),
          isArchived: !labels.includes('INBOX'),
          importance: classification.importance,
          enemyType: classification.enemyType,
          hp: classification.hp,
          maxHp: classification.hp,
          points: classification.points,
          labels
        };

        return emailItem;
      } catch (err) {
        console.warn(`Failed to fetch message metadata for ${msg.id}:`, err);
        return null;
      }
    });

    const detailedList = await Promise.all(detailedPromises);
    const validEmails = detailedList.filter((item): item is GmailEmailItem => item !== null);

    return { emails: validEmails, nextPageToken, totalEstimated };
  }

  /**
   * Real non-destructive archiving function for a single email.
   * Removes 'INBOX' label from specified message ID.
   * NEVER calls messages.delete or messages.trash!
   */
  static async archiveEmail(session: UserSession, messageId: string): Promise<boolean> {
    if (!messageId) return false;

    const auth = this.getAuthenticatedClient(session);
    const gmail = google.gmail({ version: 'v1', auth });

    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        removeLabelIds: ['INBOX']
      }
    });

    return true;
  }

  /**
   * Real non-destructive batch archiving function.
   * Removes 'INBOX' label from specified message IDs.
   * NEVER calls messages.delete or messages.trash!
   */
  static async archiveEmailsBatch(session: UserSession, messageIds: string[]): Promise<number> {
    if (!messageIds || messageIds.length === 0) return 0;

    const auth = this.getAuthenticatedClient(session);
    const gmail = google.gmail({ version: 'v1', auth });

    await gmail.users.messages.batchModify({
      userId: 'me',
      requestBody: {
        ids: messageIds,
        removeLabelIds: ['INBOX']
      }
    });

    return messageIds.length;
  }

  /**
   * UNDO / RESTORE ARCHIVE FUNCTION:
   * Adds the 'INBOX' label back to the specified message ID.
   * Allows players to immediately undo accidental archives.
   */
  static async unarchiveEmail(session: UserSession, messageId: string): Promise<boolean> {
    if (!messageId) return false;

    const auth = this.getAuthenticatedClient(session);
    const gmail = google.gmail({ version: 'v1', auth });

    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        addLabelIds: ['INBOX']
      }
    });

    return true;
  }

  /**
   * Revokes the OAuth token on Google's servers upon disconnect/logout.
   */
  static async revokeToken(session: UserSession): Promise<void> {
    try {
      const auth = this.getOAuth2Client();
      if (session.tokens.access_token) {
        await auth.revokeToken(session.tokens.access_token);
      }
    } catch (err) {
      console.warn('Token revocation notice (may already be expired):', err);
    }
  }

  /**
   * Helper to parse sender name and email from RFC 2822 From header.
   */
  private static parseSender(fromHeader: string): { sender: string; senderEmail: string } {
    const match = fromHeader.match(/^(.*?)\s*<(.+?)>$/);
    if (match) {
      let sender = match[1].trim().replace(/^["']|["']$/g, '');
      const senderEmail = match[2].trim();
      if (!sender) sender = senderEmail.split('@')[0];
      return { sender, senderEmail };
    }
    return { sender: fromHeader.split('@')[0], senderEmail: fromHeader };
  }

  /**
   * Deterministic game entity classification based on Gmail label IDs and content heuristics.
   * Accurately categorizes into Promotions, Newsletters, Spam-like, and Important.
   */
  private static classifyEmail(
    subject: string,
    snippet: string,
    sender: string,
    labels: string[],
    dateStr: string
  ) {
    const text = `${subject} ${snippet} ${sender}`.toLowerCase();
    const messageDate = new Date(dateStr);
    const ageDays = (Date.now() - messageDate.getTime()) / (1000 * 60 * 60 * 24);

    // 1. IMPORTANT / VIP (High Priority Work, Personal, Invoices, Security Alerts, Starred)
    const isImportantKeyword =
      text.includes('urgent') ||
      text.includes('security alert') ||
      text.includes('action required') ||
      text.includes('verification code') ||
      text.includes('otp') ||
      text.includes('two-factor') ||
      text.includes('invoice') ||
      text.includes('receipt') ||
      text.includes('bank') ||
      text.includes('salary') ||
      text.includes('payroll') ||
      text.includes('tax') ||
      text.includes('contract') ||
      text.includes('interview') ||
      text.includes('offer letter');

    const isDirectPersonal = labels.includes('CATEGORY_PERSONAL') && !text.includes('unsubscribe') && !text.includes('newsletter');

    if (labels.includes('IMPORTANT') || labels.includes('STARRED') || isImportantKeyword || isDirectPersonal) {
      return {
        category: 'IMPORTANT' as const,
        enemyType: 'Cruiser' as const,
        hp: 4,
        points: 400,
        importance: 'HIGH' as const
      };
    }

    // 2. SPAM / PHISHING / SUSPICIOUS
    const isSpamKeyword =
      text.includes('claim reward') ||
      text.includes('airdrop') ||
      text.includes('crypto bonus') ||
      text.includes('congratulations! you won') ||
      text.includes('lottery') ||
      text.includes('inheritance') ||
      text.includes('pre-approved loan') ||
      text.includes('unclaimed estate');

    if (labels.includes('SPAM') || isSpamKeyword) {
      return {
        category: 'SPAM' as const,
        enemyType: 'Alien' as const,
        hp: 3,
        points: 300,
        importance: 'LOW' as const
      };
    }

    // 3. NEWSLETTER / DIGEST / UPDATES
    const isNewsletterKeyword =
      labels.includes('CATEGORY_UPDATES') ||
      labels.includes('CATEGORY_FORUMS') ||
      text.includes('newsletter') ||
      text.includes('weekly digest') ||
      text.includes('daily briefing') ||
      text.includes('issue #') ||
      text.includes('roundup') ||
      text.includes('substack.com') ||
      text.includes('medium.com') ||
      text.includes('view in browser');

    if (isNewsletterKeyword) {
      return {
        category: 'NEWSLETTER' as const,
        enemyType: 'Boss' as const,
        hp: 5,
        points: 500,
        importance: 'MEDIUM' as const
      };
    }

    // 4. OLD UNREAD (Older than 180 days)
    if (ageDays > 180) {
      return {
        category: 'OLD_UNREAD' as const,
        enemyType: 'Scout' as const,
        hp: 2,
        points: 200,
        importance: 'LOW' as const
      };
    }

    // 5. PROMOTIONAL (Default for marketing, discounts, ecommerce, retail)
    return {
      category: 'PROMOTIONAL' as const,
      enemyType: 'Drone' as const,
      hp: 1,
      points: 100,
      importance: 'LOW' as const
    };
  }
}
