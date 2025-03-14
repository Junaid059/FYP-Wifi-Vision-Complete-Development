import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Login from '../Login';

export default function LoginPage() {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Handle login success
  const handleLoginSuccess = (userData) => {
    // The actual navigation will happen in the useEffect below
    // This is just a callback for the Login component
    console.log('Login successful for:', userData.username);
  };

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    if (currentUser) {
      console.log(
        'User already logged in:',
        currentUser.username,
        'Role:',
        currentUser.role
      );

      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, navigate]);

  return <Login onLogin={handleLoginSuccess} />;
}
