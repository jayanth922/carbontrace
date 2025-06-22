// netlify/functions/processReceipt.ts
import type { Handler } from '@netlify/functions'

interface VisionRequest {
  requests: Array<{
    image: { content: string }
    features: Array<{ type: 'TEXT_DETECTION'; maxResults: number }>
  }>
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST allowed' }
  }

  // 1) Parse incoming base64 image
  let b64: string
  try {
    const { imageBase64 } = JSON.parse(event.body || '{}')
    if (!imageBase64) throw new Error()
    b64 = imageBase64.replace(/^data:.*;base64,/, '')
  } catch {
    return { statusCode: 400, body: 'Request must be JSON with `imageBase64` field.' }
  }

  // 2) Call Google Vision OCR
  const visionKey = process.env.GOOGLE_VISION_API_KEY!
  if (!visionKey) return { statusCode: 500, body: 'Missing GOOGLE_VISION_API_KEY' }

  let ocrText: string
  try {
    const visionResp = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(<VisionRequest>{
          requests: [{
            image: { content: b64 },
            features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
          }],
        }),
      }
    )
    const visionJson = await visionResp.json()
    ocrText = visionJson.responses?.[0]?.fullTextAnnotation?.text
    if (!ocrText) throw new Error('No text detected')
  } catch (e: any) {
    console.error('Vision OCR error:', e)
    return { statusCode: 502, body: 'Vision OCR failed: ' + e.toString() }
  }

  // 3) Call Groq Cloud for parsing
  const groqKey = process.env.GROQ_API_KEY!
  const groqModel = process.env.GROQ_MODEL_ID! // e.g. "llama-3.1-8b-instant"
  if (!groqKey || !groqModel) {
    return { statusCode: 500, body: 'Missing GROQ_API_KEY or GROQ_MODEL_ID' }
  }

  // system prompt identical to before
  const systemPrompt = `
You are an assistant that parses retail receipt text into line items and estimates CO₂ emissions.
For each item, output JSON object with fields:
  - "description": the item name
  - "carbon_kg": estimated carbon footprint in kilograms (round to 2 decimals)
Finally, output a top-level "total_carbon_kg" summing all items.
Respond with a single JSON object: { "items": [ ... ], "total_carbon_kg": ... }.
  `.trim()

  try {
    const groqResp = await fetch(
      'https://api.groq.com/openai/v1/chat/completions', // Groq endpoint :contentReference[oaicite:0]{index=0}
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: groqModel,      // pick one of Groq’s free-tier LLMs, e.g. llama-3.1-8b-instant :contentReference[oaicite:1]{index=1}
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Receipt text:\n${ocrText}` },
          ],
          temperature: 0,
        }),
      }
    )
    if (!groqResp.ok) {
      const err = await groqResp.text()
      throw new Error(`Groq API error ${groqResp.status}: ${err}`)
    }
    const { choices } = (await groqResp.json()) as { choices: Array<{ message: { content: string } }> }
    const parsed = JSON.parse(choices[0].message.content)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    }
  } catch (e: any) {
    console.error('Receipt parsing via Groq failed:', e)
    return { statusCode: 502, body: 'Receipt parsing failed: ' + e.toString() }
  }
}
