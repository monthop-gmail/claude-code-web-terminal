import { useState, useCallback } from 'react'
import Terminal from './components/Terminal'
import SessionPanel from './components/SessionPanel'

interface Session {
  id: string
  workingDir: string
  status: string
}

const API_URL = import.meta.env.VITE_API_URL || ''
const WS_URL = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:3000`

function App() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const createSession = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workingDir: '/app/projects' })
      })
      const data = await res.json()
      setCurrentSession(data.session)
    } catch (err) {
      console.error('Failed to create session:', err)
    }
  }, [])

  const handleConnected = useCallback(() => {
    setIsConnected(true)
  }, [])

  const handleDisconnected = useCallback(() => {
    setIsConnected(false)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">Claude Code Web</h1>
          <span className={`px-2 py-1 text-xs rounded ${isConnected ? 'bg-green-600' : 'bg-gray-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {currentSession && (
            <span className="text-sm text-gray-400">
              Session: {currentSession.id.slice(0, 8)}...
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <SessionPanel
            currentSession={currentSession}
            onCreateSession={createSession}
            apiUrl={API_URL}
          />
        </aside>

        {/* Terminal Area */}
        <main className="flex-1 p-4">
          {currentSession ? (
            <Terminal
              sessionId={currentSession.id}
              wsUrl={WS_URL}
              onConnected={handleConnected}
              onDisconnected={handleDisconnected}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-4">No active session</p>
                <button
                  onClick={createSession}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Create New Session
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
