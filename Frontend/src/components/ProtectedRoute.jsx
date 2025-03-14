import { Navigate } from 'react-router-dom';
import { useUser } from '../components/contexts/UserContext';

// Component to protect routes based on authentication and role
function ProtectedRoute({ children, requiredRole }) {
  const { currentUser } = useUser();

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to dashboard
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required role (if specified)
  return children;
}

export default ProtectedRoute;
