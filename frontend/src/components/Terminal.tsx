import { useEffect, useRef, useCallback } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import 'xterm/css/xterm.css'

interface TerminalProps {
  sessionId: string
  wsUrl: string
  onConnected: () => void
  onDisconnected: () => void
}

export default function Terminal({ sessionId, wsUrl, onConnected, onDisconnected }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  const sendMessage = useCallback((message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize xterm
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1a1a2e',
        foreground: '#eaeaea',
        cursor: '#f8f8f2',
        cursorAccent: '#1a1a2e',
        selection: 'rgba(248, 248, 242, 0.3)',
        black: '#000000',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#6272a4',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#f8f8f2',
        brightBlack: '#6272a4',
        brightRed: '#ff6e6e',
        brightGreen: '#69ff94',
        brightYellow: '#ffffa5',
        brightBlue: '#d6acff',
        brightMagenta: '#ff92df',
        brightCyan: '#a4ffff',
        brightWhite: '#ffffff'
      }
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(terminalRef.current)

    fitAddon.fit()
    xtermRef.current = term
    fitAddonRef.current = fitAddon

    // Connect WebSocket
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      // Join session
      ws.send(JSON.stringify({
        type: 'join',
        sessionId
      }))
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        handleMessage(message)
      } catch {
        console.error('Failed to parse message:', event.data)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      onDisconnected()
      term.write('\r\n\x1b[31m[Disconnected]\x1b[0m\r\n')
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    function handleMessage(message: { type: string; data?: string; status?: string }) {
      switch (message.type) {
        case 'joined':
          onConnected()
          // Send initial size
          sendMessage({
            type: 'resize',
            sessionId,
            cols: term.cols,
            rows: term.rows
          })
          break
        case 'output':
          if (message.data) {
            term.write(message.data)
          }
          break
        case 'exit':
          term.write('\r\n\x1b[33m[Session ended]\x1b[0m\r\n')
          break
        case 'error':
          term.write(`\r\n\x1b[31m[Error: ${message.data}]\x1b[0m\r\n`)
          break
      }
    }

    // Handle user input
    term.onData((data) => {
      sendMessage({
        type: 'input',
        sessionId,
        data
      })
    })

    // Handle resize
    const handleResize = () => {
      fitAddon.fit()
      sendMessage({
        type: 'resize',
        sessionId,
        cols: term.cols,
        rows: term.rows
      })
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      ws.close()
      term.dispose()
    }
  }, [sessionId, wsUrl, onConnected, onDisconnected, sendMessage])

  return (
    <div className="h-full rounded-lg overflow-hidden border border-gray-700">
      <div ref={terminalRef} className="h-full" />
    </div>
  )
}
