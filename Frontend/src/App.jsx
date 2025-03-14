'use client';

import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './components/contexts/UserContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import LoginPage from './components/pages/LoginPage';
import HomePage from './components/pages/HomePage'; // This uses the existing Dashboard component
import AdminPage from './components/pages/AdminPage';
import AdminUsersPage from './components/pages/AdminUsersPage';
import AdminNewUserPage from './components/pages/AdminNewUserPage';
import { useUser } from './components/contexts/UserContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Route guard component that checks authentication
function AuthGuard({ children, requiredRole = null }) {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // If a specific role is required and user doesn't have it
    if (requiredRole && currentUser.role !== requiredRole) {
      // Redirect admin to admin dashboard, regular users to user dashboard
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, navigate, requiredRole]);

  // If no user, don't render anything while redirecting
  if (!currentUser) return null;

  // If role is required and user doesn't have it, don't render
  if (requiredRole && currentUser.role !== requiredRole) return null;

  // Otherwise render the children
  return children;
}

function App() {
  return (
    <UserProvider>
      <ThemeProvider defaultTheme="light" attribute="class">
        <Routes>
          {/* Default route always redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* User dashboard - protected for any authenticated user */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <HomePage />
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
