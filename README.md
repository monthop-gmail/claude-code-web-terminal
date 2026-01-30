# SuperApp-CC: Claude Code Web Interface

Web-based interface for Claude Code CLI.

## Quick Start

### Docker Mode (Recommended)

1. **Create `.env` file:**
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

2. **Build and run:**
```bash
docker compose up -d --build
```

3. **Open browser:** http://localhost:3001

### Development Mode

1. **Start Backend:**
```bash
cd backend
npm install
npm run dev
```

2. **Start Frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

3. **Open browser:** http://localhost:5173

## Architecture

```
┌─────────────┐     WebSocket      ┌──────────────┐      PTY       ┌─────────────┐
│   Browser   │ ◄────────────────► │   Node.js    │ ◄────────────► │ Claude Code │
│  (xterm.js) │                    │   Backend    │                │    CLI      │
└─────────────┘                    └──────────────┘                └─────────────┘
```

## Features (MVP)

- [x] Web-based terminal with xterm.js
- [x] WebSocket real-time communication
- [x] Session management (create/list/delete)
- [x] PTY integration with Claude Code CLI
- [x] Multi-client support per session
- [x] Claude CLI installed in Docker container
- [x] Localhost-only port binding for security

## Project Structure

```
superapp-cc/
├── backend/           # Node.js + Express + WebSocket
│   └── src/
│       ├── server.js
│       ├── config.js
│       ├── claude/wrapper.js
│       ├── session/manager.js
│       └── websocket/handler.js
├── frontend/          # React + Vite + xterm.js
│   └── src/
│       ├── App.tsx
│       └── components/
│           ├── Terminal.tsx
│           └── SessionPanel.tsx
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── PLAN.md
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| ANTHROPIC_API_KEY | Anthropic API key for Claude | Yes |
| PORT | Backend port (default: 3000) | No |
| ALLOWED_ORIGINS | CORS origins | No |

## API

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/sessions | List all sessions |
| POST | /api/sessions | Create new session |
| DELETE | /api/sessions/:id | Terminate session |

### WebSocket Protocol

**Client → Server:**
```json
{ "type": "join", "sessionId": "uuid" }
{ "type": "input", "sessionId": "uuid", "data": "text" }
{ "type": "resize", "sessionId": "uuid", "cols": 120, "rows": 40 }
{ "type": "signal", "sessionId": "uuid", "data": "SIGINT" }
```

**Server → Client:**
```json
{ "type": "joined", "sessionId": "uuid", "status": "connected" }
{ "type": "output", "sessionId": "uuid", "data": "terminal output" }
{ "type": "exit", "sessionId": "uuid", "exitCode": 0 }
```

## Security

- Ports bound to `127.0.0.1` only (not exposed to network)
- API key stored in `.env` file (not committed to git)

## Requirements

- Docker & Docker Compose
- ANTHROPIC_API_KEY

## License

MIT
