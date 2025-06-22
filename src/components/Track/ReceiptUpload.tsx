import { useState } from 'react'
import { useCarbonStore } from '../../store/carbonStore'

export function ReceiptUpload() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const addActivity = useCarbonStore((s) => s.addActivity)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      // 1) Read file as base64
      const b64 = await new Promise<string>((res, rej) => {
        const reader = new FileReader()
        reader.onload = () => res(reader.result as string)
        reader.onerror = () => rej(reader.error)
        reader.readAsDataURL(file)
      })

      // 2) Send to Netlify Function
      const resp = await fetch('/.netlify/functions/processReceipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: b64 }),
      })
      if (!resp.ok) throw new Error(await resp.text())
      const { items, total_carbon_kg }: {
        items: Array<{ description: string; carbon_kg: number }>,
        total_carbon_kg: number
      } = await resp.json()

      // 3) Add one summary activity for the whole receipt
      await addActivity({
        type: 'receipt',
        description: `Receipt upload (${file.name})`,
        carbon_kg: total_carbon_kg,
        metadata: { items },
      })
    } catch (e: unknown) {
      const error = e as { message?: string }
      console.error(e)
      setError(error.message || 'Unknown error processing receipt.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold">Upload Receipt</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={loading}
        className="block w-full text-sm text-gray-600"
      />
      {loading && <p className="text-sm text-gray-500">Processing…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
