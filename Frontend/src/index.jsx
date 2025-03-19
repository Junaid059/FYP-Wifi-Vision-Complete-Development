import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { requestForToken, onMessageListener } from './firebaseConfig';
import { Toaster, toast } from 'sonner';

const root = ReactDOM.createRoot(document.getElementById('root'));
requestForToken();
onMessageListener()
  .then((payload) => {
    console.log('Foreground notification received:', payload);
    const { title, body } = payload.notification || {};

    toast(`${title}: ${body}`); // Simple toast notification
  })
  .catch((err) => console.log('Error handling FCM message:', err));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
