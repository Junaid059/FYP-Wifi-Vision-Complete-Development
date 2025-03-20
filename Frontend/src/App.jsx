import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './components/contexts/UserContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import LoginPage from './components/pages/LoginPage';
import HomePage from './components/pages/HomePage';
import AdminPage from './components/pages/AdminPage';
import AdminUsersPage from './components/pages/AdminUsersPage';
import AdminNewUserPage from './components/pages/AdminNewUserPage';
import UserDashboardPage from './components/pages/UserDashboardPage';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';

// ✅ Check Firebase Connection
function FirebaseConnectionCheck() {
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        console.log('✅ Firebase is connected. Users collection found!');
        setConnectionStatus('connected');
      } catch (error) {
        console.error('❌ Firebase connection error:', error);
        setConnectionStatus('error');
      }
    };

    testFirebase();
  }, []);

  return null; // This component doesn't render anything
}

// ✅ Auth Guard to Protect Routes
function AuthGuard({ children, requiredRole = null }) {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only redirect after we've checked auth state
    if (!isLoading && !hasChecked) {
      setHasChecked(true);

      if (!currentUser) {
        // No user is logged in, redirect to login
        navigate('/login', { replace: true });
      } else if (requiredRole && currentUser.role !== requiredRole) {
        // User doesn't have required role, redirect based on their role
        if (currentUser.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (currentUser.role === 'super') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/user-dashboard', { replace: true });
        }
      }
    }
  }, [currentUser, isLoading, navigate, requiredRole, hasChecked]);

  // Show loading state while checking auth
  if (isLoading || !hasChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  // If not loading and we have the right user, render children
  if (!isLoading && currentUser) {
    if (!requiredRole || currentUser.role === requiredRole) {
      return children;
    }
  }

  // Otherwise render nothing while redirecting
  return null;
}

function App() {
  // Always sign out when the app first loads
  useEffect(() => {
    const clearAuthOnStartup = async () => {
      try {
        await signOut(auth);
        console.log('Auth state cleared on application startup');
      } catch (error) {
        console.error('Error clearing auth state:', error);
      }
    };

    clearAuthOnStartup();
  }, []);

  return (
    <UserProvider>
      <ThemeProvider defaultTheme="light" attribute="class">
        <FirebaseConnectionCheck />
        <Routes>
          {/* Default route always redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Super user dashboard - protected for super role */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard requiredRole="super">
                <HomePage />
              </AuthGuard>
            }
          />

          {/* Regular user dashboard - protected for user role */}
          <Route
            path="/user-dashboard"
            element={
              <AuthGuard requiredRole="user">
                <UserDashboardPage />
              </AuthGuard>
            }
          />

          {/* Admin routes - protected for admin role only */}
          <Route
            path="/admin"
            element={
              <AuthGuard requiredRole="admin">
                <AdminPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AuthGuard requiredRole="admin">
                <AdminUsersPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/users/new"
            element={
              <AuthGuard requiredRole="admin">
                <AdminNewUserPage />
              </AuthGuard>
            }
          />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
