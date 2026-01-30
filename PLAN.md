# แผนพัฒนา Claude Code Web Interface

## ภาพรวมโปรเจกต์

**ชื่อโปรเจกต์:** SuperApp-CC (Claude Code Web Interface)
**วัตถุประสงค์:** ให้ผู้ใช้สามารถใช้งาน Claude Code ผ่าน Web Browser ได้
**วันที่สร้างแผน:** 2026-01-30

---

## สถาปัตยกรรมระบบ

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Web Browser                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    React Frontend                              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │  │
│  │  │  Terminal   │  │   Chat UI   │  │   File Browser      │   │  │
│  │  │  (xterm.js) │  │  (Messages) │  │   (Project Files)   │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ WebSocket / HTTP
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Node.js Backend                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────┐   │
│  │  WebSocket    │  │  REST API     │  │  Session Manager      │   │
│  │  Server       │  │  Server       │  │  (Multi-user)         │   │
│  └───────────────┘  └───────────────┘  └───────────────────────┘   │
│                                │                                     │
│                                ▼                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Claude Code Wrapper                         │  │
│  │  - PTY (Pseudo Terminal)                                       │  │
│  │  - Process Management                                          │  │
│  │  - Output Streaming                                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Subprocess / PTY
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Claude Code CLI                               │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────┐   │
│  │  AI Agent     │  │  Tool System  │  │  MCP Servers          │   │
│  │  (Claude API) │  │  (Bash, Edit) │  │  (chat-mcp-claude)    │   │
│  └───────────────┘  └───────────────┘  └───────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
| Component | Technology | Version | หมายเหตุ |
|-----------|------------|---------|----------|
| Framework | React | 18.x | พร้อม TypeScript |
| Terminal | xterm.js | 5.x | Terminal emulator |
| UI Library | Tailwind CSS | 3.x | Utility-first CSS |
| State | Zustand | 4.x | Lightweight state management |
| WebSocket | Native WebSocket | - | Built-in browser API |
| Build Tool | Vite | 5.x | Fast development |

### Backend
| Component | Technology | Version | หมายเหตุ |
|-----------|------------|---------|----------|
| Runtime | Node.js | 20.x | LTS version |
| Framework | Express | 4.x | HTTP server |
| WebSocket | ws | 8.x | WebSocket server |
| PTY | node-pty | 1.x | Pseudo terminal |
| Auth | JWT | - | JSON Web Tokens |
| Database | SQLite | - | Session storage |

### Infrastructure
| Component | Technology | หมายเหตุ |
|-----------|------------|----------|
| Container | Docker | Multi-stage build |
| Orchestration | Docker Compose | Development & Production |
| Reverse Proxy | Nginx | Optional, for production |

---

## โครงสร้างโปรเจกต์

