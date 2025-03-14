import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, User, Mail, Github, Facebook, Twitter } from 'lucide-react';
import { FloatingCard, FloatingElement } from './floating-card';
import { useUser } from '../components/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Login(onLogin) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { login, error, isLoading, currentUser } = useUser(); // Moved hook call outside conditional block

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both username and password',
        variant: 'destructive',
      });
      return;
    }

    const success = await login(username, password);

    if (success) {
      // Call the onLogin callback
      onLogin({ username });

      // Redirect based on role
      if (currentUser && currentUser.role === 'admin') {
        console.log('Admin login detected, redirecting to admin dashboard');
        navigate('/admin');
      } else {
        console.log('User login detected, redirecting to user dashboard');
        navigate('/dashboard');
      }
    } else if (error) {
      toast({
        title: 'Login Failed',
        description: error,
        variant: 'destructive',
      });
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    toast({
      title: 'Registration not available',
      description: 'Please contact an administrator to create an account.',
    });
  };

  const handleAdminLogin = async () => {
    setUsername('admin');
    setPassword('admin123');

    const success = await login('admin', 'admin123');

    if (success) {
      console.log(
        'Admin demo login successful, redirecting to admin dashboard'
      );
      navigate('/admin');
    } else if (error) {
      toast({
        title: 'Admin Login Failed',
        description: error || 'Could not log in with admin credentials',
        variant: 'destructive',
      });
    }
  };

  const handleUserLogin = async () => {
    setUsername('user1');
    setPassword('password123');
    await login('user1', 'password123');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600 clip-path-diagonal" />

      <div className="container mx-auto flex items-center justify-center h-full p-4 m-20">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
          {/* Form Section */}
          <Card className="p-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl border-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <motion.h1
                  className="text-3xl font-bold text-gray-900"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome to WIVI
                </motion.h1>
                <motion.p
                  className="text-gray-500 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Your security, our priority
                </motion.p>
              </div>

              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-blue-50 rounded-lg p-1">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="relative group">
                        <Input
                          type="text"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="pl-10 h-12 border-gray-200 rounded-xl group-hover:border-blue-400 transition-colors"
                        />
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors"
                          size={18}
                        />
                      </div>
                      <div className="relative group">
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="pl-10 h-12 border-gray-200 rounded-xl group-hover:border-blue-400 transition-colors"
                        />
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors"
                          size={18}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>

                      <div className="flex justify-center space-x-4 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAdminLogin}
                          className="text-sm"
                        >
                          Admin Demo
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleUserLogin}
                          className="text-sm"
                        >
                          User Demo
                        </Button>
                      </div>
                    </motion.div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="relative group">
                        <Input
                          type="text"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="pl-10 h-12 border-gray-200 rounded-xl group-hover:border-blue-400 transition-colors"
                        />
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors"
                          size={18}
                        />
                      </div>
                      <div className="relative group">
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 h-12 border-gray-200 rounded-xl group-hover:border-blue-400 transition-colors"
                        />
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors"
                          size={18}
                        />
                      </div>
                      <div className="relative group">
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="pl-10 h-12 border-gray-200 rounded-xl group-hover:border-blue-400 transition-colors"
                        />
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors"
                          size={18}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Sign Up
                      </Button>
                    </motion.div>
                  </form>
                </TabsContent>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 border-gray-200 hover:bg-blue-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      width="24px"
                      height="24px"
                      className="mr-2"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.5 0 6.3 1.2 8.4 2.3l6.2-6.2C34.4 2.5 29.5 1 24 1 14.8 1 6.9 6.8 3.5 15.3l7.4 5.7C12.8 13.8 18 9.5 24 9.5z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 47c5.4 0 10.1-1.8 13.5-5.1l-7-5.7C28.6 37.4 26.4 38 24 38c-5.2 0-9.6-3.4-11.2-8.2l-7.5 5.8C8.6 42.8 15.7 47 24 47z"
                      />
                      <path
                        fill="#4A90E2"
                        d="M43.6 20H24v8.9h11.2c-1 4.1-4.8 7.1-11.2 7.1-6.5 0-11.7-5.4-11.7-12s5.2-12 11.7-12c3.4 0 6.3 1.3 8.4 3.4l6.2-6.2C35.6 4.6 30.2 2 24 2 13.3 2 4.6 9.6 4.6 20S13.3 38 24 38c8.2 0 15-5.8 15-14 0-.9-.1-1.9-.4-3z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M24 14c2.7 0 4.6 1.1 5.7 2.2l4.1-4.1C31.3 9.6 28.4 8 24 8c-5.2 0-9.6 3.5-11.2 8.3l7.4 5.7C21 14.3 22.4 14 24 14z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-12 border-gray-200 hover:bg-blue-50"
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-12 border-gray-200 hover:bg-blue-50"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </Button>
                </div>
              </Tabs>
            </motion.div>
          </Card>

          {/* Decorative Elements */}
          <div className="hidden md:block relative h-full">
            <FloatingCard
              className="absolute top-10 right-10 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg w-64"
              delay={0.4}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">wivi</h3>
                  <p className="text-sm text-gray-500">
                    follow us on Social Media
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
              </div>
            </FloatingCard>

            <FloatingElement className="absolute bottom-20 right-20 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg w-72">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Twitter className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Twitter</h3>
                  <p className="text-sm text-gray-500">Photo Sharing</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full w-2/3"></div>
                <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
              </div>
            </FloatingElement>

            <FloatingCard
              className="absolute top-1/2 left-10 transform -translate-y-1/2 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg w-56"
              delay={0.6}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="font-bold">WV</span>
                </div>
                <div>
                  <h3 className="font-semibold">Wifi Vision</h3>
                  <p className="text-sm text-blue-200">Security</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                <div className="h-2 bg-white/20 rounded-full w-1/2"></div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>
    </div>
  );
}
