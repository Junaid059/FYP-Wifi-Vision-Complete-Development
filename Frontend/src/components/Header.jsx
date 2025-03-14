import { Button } from '@/components/ui/button';
import { Bell, Menu, LogOut, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Router, useNavigate } from 'react-router-dom';

function Header({ isLoggedIn, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/login');
    }
  };

  const goToAdmin = () => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    } else {
      toast({
        title: 'Access Denied',
        description: "You don't have permission to access the admin panel.",
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.header
      className="bg-white shadow-lg py-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Wifi Vision</h1>
          </motion.div>
          {isLoggedIn && (
            <>
              <motion.nav
                className="hidden md:flex items-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, staggerChildren: 0.1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Dashboard
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 relative"
                      >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex flex-col items-start">
                        <div className="font-medium">System Alert</div>
                        <div className="text-xs text-gray-500">
                          Motion detected in Zone 3
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          2 minutes ago
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start">
                        <div className="font-medium">Security Update</div>
                        <div className="text-xs text-gray-500">
                          New firmware available
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          1 hour ago
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-blue-600 text-center">
                        View all notifications
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <User className="h-5 w-5 mr-2" />
                        {user?.username}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={goToAdmin}>
                        Admin Panel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              </motion.nav>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
