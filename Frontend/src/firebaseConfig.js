// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

// Firebase configuration (Replace with your own Firebase keys)
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
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      console.log('Auth persistence set to SESSION');
    })
    .catch((error) => {
      console.error('Error setting auth persistence:', error);
    });
} catch (error) {
  console.error('Error setting up auth persistence:', error);
}

export { db, auth };