```
superapp-cc/
├── frontend/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Terminal/
│   │   │   │   ├── Terminal.tsx          # xterm.js wrapper
│   │   │   │   ├── TerminalToolbar.tsx   # Terminal controls
│   │   │   │   └── index.ts
│   │   │   ├── Chat/
│   │   │   │   ├── ChatPanel.tsx         # Message display
│   │   │   │   ├── MessageInput.tsx      # User input
│   │   │   │   └── index.ts
│   │   │   ├── FileExplorer/
│   │   │   │   ├── FileTree.tsx          # Directory tree
│   │   │   │   ├── FileViewer.tsx        # File content
│   │   │   │   └── index.ts
│   │   │   └── Layout/
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── MainLayout.tsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts           # WebSocket connection
│   │   │   ├── useTerminal.ts            # Terminal state
│   │   │   └── useAuth.ts                # Authentication
│   │   ├── stores/
│   │   │   ├── terminalStore.ts
│   │   │   ├── chatStore.ts
│   │   │   └── sessionStore.ts
│   │   ├── services/
│   │   │   ├── api.ts                    # REST API client
│   │   │   └── websocket.ts              # WebSocket client
│   │   ├── types/
│   │   │   └── index.ts                  # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                       # Node.js Backend
│   ├── src/
│   │   ├── server.js                     # Main entry point
│   │   ├── routes/
│   │   │   ├── auth.js                   # Authentication routes
│   │   │   ├── sessions.js               # Session management
│   │   │   └── files.js                  # File operations
│   │   ├── websocket/
│   │   │   ├── handler.js                # WebSocket message handler
│   │   │   └── connection.js             # Connection management
│   │   ├── claude/
│   │   │   ├── wrapper.js                # Claude Code CLI wrapper
│   │   │   ├── pty.js                    # PTY management
│   │   │   └── parser.js                 # Output parser
│   │   ├── session/
│   │   │   ├── manager.js                # Session lifecycle
│   │   │   └── store.js                  # Session storage
│   │   ├── middleware/
│   │   │   ├── auth.js                   # JWT verification
│   │   │   └── rateLimit.js              # Rate limiting
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── config.js
│   │   └── db/
│   │       └── sqlite.js                 # SQLite operations
│   ├── package.json
│   └── .env.example
│
├── docker/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml             # Development
├── docker-compose.prod.yml        # Production
├── .env.example
├── PLAN.md                        # This file
├── CLAUDE.md                      # Claude Code guidance
└── README.md
```

---

## Phases การพัฒนา

### Phase 1: Foundation (สัปดาห์ที่ 1-2)

#### 1.1 Backend Core
- [ ] ตั้งค่าโปรเจกต์ Node.js + Express
- [ ] สร้าง WebSocket server พื้นฐาน
- [ ] สร้าง Claude Code wrapper ด้วย node-pty
- [ ] ทดสอบการ spawn และ communicate กับ Claude Code CLI

#### 1.2 Frontend Core
- [ ] ตั้งค่าโปรเจกต์ React + Vite + TypeScript
- [ ] Integrate xterm.js
- [ ] สร้าง WebSocket client
- [ ] ทดสอบการเชื่อมต่อ terminal ผ่าน web

#### 1.3 Basic Integration
- [ ] เชื่อมต่อ Frontend กับ Backend
- [ ] ทดสอบ end-to-end: พิมพ์คำสั่ง → Claude Code → แสดงผล

### Phase 2: Features (สัปดาห์ที่ 3-4)

#### 2.1 Session Management
- [ ] สร้าง Session Manager (หลาย sessions พร้อมกัน)
- [ ] Implement session persistence (reconnect หลัง refresh)
- [ ] Session timeout และ cleanup

#### 2.2 Authentication
- [ ] JWT-based authentication
- [ ] Login/Logout UI
- [ ] API key management per user

#### 2.3 File Explorer
- [ ] Directory tree component
- [ ] File viewer/editor
- [ ] Upload/Download files

### Phase 3: Enhancement (สัปดาห์ที่ 5-6)

#### 3.1 UI/UX Improvements
- [ ] Responsive design
- [ ] Dark/Light theme
- [ ] Keyboard shortcuts
- [ ] Split pane layout

#### 3.2 Advanced Features
- [ ] Chat history panel
- [ ] Tool execution visualization
- [ ] Progress indicators
- [ ] Error handling UI

#### 3.3 MCP Integration
- [ ] เชื่อมต่อกับ chat-mcp-claude
- [ ] Custom MCP server UI

### Phase 4: Production Ready (สัปดาห์ที่ 7-8)

