import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from './ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  LockKeyhole,
  Mail,
  AlertCircle,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { FloatingCard, FloatingElement } from './floating-card';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminExists, setAdminExists] = useState(true);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, login, checkAdminExists } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      // User is already logged in, redirect based on role
      if (currentUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [currentUser, navigate]);

  // Check if admin exists when component mounts
  useEffect(() => {
    const checkAdmin = async () => {
      setIsCheckingAdmin(true);
      try {
        const exists = await checkAdminExists();
        setAdminExists(exists);
      } catch (error) {
        console.error('Error checking admin:', error);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [checkAdminExists]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Login with Firebase
      const userData = await login(email, password);

      // Set the current user with role information
      setCurrentUser(userData);

      // Redirect based on role
      if (userData.role === 'admin') {
        toast.success('Admin login successful!');
        navigate('/admin');
      } else {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid login credentials');
      } else if (error.message === 'User account is not properly set up') {
        setError(
          'Your account is not properly set up. Please contact an administrator.'
        );
      } else {
        setError(error.message || 'An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 h-16 w-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
        </div>
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold text-blue-900">
            Initializing System
          </h3>
          <p className="mt-2 text-blue-600">Checking configuration status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 p-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex-col justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">WIVI</h1>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold tracking-tight">
            {adminExists
              ? 'Welcome back to your workspace'
              : 'Set up your admin account'}
          </h2>
          <p className="text-xl text-blue-100">
            {adminExists
              ? 'Securely access your dashboard and manage your resources with ease.'
              : 'Create your first admin account to get started with the system.'}
          </p>

          <div className="flex flex-col space-y-4 pt-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/30 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-blue-100">Enterprise-grade security</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/30 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-blue-100">Real-time data synchronization</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/30 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-blue-100">Intuitive user interface</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-blue-200">
          © {new Date().getFullYear()} WIVI. All rights reserved.
        </div>

        {/* Floating elements */}
        <FloatingElement
          className="absolute top-20 right-20 h-40 w-40 bg-blue-500/20 rounded-full blur-xl"
          xFactor={10}
          yFactor={15}
        />
        <FloatingElement
          className="absolute bottom-20 left-20 h-60 w-60 bg-blue-400/20 rounded-full blur-xl"
          xFactor={-10}
          yFactor={-15}
          delay={0.5}
        />
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <FloatingCard className="border-0 shadow-2xl bg-white rounded-2xl">
            <CardHeader className="space-y-1 text-center pb-2">
              <div className="md:hidden flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-blue-900">
                {adminExists ? 'Sign In' : 'Admin Setup'}
              </CardTitle>
              <CardDescription className="text-blue-600">
                {adminExists
                  ? 'Enter your credentials to access the system'
                  : 'Create the admin account to get started'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </motion.div>
              )}

              {adminExists ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-blue-900 flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4 text-blue-600" />
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 px-4 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-blue-900 flex items-center gap-2"
                      >
                        <LockKeyhole className="h-4 w-4 text-blue-600" />
                        Password
                      </Label>
                      <button
                        type="button"
                        className="text-xs font-medium text-blue-600 hover:text-blue-800"
                        onClick={() =>
                          toast.info(
                            'Password reset functionality would go here'
                          )
                        }
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 px-4 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                        <span className="sr-only">
                          {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-base font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 justify-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-center">
                        <span>Sign in</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>

                  <div className="relative flex items-center justify-center mt-8 mb-4">
                    <div className="border-t border-blue-100 absolute w-full"></div>
                    <span className="bg-white px-4 text-sm text-blue-500 relative">
                      or continue with
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => toast.info('Google login would go here')}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                      onClick={() =>
                        toast.info('Microsoft login would go here')
                      }
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#f25022" d="M1 1h10v10H1z" />
                        <path fill="#00a4ef" d="M1 13h10v10H1z" />
                        <path fill="#7fba00" d="M13 1h10v10H13z" />
                        <path fill="#ffb900" d="M13 13h10v10H13z" />
                      </svg>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => toast.info('Apple login would go here')}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44A4.51 4.51 0 0 1 19 16.5a11.12 11.12 0 0 1-1.38 2.65c-.83 1.17-1.69 2.34-3.05 2.36s-1.88-.69-3.51-.69-2.12.68-3.45.72-2.27-1.07-3.11-2.25C2.13 16.25 1 13 1 9.89a6.8 6.8 0 0 1 3.32-6.21 5.58 5.58 0 0 1 4.74.36A5.05 5.05 0 0 1 12 4a4.99 4.99 0 0 1 2.94.05 5.73 5.73 0 0 1 2.52 1.72 5.18 5.18 0 0 0-2 4.25 5.15 5.15 0 0 0 2 2.61z" />
                      </svg>
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="p-5 bg-amber-50 border border-amber-100 rounded-xl">
                    <h3 className="font-medium text-amber-800 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-amber-600" />
                      Initial Setup Required
                    </h3>
                    <p className="mt-2 text-sm text-amber-700">
                      No admin account has been created yet. Click the button
                      below to create the admin account with these default
                      credentials:
                    </p>
                    <div className="mt-3 p-4 bg-white rounded-xl border border-amber-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <LockKeyhole className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-amber-700">
                      You can change these credentials after logging in.
                    </p>
                  </div>

                  <Button
                    type="button"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-base font-medium"
                    onClick={handleCreateAdmin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 justify-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Admin Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-center">
                        <span>Create Admin Account</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>

            {adminExists && (
              <CardFooter className="flex justify-center pt-2 pb-6">
                <p className="text-sm text-blue-600">
                  Don't have an account?{' '}
                  <button
                    className="font-medium text-blue-700 hover:text-blue-900 hover:underline"
                    onClick={() =>
                      toast.info('Sign up functionality would go here')
                    }
                  >
                    Sign up
                  </button>
                </p>
              </CardFooter>
            )}
          </FloatingCard>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
