// netlify/functions/tts.ts
import { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let text: string
  try {
    const body = JSON.parse(event.body || '{}')
    text = body.text
    if (!text) throw new Error()
  } catch {
    return { statusCode: 400, body: 'Request body must be JSON with a `text` field.' }
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID
  if (!apiKey || !voiceId) {
    return { statusCode: 500, body: 'Missing ElevenLabs env vars.' }
  }

  try {
    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    )
    if (!resp.ok) {
      const err = await resp.text()
      return { statusCode: resp.status, body: err }
    }
    const buffer = await resp.arrayBuffer()
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true,
    }
  } catch (err: any) {
    return { statusCode: 502, body: String(err) }
  }
}
