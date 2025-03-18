import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Login from '../Login';

export default function LoginPage() {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    console.log('Login successful for:', userData.username);
  };

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
