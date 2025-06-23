// src/components/Layout/Header.tsx

import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ChartBarIcon,
  PlusIcon,
  TagIcon,
  TrophyIcon,
  LightBulbIcon,
  BoltIcon,
  BellIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import { supabase } from '../../utils/supabaseClient'
import { useAuth } from '../Auth/AuthProvider'

// Put leaf-icon.svg in your public/ folder (the little green logo you showed)
const leafLogo = 'public/favicon.ico'

export default function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const session = useAuth() // Get the current session
  const user = session?.user // Supabase User object

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <ChartBarIcon className="h-5 w-5" /> },
    { to: '/track',     label: 'Track',     icon: <PlusIcon className="h-5 w-5" /> },
    { to: '/goals',     label: 'Goals',     icon: <TagIcon className="h-5 w-5" /> },
    { to: '/challenges',label: 'Challenges',icon: <TrophyIcon className="h-5 w-5" /> },
    { to: '/insights',  label: 'AI Insights',icon: <LightBulbIcon className="h-5 w-5" /> },
    { to: '/offset',    label: 'Offset',    icon: <BoltIcon className="h-5 w-5" /> },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut() // Clear the JWT
    navigate('/login', { replace: true }) // Redirect to login
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      {/* Logo + Title */}
      <div className="flex items-center space-x-3">
        <img src={leafLogo} alt="CarbonTrace" className="h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold">CarbonTrace</h1>
          <p className="text-xs text-gray-500">Track. Reduce. Impact.</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex space-x-6 ml-8">
        {navItems.map(({ to, label, icon }) => {
          const active = pathname === to
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm ${
                active
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {React.cloneElement(icon, {
                className: `${
                  active ? 'text-green-600' : 'text-gray-400'
                } h-5 w-5`,
              })}
              <span>{label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* User & controls */}
      <div className="flex items-center space-x-4">
        {/* Only show if user is signed in */}
        {user ? (
          <>
            <span className="text-sm text-gray-700">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <BellIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
            <Cog6ToothIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
            {/* Replace with real avatar once you have it */}
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-600">
              AJ
            </div>
          </>
        )}
      </div>
    </header>
  )
}
