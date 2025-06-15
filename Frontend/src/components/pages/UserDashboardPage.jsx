import { useUser } from '../contexts/UserContext';
// import UserDashboard from '../UserDashboard';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';

export default function UserDashboardPage() {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            User Dashboard
          </h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <UserDashboard user={currentUser} />
      </main>
      <div>
        <Footer />
      </div>
    </div>
  );
}
