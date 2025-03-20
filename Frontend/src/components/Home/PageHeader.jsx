import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';

export function PageHeader({ activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-md py-3 shadow-lg shadow-cyan-900/10'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg shadow-cyan-500/20">
              <Wifi className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              WifiGuard
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 items-center">
            {[
              'features',
              'how-it-works',
              'benefits',
              'testimonials',
              'contact',
            ].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`relative font-medium transition-colors duration-300 ${
                  activeSection === section
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-cyan-400'
                }`}
              >
                {section
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
                {activeSection === section && (
                  <motion.span
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400"
                  />
                )}
              </a>
            ))}
            <a
              href="#login"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2.5 px-6 rounded-full font-medium hover:shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Already a member? Login
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={
          isMenuOpen
            ? { height: 'auto', opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        className="lg:hidden overflow-hidden bg-black/90 border-t border-cyan-900/30 mt-3"
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            {[
              'features',
              'how-it-works',
              'benefits',
              'testimonials',
              'contact',
            ].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`font-medium py-2 ${
                  activeSection === section ? 'text-cyan-400' : 'text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {section
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </a>
            ))}
            <a
              href="#login"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2.5 px-6 rounded-full font-medium text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Already a member? Login
            </a>
          </nav>
        </div>
      </motion.div>
    </header>
  );
}
