// src/components/Layout/Header.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // initial fetch
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    // listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // cleanup
    return () => subscription.unsubscribe()
  }, [])

  const signIn = () =>
    supabase.auth.signInWithOAuth({ provider: 'github' }) // or .signInWithOtp({ email })
  const signOut = () => supabase.auth.signOut()

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <h1 className="text-2xl font-bold">CarbonTrace</h1>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm text-gray-700">{user.email}</span>
            <button
              onClick={signOut}
              className="text-sm text-red-500 hover:underline"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={signIn}
            className="text-sm text-green-600 hover:underline"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}