#### 4.1 Security
- [ ] Input sanitization
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Secure WebSocket (wss://)

#### 4.2 Performance
- [ ] Output buffering
- [ ] Connection pooling
- [ ] Caching strategies

#### 4.3 Deployment
- [ ] Docker images optimization
- [ ] CI/CD pipeline
- [ ] Monitoring และ logging
- [ ] Documentation

---

## API Specification

### REST Endpoints

```
Authentication
POST   /api/auth/login          # Login
POST   /api/auth/logout         # Logout
GET    /api/auth/me             # Get current user

Sessions
GET    /api/sessions            # List sessions
POST   /api/sessions            # Create new session
GET    /api/sessions/:id        # Get session info
DELETE /api/sessions/:id        # Terminate session

Files
GET    /api/files               # List files in directory
GET    /api/files/*path         # Read file content
POST   /api/files/*path         # Create/Update file
DELETE /api/files/*path         # Delete file
```

### WebSocket Protocol

```javascript
// Client → Server
{
  type: 'input',
  sessionId: 'uuid',
  data: 'user input text'
}

{
  type: 'resize',
  sessionId: 'uuid',
  cols: 120,
  rows: 40
}

{
  type: 'signal',
  sessionId: 'uuid',
  signal: 'SIGINT'  // Ctrl+C
}

// Server → Client
{
  type: 'output',
  sessionId: 'uuid',
  data: 'terminal output'
}

{
  type: 'status',
  sessionId: 'uuid',
  status: 'running' | 'idle' | 'error'
}

{
  type: 'tool',
  sessionId: 'uuid',
  tool: 'Read',
  params: { file_path: '/path/to/file' }
}
```

---

## Environment Variables

```bash
# Backend
PORT=3000
WS_PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
CLAUDE_API_KEY=your-anthropic-api-key
SESSION_TIMEOUT=3600000
MAX_SESSIONS_PER_USER=5
ALLOWED_ORIGINS=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3001
```

---

## Docker Compose Configuration

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend.Dockerfile
    ports:
      - "5173:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:3000
      - VITE_WS_URL=ws://localhost:3001

  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend.Dockerfile
    ports:
      - "3000:3000"
      - "3001:3001"
    volumes:
      - ./projects:/app/projects
      - claude-sessions:/app/sessions
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}

volumes:
  claude-sessions:
```

---

## Security Considerations

### Authentication & Authorization
1. JWT tokens with short expiry (1 hour)
2. Refresh token rotation
3. Role-based access control (admin, user)

### Input Validation
1. Sanitize all user inputs
2. Validate file paths (prevent path traversal)
3. Command injection prevention

### Network Security
1. HTTPS/WSS in production
2. CORS whitelist
3. Rate limiting per IP/user

### Process Isolation
1. Run Claude Code in sandboxed environment
2. Resource limits (CPU, memory, disk)
3. Timeout for long-running operations

---

## Monitoring & Logging

### Metrics to Track
- Active sessions count
- WebSocket connections
- API response times
- Claude Code CLI errors
- Resource usage per session

### Log Format
```json
{
  "timestamp": "2026-01-30T10:00:00Z",
  "level": "info",
  "service": "backend",
  "sessionId": "uuid",
  "userId": "user123",
  "event": "claude_output",
  "data": { ... }
}
```

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Claude API rate limit | High | Medium | Implement queuing, retry logic |
| WebSocket disconnect | Medium | High | Auto-reconnect, session persistence |
| Resource exhaustion | High | Low | Resource limits, cleanup jobs |
| Security breach | Critical | Low | Security audit, penetration testing |
| PTY compatibility | Medium | Medium | Fallback to subprocess mode |

---

## Success Criteria

### MVP (Minimum Viable Product)
- [ ] User สามารถ login และสร้าง session ได้
- [ ] Terminal ทำงานได้ปกติผ่าน web
- [ ] Claude Code ตอบสนองและแสดงผลได้
- [ ] Session persist หลัง page refresh

### Full Release
- [ ] รองรับ multiple concurrent users
- [ ] File explorer ทำงานได้
- [ ] Performance acceptable (< 100ms latency)
- [ ] 99% uptime ใน production

---

## Next Steps

1. **ทันที:** Review แผนนี้และให้ feedback
2. **ถัดไป:** เลือก approach (WebSocket vs SSE)
3. **เริ่มต้น:** Setup โปรเจกต์ใน Phase 1.1

---

*แผนนี้สร้างโดย Claude Code เมื่อ 2026-01-30*
