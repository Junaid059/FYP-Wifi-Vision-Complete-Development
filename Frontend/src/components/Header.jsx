import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Shield, User, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUser } from './contexts/UserContext';

function Header({ isLoggedIn, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // Fixed role for regular users
  });

  // Get user context directly - don't store in state
  const { currentUser, addUser } = useUser();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      window.location.href = '/login';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      // Use the addUser function directly from context
      await addUser({
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: 'user', // Always set to 'user' as per your requirement
        isActive: true,
      });

      toast.success('User added successfully', {
        description: `${newUser.username} has been added as a regular user`,
      });

      // Reset form and close dialog
      setNewUser({
        username: '',
        email: '',
        password: '',
        role: 'user',
      });
      setIsAddUserOpen(false);
    } catch (error) {
      toast.error('Error adding user', {
        description: error.message || 'Failed to create user',
      });
    }
  };

  // Only show Add User option for super users or admin users
  const isSuperUser =
    currentUser?.role === 'super' || currentUser?.role === 'admin';

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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <User className="h-5 w-5 mr-2" />
                        {currentUser?.username || 'User'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem>Profile</DropdownMenuItem>

                      {/* Add User Option - Only visible to super users */}
                      {isSuperUser && (
                        <DropdownMenuItem
                          onClick={() => setIsAddUserOpen(true)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add User
                        </DropdownMenuItem>
                      )}

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

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <Card className="border-0 shadow-none">
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" name="role" value="regular user" disabled />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </CardFooter>
            </Card>
          </form>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
}

export default Header;
