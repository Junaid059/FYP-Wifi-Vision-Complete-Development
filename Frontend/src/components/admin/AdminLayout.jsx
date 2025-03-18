import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import {
  Shield,
  Users,
  Settings,
  LogOut,
  Home,
  BarChart2,
  Bell,
  Search,
  HelpCircle,
  UserPlus,
  Database,
  Menu,
} from 'lucide-react';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Toaster } from 'sonner';

function AdminLayout({ children }) {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setIsClient(true);

    const timer = setTimeout(() => {
      setIsLoading(false);

      if (!currentUser) {
        console.log('No user found, redirecting to login');
        navigate('/');
      } else if (currentUser.role !== 'admin') {
        console.log('User is not admin, redirecting to home');
        navigate('/');
      } else {
        console.log('Admin user confirmed:', currentUser.username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div
        className={`border-r border-gray-200 bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            {isSidebarOpen && (
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  WiFi Vision
                </h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-gray-200"></div>

        <div className="p-4">
          {isSidebarOpen && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                {isSidebarOpen ? 'Main' : ''}
              </p>
              <Button
                variant="ghost"
                className={`w-full justify-${
                  isSidebarOpen ? 'start' : 'center'
                } px-3 py-2`}
                onClick={() => navigate('/admin')}
              >
                <BarChart2 className="h-5 w-5 mr-2" />
                {isSidebarOpen && <span>Dashboard</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-${
                  isSidebarOpen ? 'start' : 'center'
                } px-3 py-2`}
                onClick={() => navigate('/admin/users')}
              >
                <Users className="h-5 w-5 mr-2" />
                {isSidebarOpen && <span>User Management</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-${
                  isSidebarOpen ? 'start' : 'center'
                } px-3 py-2`}
                onClick={() => navigate('/admin/users/new')}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                {isSidebarOpen && <span>Create User</span>}
              </Button>
            </div>

            {/* <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                {isSidebarOpen ? 'System' : ''}
              </p>
              <Button
                variant="ghost"
                className={`w-full justify-${
                  isSidebarOpen ? 'start' : 'center'
                } px-3 py-2`}
              >
                <Settings className="h-5 w-5 mr-2" />
                {isSidebarOpen && <span>Settings</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-${
                  isSidebarOpen ? 'start' : 'center'
                } px-3 py-2`}
              >
                <Database className="h-5 w-5 mr-2" />
                {isSidebarOpen && <span>Database</span>}
              </Button>
            </div> */}
          </div>
        </div>

        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt={currentUser.username}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {currentUser.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isSidebarOpen && (
                <div>
                  <p className="text-sm font-medium">{currentUser.username}</p>
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {currentUser.role}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-4"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>

              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="hidden md:flex"
              >
                <Home className="mr-2 h-4 w-4" />
                Return to App
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default AdminLayout;
