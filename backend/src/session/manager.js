import { v4 as uuidv4 } from 'uuid';
import { ClaudeWrapper } from '../claude/wrapper.js';

export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  createSession(workingDir) {
    const id = uuidv4();
    const session = {
      id,
      workingDir,
      status: 'created',
      createdAt: new Date(),
      claude: null,
      clients: new Set()
    };
    this.sessions.set(id, session);
    return session;
  }

  getSession(id) {
    return this.sessions.get(id);
  }

  listSessions() {
    return Array.from(this.sessions.values()).map(s => ({
      id: s.id,
      workingDir: s.workingDir,
      status: s.status,
      createdAt: s.createdAt,
      clientCount: s.clients.size
    }));
  }

  startClaude(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    if (!session.claude) {
      session.claude = new ClaudeWrapper(session.workingDir);
      session.status = 'running';
    }
    return session.claude;
  }

  addClient(sessionId, ws) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.clients.add(ws);
    }
  }

  removeClient(sessionId, ws) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.clients.delete(ws);
    }
  }

  broadcast(sessionId, message) {
    const session = this.sessions.get(sessionId);
    if (session) {
      const data = JSON.stringify(message);
      session.clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(data);
        }
      });
    }
  }

  terminateSession(id) {
    const session = this.sessions.get(id);
    if (!session) return false;

    if (session.claude) {
      session.claude.kill();
    }
    session.clients.forEach(client => client.close());
    this.sessions.delete(id);
    return true;
  }
}
