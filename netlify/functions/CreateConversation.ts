import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST allowed' }
  }

  // parse custom context (optional) from client
  let context = 'Welcome to your CarbonTrace AI Coach!'
  try {
    const body = JSON.parse(event.body || '{}')
    if (body.context) context = body.context
  } catch {
    // ignore
  }

  const apiKey     = process.env.TAVUS_API_KEY!
  const replicaId  = process.env.TAVUS_REPLICA_ID!    // e.g. "re8e740a42"
  const personaId  = process.env.TAVUS_PERSONA_ID!    // e.g. "p24293d6"

  if (!apiKey || !replicaId || !personaId) {
    return { statusCode: 500, body: 'Missing TAVUS env vars.' }
  }

  try {
    const resp = await fetch(
      'https://tavusapi.com/v2/conversations', // create conversation endpoint :contentReference[oaicite:0]{index=0}
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          replica_id: replicaId,
          persona_id: personaId,
          conversational_context: context,
          // you can add callback_url or custom_greeting here if desired
        }),
      }
    )
    if (!resp.ok) {
      const err = await resp.text()
      return { statusCode: resp.status, body: err }
    }
    const { conversation_url } = await resp.json<{ conversation_url: string }>()
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: conversation_url }),
    }
  } catch (e: any) {
    console.error('Tavus createConversation error:', e)
    return { statusCode: 502, body: e.toString() }
  }
}
