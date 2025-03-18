import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Login from '../Login';
import Dashboard from '../Dasboard';
import Header from '../Header';
import Footer from '../Footer';
import { useUser } from '../contexts/UserContext';

function HomePage() {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header isLoggedIn={true} user={currentUser} onLogout={logout} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Dashboard user={currentUser} />
      </main>
      <Footer />
    </motion.div>
  );
}

export default HomePage;
