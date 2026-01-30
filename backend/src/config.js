import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
  claudeWorkingDir: process.env.CLAUDE_WORKING_DIR || process.cwd(),
  sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600000', 10), // 1 hour
};
