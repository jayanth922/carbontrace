import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const session = useAuth();

  // still loading
  if (session === undefined) {
    return <div className="p-6 text-center">Loading…</div>;
  }
  // not signed in
  if (session === null) {
    return <Navigate to="/login" replace />;
  }
  // signed in
  return children;
}
