import { Request, Response } from 'express';
import { MockEmailService } from '../services/mockEmail.service.js';
import { GmailService } from '../services/gmail.service.js';
import { SessionService } from '../services/session.service.js';

function extractSessionId(req: Request): string | undefined {
  return (
    req.cookies?.inbox_raid_session ||
    (req.headers['x-session-id'] as string) ||
    req.headers.authorization?.replace('Bearer ', '') ||
    (req.query?.sid as string) ||
    undefined
  );
}

export class EmailController {
  /**
   * Fetches emails from either live Gmail or the deterministic demo provider.
   */
  static async getEmails(req: Request, res: Response) {
    try {
      const sessionId = extractSessionId(req);
      const session = sessionId ? SessionService.getSession(sessionId) : null;
      const forceDemo = req.query.demo === 'true';

      // If user requested demo or is not authenticated, serve high-fidelity demo enemies
      if (forceDemo || !session) {
        const count = parseInt(req.query.count as string) || 12;
        const emails = MockEmailService.getMockEmails(count);
        return res.json({
          success: true,
          isDemo: true,
          emails,
          totalEstimated: emails.length
        });
      }

      // Live Gmail API Fetch
      const maxResults = parseInt(req.query.maxResults as string) || 20;
      const pageToken = (req.query.pageToken as string) || undefined;

      const { emails, nextPageToken, totalEstimated } = await GmailService.fetchInboxEmails(
        session,
        maxResults,
        pageToken
      );

      return res.json({
        success: true,
        isDemo: false,
        emails,
        nextPageToken,
        totalEstimated
      });
    } catch (error: any) {
      console.error('Error fetching emails:', error);

      // Handle token expiration or revocation
      if (error.code === 401 || error.message?.includes('invalid_grant') || error.message?.includes('Token has been expired or revoked')) {
        const sessionId = extractSessionId(req);
        if (sessionId) SessionService.deleteSession(sessionId);
        res.clearCookie('inbox_raid_session', { path: '/' });

        return res.status(401).json({
          success: false,
          error: 'SESSION_EXPIRED',
          message: 'Your Google session has expired. Please reconnect your Gmail account.'
        });
      }

      // Handle Gmail API quota error
      if (error.code === 429 || error.message?.includes('Quota exceeded')) {
        return res.status(429).json({
          success: false,
          error: 'QUOTA_EXCEEDED',
          message: 'Gmail API rate limit reached. Please wait a moment before trying again.'
        });
      }

      res.status(500).json({
        success: false,
        error: error.code || 'FETCH_FAILED',
        message: error.message || 'Failed to fetch emails from Gmail.'
      });
    }
  }

  /**
   * Archives a single email or batch by removing the 'INBOX' label.
   * STRICT SAFETY GUARANTEE: Never calls messages.delete or messages.trash!
   */
  static async archiveBatch(req: Request, res: Response) {
    try {
      const { ids, isDemo } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, error: 'No message IDs provided' });
      }

      const sessionId = extractSessionId(req);
      const session = sessionId ? SessionService.getSession(sessionId) : null;

      // In Demo mode, simulate instantaneous archiving
      if (isDemo || !session) {
        return res.json({
          success: true,
          isDemo: true,
          archivedCount: ids.length,
          archivedIds: ids,
          message: `Successfully archived ${ids.length} email(s) in demo state.`
        });
      }

      // Real Gmail Archive: Remove INBOX label
      const archivedCount = await GmailService.archiveEmailsBatch(session, ids);

      res.json({
        success: true,
        isDemo: false,
        archivedCount,
        archivedIds: ids,
        message: `Archived ${archivedCount} email(s) from your real Gmail inbox.`
      });
    } catch (error: any) {
      console.error('Error during archiveBatch:', error);

      if (error.code === 401 || error.message?.includes('invalid_grant')) {
        return res.status(401).json({
          success: false,
          error: 'SESSION_EXPIRED',
          message: 'Google session expired. Please reconnect.'
        });
      }

      res.status(500).json({
        success: false,
        error: error.code || 'ARCHIVE_FAILED',
        message: error.message || 'Failed to archive email(s).'
      });
    }
  }

  /**
   * UNDO ARCHIVE ENDPOINT:
   * Restores an email back to the INBOX by adding the 'INBOX' label back.
   */
  static async unarchiveEmail(req: Request, res: Response) {
    try {
      const { id, isDemo } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing message ID' });
      }

      const sessionId = extractSessionId(req);
      const session = sessionId ? SessionService.getSession(sessionId) : null;

      if (isDemo || !session) {
        return res.json({
          success: true,
          isDemo: true,
          messageId: id,
          message: 'Restored email in demo state.'
        });
      }

      // Real Gmail Unarchive (re-adds 'INBOX' label)
      await GmailService.unarchiveEmail(session, id);

      res.json({
        success: true,
        isDemo: false,
        messageId: id,
        message: 'Successfully restored email back to your Gmail Inbox!'
      });
    } catch (error: any) {
      console.error('Error unarchiving email:', error);
      res.status(500).json({
        success: false,
        error: error.code || 'UNARCHIVE_FAILED',
        message: error.message || 'Failed to restore email to inbox.'
      });
    }
  }
}
