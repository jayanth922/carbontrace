import { supabase } from '../../utils/supabaseClient';

export default function Login() {
  const handleGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      alert('Error signing in: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome to CarbonTrace</h1>
        <button
          onClick={handleGitHub}
          className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
