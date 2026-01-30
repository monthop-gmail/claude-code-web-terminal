import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { config } from './config.js';
import { SessionManager } from './session/manager.js';
import { setupWebSocket } from './websocket/handler.js';

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Session Manager
const sessionManager = new SessionManager();

// REST API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/sessions', (req, res) => {
  const sessions = sessionManager.listSessions();
  res.json({ sessions });
});

app.post('/api/sessions', (req, res) => {
  const { workingDir } = req.body;
  const session = sessionManager.createSession(workingDir || config.claudeWorkingDir);
  res.json({ session: { id: session.id, workingDir: session.workingDir, status: session.status } });
});

app.delete('/api/sessions/:id', (req, res) => {
  const { id } = req.params;
  const success = sessionManager.terminateSession(id);
  if (success) {
    res.json({ message: 'Session terminated' });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// WebSocket Server
const wss = new WebSocketServer({ server });
setupWebSocket(wss, sessionManager);

// Start server
server.listen(config.port, () => {
  console.log(`🚀 HTTP Server running on http://localhost:${config.port}`);
  console.log(`🔌 WebSocket Server running on ws://localhost:${config.port}`);
  console.log(`📁 Working directory: ${config.claudeWorkingDir}`);
});
