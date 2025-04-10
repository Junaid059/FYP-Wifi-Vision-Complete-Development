'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig';
import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
};

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add token refresh mechanism directly in the context
  useEffect(() => {
    // Only set up token refresh if a user is logged in
    if (auth.currentUser) {
      // Force token refresh every 50 minutes (Firebase tokens expire after 1 hour)
      const tokenRefreshInterval = setInterval(async () => {
        try {
          const user = auth.currentUser;
          if (user) {
            // Force refresh the token
            await user.getIdToken(true);
            console.log('Auth token refreshed');
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }, 50 * 60 * 1000); // 50 minutes

      return () => clearInterval(tokenRefreshInterval);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      const usersRef = collection(db, 'users');
      const unsubscribe = onSnapshot(
        usersRef,
        (snapshot) => {
          const userList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(userList);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error fetching users:', error);
          setError(error.message);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Failed to set up users listener:', error);
      setError('Failed to connect to the database');
      setIsLoading(false);
    }
  }, []);

  // Track authenticated user state
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
              const userData = userDoc.data();
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                role: userData.role,
                ...userData,
              });
            } else {
              console.warn(
                'User exists in Auth but not in Firestore:',
                user.uid
              );
              setCurrentUser(null);
              await signOut(auth);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Failed to set up auth listener:', error);
      setError('Failed to connect to authentication');
      setIsLoading(false);
    }
  }, []);

  const checkAdminExists = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'admin'));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking for admin:', error);
      return false;
    }
  };

  const createAdminAccount = async (email, password) => {
    try {
      const adminExists = await checkAdminExists();
      if (adminExists) {
        throw new Error('An admin account already exists');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        username: 'Admin',
        email: email,
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
      });

      return {
        uid: user.uid,
        email: user.email,
        role: 'admin',
        username: 'Admin',
        isActive: true,
      };
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          uid: user.uid,
          email: user.email,
          role: userData.role,
          ...userData,
        };
      } else {
        console.log(
          'Creating Firestore document for existing Auth user:',
          user.uid
        );

        const isAdmin = email.toLowerCase() === 'adminwivi@gmail.com';

        const userData = {
          username: email.split('@')[0],
          email: email,
          role: isAdmin ? 'admin' : 'user',
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        await setDoc(userRef, userData);

        return {
          uid: user.uid,
          email: user.email,
          ...userData,
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const addUser = async (userData) => {
    try {
      // Store the current user's authentication state
      const currentAuthUser = auth.currentUser;

      // Create the new user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const uid = userCredential.user.uid;

      // IMPORTANT: Remove this line that was causing the logout
      // await signOut(auth);

      // If we have a current auth user, we need to restore their session
      if (currentAuthUser) {
        // Re-authenticate the current user if needed
        try {
          // Force update the current user to maintain admin session
          await auth.updateCurrentUser(currentAuthUser);
        } catch (error) {
          console.error('Error restoring admin session:', error);
          // Continue anyway - the user was created
        }
      }

      // Add the user to Firestore
      await setDoc(doc(db, 'users', uid), {
        username: userData.username,
        email: userData.email,
        role: userData.role || 'user',
        isActive: userData.isActive || true,
        createdAt: new Date().toISOString(),
        connection: userData.connection || null, // Add connection data support
      });

      return uid;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, userData);
      setUsers(
        users.map((user) => (user.id === id ? { ...user, ...userData } : user))
      );
      return true; // Return success flag
    } catch (error) {
      console.error('Error updating user:', error);
      return false; // Return failure flag
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter((user) => user.id !== id));
      return true; // Return success flag
    } catch (error) {
      console.error('Error deleting user:', error);
      return false; // Return failure flag
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        addUser,
        updateUser,
        deleteUser,
        login,
        logout,
        isLoading,
        error,
        createAdminAccount,
        checkAdminExists,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
