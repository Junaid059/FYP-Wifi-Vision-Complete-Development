importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyDgBKwfsedrdsIsfe60 - aC_SDwHtYW34SA',
  authDomain: 'fyp-wivi.firebaseapp.com',
  projectId: 'fyp-wivi',
  storageBucket: 'fyp-wivi.appspot.com', // ✅ FIXED!
  messagingSenderId: '727104284456',
  appId: '1:727104284456:web:8c6fdac24a1375b4b4d21d',
  measurementId: 'G-B6T7K4XE23',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
