# SuperApp-CC: Claude Code Web Interface

Web-based interface for Claude Code CLI.

## Quick Start

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

### Docker Mode

```bash
# Build and run
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

Access at http://localhost:3001

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
└── PLAN.md
```

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

## Requirements

- Node.js 20+
- Claude Code CLI installed (`claude` command available)
- Docker (optional)

## License

MIT
