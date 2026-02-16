# Claude Code Guidance

## Project Overview
Claude Code Web Terminal is a web-based terminal interface for Claude Code CLI, allowing users to interact with Claude Code through a browser.

## Tech Stack
- **Backend**: Node.js 20+, Express, WebSocket (ws), node-pty
- **Frontend**: React 18, TypeScript, Vite, xterm.js, Tailwind CSS
- **Deployment**: Docker, Docker Compose

## Directory Structure
- `backend/` - Node.js API server with WebSocket and PTY management
- `frontend/` - React SPA with terminal emulator
- `docker/` - Docker configuration files
- `projects/` - Working directory for Claude Code sessions

## Key Files
- `backend/src/server.js` - Main entry point, Express + WebSocket server
- `backend/src/claude/wrapper.js` - PTY wrapper for Claude Code CLI
- `backend/src/session/manager.js` - Session lifecycle management
- `frontend/src/components/Terminal.tsx` - xterm.js integration
- `frontend/src/App.tsx` - Main React component

## Development Commands
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev

# Docker
docker-compose up --build
```

## Important Notes
- Claude Code CLI must be installed and accessible as `claude` command
- WebSocket runs on same port as HTTP (3000)
- Frontend dev server runs on port 5173
- Production frontend (via Docker) runs on port 3001
