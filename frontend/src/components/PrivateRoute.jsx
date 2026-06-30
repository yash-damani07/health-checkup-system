import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Restricts a route to logged-in users, optionally by role
export default function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
}
