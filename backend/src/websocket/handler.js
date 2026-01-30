export function setupWebSocket(wss, sessionManager) {
  wss.on('connection', (ws, req) => {
    console.log('🔌 New WebSocket connection');

    let currentSessionId = null;
    let claude = null;

    ws.on('message', (raw) => {
      try {
        const message = JSON.parse(raw.toString());
        handleMessage(ws, message);
      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', error: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log('🔌 WebSocket disconnected');
      if (currentSessionId) {
        sessionManager.removeClient(currentSessionId, ws);
      }
    });

    function handleMessage(ws, message) {
      const { type, sessionId, data } = message;

      switch (type) {
        case 'join':
          handleJoin(ws, sessionId);
          break;
        case 'input':
          handleInput(data);
          break;
        case 'resize':
          handleResize(message.cols, message.rows);
          break;
        case 'signal':
          handleSignal(data);
          break;
        default:
          ws.send(JSON.stringify({ type: 'error', error: `Unknown message type: ${type}` }));
      }
    }

    function handleJoin(ws, sessionId) {
      const session = sessionManager.getSession(sessionId);
      if (!session) {
        ws.send(JSON.stringify({ type: 'error', error: 'Session not found' }));
        return;
      }

      currentSessionId = sessionId;
      sessionManager.addClient(sessionId, ws);

      // Start Claude if not already running
      claude = sessionManager.startClaude(sessionId);

      if (!claude.pty) {
        claude.spawn();

        // Forward output to all clients
        claude.on('output', (output) => {
          sessionManager.broadcast(sessionId, {
            type: 'output',
            sessionId,
            data: output
          });
        });

        claude.on('exit', ({ exitCode, signal }) => {
          sessionManager.broadcast(sessionId, {
            type: 'exit',
            sessionId,
            exitCode,
            signal
          });
        });
      }

      ws.send(JSON.stringify({
        type: 'joined',
        sessionId,
        status: 'connected'
      }));
    }

    function handleInput(data) {
      if (claude) {
        claude.write(data);
      }
    }

    function handleResize(cols, rows) {
      if (claude && cols && rows) {
        claude.resize(cols, rows);
      }
    }

    function handleSignal(signal) {
      if (claude) {
        claude.sendSignal(signal);
      }
    }
  });

  console.log('✅ WebSocket handler initialized');
}
