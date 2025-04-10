import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './components/contexts/UserContext';
//import { UserProvider as UserRoleProvider } from './components/contexts/UserRoleContext'; // Import the UserRoleProvider
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import LoginPage from './components/pages/LoginPage';
import HomePage from './components/pages/HomePage';
import AdminPage from './components/pages/AdminPage';
import AdminUsersPage from './components/pages/AdminUsersPage';
import AdminNewUserPage from './components/pages/AdminNewUserPage';
import AdminUserDataPage from './components/pages/AdminUserDataPage';
import UserDashboardPage from './components/pages/UserDashboardPage';
import LandingPage from './components/Home/LandingPage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

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
  return (
    <UserProvider>
      {/* Add the UserRoleProvider here */}
      {/* <UserRoleProvider> */}
      <ThemeProvider defaultTheme="light" attribute="class">
        <FirebaseConnectionCheck />
        <Routes>
          {/* Default route now shows the landing page */}
          <Route path="/" element={<LandingPage />} />

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
          {/* Updated route path to match the URL you're trying to access */}
          <Route
            path="/admin/users/data"
            element={
              <AuthGuard requiredRole="admin">
                <AdminUserDataPage />
              </AuthGuard>
            }
          />
          {/* Keep the original route as well for backward compatibility */}
          <Route
            path="/admin/user/data"
            element={
              <AuthGuard requiredRole="admin">
                <AdminUserDataPage />
              </AuthGuard>
            }
          />
        </Routes>
        <Toaster />
      </ThemeProvider>
      {/* </UserRoleProvider> */}
    </UserProvider>
  );
}

export default App;
