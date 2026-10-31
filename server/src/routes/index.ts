import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { EmailController } from '../controllers/email.controller.js';
import { GeminiService } from '../services/gemini.service.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'INBOX RAID Backend API',
    gmailSafetyGuarantee: 'Zero deletion policy. Archives only (removes INBOX label).',
    timestamp: new Date().toISOString()
  });
});

// Auth Routes (Google OAuth 2.0 & Session Management)
router.get('/auth/google/url', AuthController.getAuthUrl);
router.get('/auth/google/callback', AuthController.handleGoogleCallback);
router.get('/auth/me', AuthController.getAuthStatus);
router.post('/auth/disconnect', AuthController.disconnect);
router.get('/auth/demo', AuthController.getDemoSession);

// Email Operations (Fetch, Real Archive & Undo)
router.get('/emails', EmailController.getEmails);
router.post('/emails/archive', EmailController.archiveBatch);
router.post('/emails/unarchive', EmailController.unarchiveEmail);

// Gemini AI Enemy Analysis Endpoint
router.post('/ai/analyze', async (req, res) => {
  try {
    const { subject, snippet, sender } = req.body;
    const result = await GeminiService.analyzeEmail(subject || '', snippet || '', sender || '');
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
