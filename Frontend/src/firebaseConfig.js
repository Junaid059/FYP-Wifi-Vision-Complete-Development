import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );
      console.log('Service Worker Registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker Registration Failed:', error);
    }
  }
  return null;
};

export const requestForToken = async () => {
  try {
    const swRegistration = await registerServiceWorker(); // ✅ Register SW first
    if (!swRegistration) throw new Error('Service Worker not registered.');

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY, // Ensure it's in .env
      serviceWorkerRegistration: swRegistration, // ✅ Use registered SW
    });

    if (token) {
      console.log('FCM Token:', token);
      return token;
    } else {
      console.warn('No FCM token available.');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

// Foreground message listener
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      resolve(payload);
    });
  });

// Enable persistence for better offline support
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('Firestore persistence enabled');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn(
          'Multiple tabs open, persistence can only be enabled in one tab at a time.'
        );
      } else if (err.code === 'unimplemented') {
        console.warn(
          'The current browser does not support all of the features required to enable persistence'
        );
      } else {
        console.error('Error enabling persistence:', err);
      }
    });
} catch (error) {
  console.error('Error setting up persistence:', error);
}

// Set auth persistence to SESSION instead of LOCAL
// This will clear the auth state when the browser is closed
try {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Auth persistence set to SESSION');
    })
    .catch((error) => {
      console.error('Error setting auth persistence:', error);
    });
} catch (error) {
  console.error('Error setting up auth persistence:', error);
}

export { db, auth, messaging, getToken, onMessage };
