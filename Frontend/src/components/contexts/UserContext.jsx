import { createContext, useContext, useState, useEffect } from 'react';

// Define user types
export const UserRole = {
  ADMIN: 'admin',
  SUPER: 'super',
  USER: 'user',
};

const UserContext = createContext(undefined);

// Mock data for initial users
const initialUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@wifivision.com',
    role: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '2',
    username: 'superuser',
    email: 'super@wifivision.com',
    role: UserRole.SUPER,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '3',
    username: 'user1',
    email: 'user1@example.com',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '4',
    username: 'user2',
    email: 'user2@example.com',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    isActive: false,
  },
];

// Mock passwords for demo (in a real app, you'd never store passwords like this)
const mockPasswords = {
  admin: 'admin123',
  superuser: 'super123',
  user1: 'password123',
  user2: 'password123',
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add this function at the beginning of the UserProvider component to clear any stored user on initial load
  useEffect(() => {
    // Clear any stored user on initial load to ensure we always start at login
    localStorage.removeItem('currentUser');
    setCurrentUser(null);

    // This will only run once when the app starts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      console.log('UserContext: Found stored user');
      setCurrentUser(JSON.parse(storedUser));
    } else {
      console.log('UserContext: No stored user found');
    }

    // Load stored users if available
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with default users
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);

    // Update localStorage
    localStorage.setItem('users', JSON.stringify([...users, newUser]));

    return newUser;
  };

  const updateUser = (id, userData) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id === id ? { ...user, ...userData } : user
      );

      // Update localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      return updatedUsers;
    });

    // Update current user if it's the one being updated
    if (currentUser?.id === id) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (id) => {
    setUsers((prevUsers) => {
      const filteredUsers = prevUsers.filter((user) => user.id !== id);

      // Update localStorage
      localStorage.setItem('users', JSON.stringify(filteredUsers));

      return filteredUsers;
    });

    // If the deleted user is the current user, log them out
    if (currentUser?.id === id) {
      logout();
    }
  };

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('UserContext: Attempting login for', username);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user exists and password matches
      const user = users.find((u) => u.username === username);

      if (!user || mockPasswords[username] !== password) {
        console.log('UserContext: Invalid credentials');
        setError('Invalid username or password');
        setIsLoading(false);
        return false;
      }

      if (!user.isActive) {
        console.log('UserContext: User account inactive');
        setError('Your account is inactive. Please contact an administrator.');
        setIsLoading(false);
        return false;
      }

      // Update last login
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      updateUser(user.id, { lastLogin: updatedUser.lastLogin });

      // Set current user
      console.log('UserContext: { lastLogin: updatedUser.lastLogin }');

      // Set current user
      console.log(
        'UserContext: Login successful for',
        updatedUser.username,
        'Role:',
        updatedUser.role
      );
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('UserContext: Login error:', err);
      setError('An error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    console.log('UserContext: Logging out user');
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const getUserById = (id) => {
    return users.find((user) => user.id === id);
  };

  const value = {
    users,
    currentUser,
    isLoading,
    error,
    addUser,
    updateUser,
    deleteUser,
    login,
    logout,
    getUserById,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
