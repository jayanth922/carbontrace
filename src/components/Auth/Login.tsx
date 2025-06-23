import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { Session, AuthError } from '@supabase/supabase-js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  //  ── 1) On mount, check if this URL has an OTP (magic link) token
  useEffect(() => {
    // exchangeCodeForSession will:
    //  • confirm the user (set email_confirmed_at)
    //  • store the session (JWT) in localStorage
    //  • return { data: { session }, error }
    supabase.auth
      .exchangeCodeForSession(window.location.href) // Correct method for handling OTP links
      .then(({ data, error }: { data: { session: Session | null } | null; error: AuthError | null }) => {
        if (error && error.message.includes('expired')) {
          setError('The confirmation link has expired. Please register or login again.');
        } else if (data?.session) {
          // OTP succeeded, redirect to dashboard
          navigate('/dashboard', { replace: true });
        }
      });
  }, [navigate, location.hash]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Log In</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </label>
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Log In
        </button>
        <p className="text-xs text-center">
          Don’t have an account?{' '}
          <Link to="/register" className="text-green-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
