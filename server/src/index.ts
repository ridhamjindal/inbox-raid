import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import apiRouter from './routes/index.js';

const app = express();

app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred.'
  });
});

app.listen(config.port, () => {
  console.log(`⚡ INBOX RAID Server listening on http://localhost:${config.port}`);
  console.log(`🛡️  Gmail Non-Destructive Archive Engine Initialized`);
  console.log(`🔒 OAuth Scopes: https://www.googleapis.com/auth/gmail.modify`);
});
