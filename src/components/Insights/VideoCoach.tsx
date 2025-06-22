import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'

export function VideoCoach() {
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [user, setUser]           = useState<{ email: string } | null>(null)

  useEffect(() => {
    // Fetch user on mount
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUser({ email: data.user.email })
      } else {
        setUser(null)
      }
    })

    if (meetingUrl) return
    setLoading(true)
    fetch('/.netlify/functions/createConversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: `Hello ${user?.email ?? 'Friend'}, here’s your personal CarbonTrace coach!`,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then(({ url }) => setMeetingUrl(url))
      .catch((e) => { console.error(e); setError('Failed to load video coach.') })
      .finally(() => setLoading(false))
  }, [meetingUrl, user])

  if (loading) return <div className="p-6 text-center">Loading AI Video Coach…</div>
  if (error)   return <div className="p-6 text-center text-red-600">{error}</div>

  return meetingUrl ? (
    <div className="rounded-lg overflow-hidden shadow-lg">
      {/* embed via iframe per Tavus docs :contentReference[oaicite:1]{index=1} */}
      <iframe
        src={meetingUrl}
        allow="camera; microphone; fullscreen; display-capture"
        className="w-full h-96"
      />
    </div>
  ) : null
}
