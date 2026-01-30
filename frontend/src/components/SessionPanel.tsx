import { useState, useEffect } from 'react'

interface Session {
  id: string
  workingDir: string
  status: string
  clientCount?: number
}

interface SessionPanelProps {
  currentSession: Session | null
  onCreateSession: () => void
  apiUrl: string
}

export default function SessionPanel({ currentSession, onCreateSession, apiUrl }: SessionPanelProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/sessions`)
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
    }
  }

  useEffect(() => {
    fetchSessions()
    const interval = setInterval(fetchSessions, 5000)
    return () => clearInterval(interval)
  }, [apiUrl])

  const handleCreate = async () => {
    setLoading(true)
    await onCreateSession()
    await fetchSessions()
    setLoading(false)
  }

  const handleDelete = async (sessionId: string) => {
    try {
      await fetch(`${apiUrl}/api/sessions/${sessionId}`, { method: 'DELETE' })
      await fetchSessions()
    } catch (err) {
      console.error('Failed to delete session:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Sessions</h2>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition"
        >
          {loading ? '...' : '+ New'}
        </button>
      </div>

      <div className="space-y-2">
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-500">No active sessions</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 rounded-lg border ${
                currentSession?.id === session.id
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-300">
                  {session.id.slice(0, 8)}
                </span>
                <button
                  onClick={() => handleDelete(session.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  X
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                <span className={`inline-block px-1.5 py-0.5 rounded ${
                  session.status === 'running' ? 'bg-green-800 text-green-300' : 'bg-gray-700 text-gray-400'
                }`}>
                  {session.status}
                </span>
                {session.clientCount !== undefined && (
                  <span className="ml-2">{session.clientCount} client(s)</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {currentSession && (
        <div className="pt-4 border-t border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Current Session</h3>
          <div className="text-xs text-gray-500 space-y-1">
            <p>ID: {currentSession.id}</p>
            <p>Dir: {currentSession.workingDir}</p>
            <p>Status: {currentSession.status}</p>
          </div>
        </div>
      )}
    </div>
  )
}
