// src/components/Paywall/Paywall.tsx
import { useEffect, useState } from 'react';

export function Paywall() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div>Loading subscriptions…</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold">Go Premium</h2>
      <div>No subscription packages available.</div>
    </div>
  );
}
