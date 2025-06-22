// src/components/Paywall/Paywall.tsx
import { useEffect, useState } from 'react'
import { Purchases } from '@revenuecat/purchases-js'

interface Package {
  identifier: string
  product: { title: string; priceString: string }
}

export function Paywall() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  // 1) Fetch offerings on mount
  useEffect(() => {
    async function load() {
      try {
        const offerings = await Purchases.getOfferings()  // :contentReference[oaicite:2]{index=2}
        const avail = offerings.current?.availablePackages || []
        setPackages(avail as any)
      } catch (e: any) {
        console.error('RC getOfferings error', e)
        setError('Could not load subscription options.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // 2) Trigger a purchase
  const subscribe = async (pkg: Package) => {
    try {
      // purchasePackage is the Web equivalent of purchase(package:) :contentReference[oaicite:3]{index=3}
      const { customerInfo } = await Purchases.purchasePackage(pkg as any)
      if (customerInfo.entitlements.active['premium']) {
        alert('Thanks for subscribing! 🎉')
      } else {
        alert('Subscription successful—but entitlement not active yet.')
      }
    } catch (e: any) {
      if (e.userCancelled) return
      console.error('RC purchase error', e)
      alert('Purchase failed: ' + (e.message || e))
    }
  }

  if (loading) return <div>Loading subscriptions…</div>
  if (error)   return <div className="text-red-600">{error}</div>
  if (packages.length === 0)
    return <div>No subscription packages available.</div>

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold">Go Premium</h2>
      {packages.map((pkg) => (
        <div
          key={pkg.identifier}
          className="flex items-center justify-between p-4 border rounded"
        >
          <div>
            <div className="font-medium">{pkg.product.title}</div>
            <div className="text-sm text-gray-500">
              {pkg.product.priceString}
            </div>
          </div>
          <button
            onClick={() => subscribe(pkg)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Subscribe
          </button>
        </div>
      ))}
    </div>
  )
}
