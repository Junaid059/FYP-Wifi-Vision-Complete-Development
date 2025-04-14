import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Button } from '../ui/button';
import axios from 'axios';
import AIModelVisualization from './ModelVisualizer';
import { CollapsibleFAQ } from './CollapsibleFaqs';
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronRight,
  ArrowRight,
  Wifi,
} from 'lucide-react';

// Custom hook for smooth scrolling
const useSmoothScroll = () => {
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' &&
        target.getAttribute('href')?.startsWith('#')
      ) {
        e.preventDefault();
        const targetId = target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for header
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
};

// Animated section component
const AnimatedSection = ({ children, id, className }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Main component
const LandingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    message: '',
    phone: '',
    company: '',
  });
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollY, setScrollY] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Use the smooth scroll hook
  useSmoothScroll();

  // Handle scroll events for parallax and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Determine active section
      const sections = [
        'hero',
        'features',
        'how-it-works',
        'benefits',
        'testimonials',
        'contact',
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Save form data to Firebase
      const docRef = await addDoc(collection(db, 'contactSubmissions'), {
        ...formData,
        timestamp: serverTimestamp(),
      });

      const response = await axios.post(
        'http://localhost:3000/admin/add-connection-request',
        {
          username: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message,
        }
      );

      if (response.status === 200) {
        console.log('Saved to DB');
      }

      const emailresponse = await axios.post('http://localhost:3000/admin/send-email',
        {
          username: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message,
        }
      );


      if(emailresponse.status === 200) {
        console.log('Email sent successfully');
      }

      console.log('Form submitted with ID:', docRef.id);
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        email: '',
        name: '',
        message: '',
        phone: '',
        company: '',
      });

      // Show success message
      alert('Thank you for your interest! We will contact you soon.');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        'There was an error submitting your form. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  // FAQ data
  const faqItems = [
    {
      question: 'How does WifiVision work without cameras?',
      answer:
        'WifiVision uses advanced AI algorithms to analyze WiFi signal patterns that are disrupted by human presence, eliminating the need for traditional cameras while maintaining privacy.',
    },
    {
      question: 'Is installation complicated?',
      answer:
        'Not at all! WifiVision is designed for easy setup. Simply plug in the devices, connect to your WiFi network, and follow the app instructions to complete the setup.',
    },
    {
      question: 'Can I access monitoring remotely?',
      answer:
        'Yes, our secure cloud platform allows you to monitor your space from anywhere using our mobile app or web dashboard.',
    },
    {
      question: 'How accurate is the detection?',
      answer:
        'WifiVision achieves over 95% accuracy in detecting human presence and movement, with continuous improvements via AI learning algorithms.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Absolutely. We use end-to-end encryption for all data transmission and storage. Your privacy and security are our top priorities.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col text-gray-100 bg-gray-900 overflow-hidden">
      <header className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold hover:cursor" href="#WiVi">
            WIVI
          </h1>
          <nav className="space-x-6">
            <a href="#about" className="hover:text-cyan-400 transition-colors">
              About
            </a>
            <a
              href="#pricing"
              className="hover:text-cyan-400 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#features"
              className="hover:text-cyan-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#contact"
              className="hover:text-cyan-400 transition-colors"
            >
              Contact
            </a>
            <Button
              onClick={navigateToLogin}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-6 rounded-full font-medium text-center shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-1 transition-all duration-300"
            >
              Already a member? Login
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section with Three.js Animation */}
      <section
        id="hero"
        className="relative min-h-[100vh] flex items-center overflow-hidden pt-20"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-gray-800"></div>

        {/* Wave animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-full">
            {/* First wave */}
            <div className="absolute top-[20%] w-[200%] left-[-50%]">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-[200px] rotate-[3deg]"
              >
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  className="fill-gray-800"
                  style={{
                    animation:
                      'wave 15s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite',
                  }}
                ></path>
              </svg>
            </div>

            {/* Second wave */}
            <div className="absolute top-[35%] w-[200%] left-[-50%]">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-[180px] rotate-[-2deg]"
              >
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  className="fill-gray-900"
                  style={{
                    animation:
                      'wave 12s cubic-bezier(0.36, 0.45, 0.63, 0.53) -3s infinite reverse',
                  }}
                ></path>
              </svg>
            </div>

            {/* Third wave */}
            <div className="absolute top-[50%] w-[200%] left-[-50%]">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-[220px] rotate-[1deg]"
              >
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  className="fill-blue-900/50"
                  style={{
                    animation:
                      'wave 18s cubic-bezier(0.36, 0.45, 0.63, 0.53) -5s infinite',
                  }}
                ></path>
              </svg>
            </div>

            {/* Fourth wave - added for more movement */}
            <div className="absolute top-[60%] w-[200%] left-[-50%]">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-[150px] rotate-[-1deg]"
              >
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  className="fill-cyan-950/60"
                  style={{
                    animation:
                      'wave 10s cubic-bezier(0.36, 0.45, 0.63, 0.53) -2s infinite reverse',
                  }}
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* CSS Animation for waves */}
        <style jsx global>{`
          @keyframes wave {
            0% {
              transform: translateX(0%);
            }
            50% {
              transform: translateX(-30%);
            }
            100% {
              transform: translateX(0%);
            }
          }
        `}</style>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AI-Powered
                </span>{' '}
                Home Security Without Cameras
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
                Detect presence, monitor movement, and secure your home using
                innovative Wi-Fi signal technology. Non-intrusive and always
                vigilant.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="#contact"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-8 rounded-full font-medium text-center shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-1 transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.a>
                <motion.a
                  href="#how-it-works"
                  className="bg-transparent text-white py-3 px-8 rounded-full font-medium text-center border-2 border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <AnimatedSection
        id="features"
        className="py-24 bg-gray-900 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2322d3ee' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-cyan-900/50 text-cyan-400 text-sm font-medium mb-4">
                Key Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Innovative Security Technology
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our system uses Wi-Fi signal patterns to detect and monitor
                movement without traditional cameras, providing unparalleled
                security with complete privacy.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ),
                title: 'Non-Intrusive Surveillance',
                description:
                  'Eliminates the need for traditional costly surveillance cameras while providing full coverage detection.',
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: 'Real-Time Detection',
                description:
                  'Continuously analyzes Wi-Fi signal strength to detect human activities and objects in real-time.',
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                ),
                title: 'Remote Accessibility',
                description:
                  'Monitor your spaces from anywhere via our cloud-based application for peace of mind when away.',
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: 'Energy Efficient',
                description:
                  'Uses power-efficient ESP32 microcontrollers with long service life and minimal maintenance.',
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: 'Works in All Conditions',
                description:
                  'Not affected by poor lighting or occlusion, ensuring reliable performance in different conditions.',
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                ),
                title: 'Visual Indicators',
                description:
                  'Includes heatmaps and markers to visualize detected objects for easy interpretation of security status.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-cyan-900/20 group hover:-translate-y-2 hover:border-cyan-500/50"
              >
                <div className="text-cyan-400 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection
        id="faq"
        className="py-24 bg-gray-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-80" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2322d3ee' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-cyan-900/50 text-cyan-400 text-sm font-medium mb-4">
                Questions & Answers
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Find answers to common questions about our technology,
                installation, and service.
              </p>
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto">
            <CollapsibleFAQ faqs={faqItems} />
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Form Section */}
      <AnimatedSection
        id="contact"
        className="py-24 bg-gray-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-80" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2322d3ee' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-cyan-900/50 text-cyan-400 text-sm font-medium mb-4">
                Get In Touch
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Contact Us
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Have questions about WifiVision? We're here to help. Fill out
                the form below and our team will get back to you shortly.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-900/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">
                Sign Up For Our Services
              </h3>
              {submitError && (
                <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-6">
                  {submitError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="your email"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-gray-300 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="0300-12345678"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-gray-300 mb-2"
                    >
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Your Company"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    {isSubmitting ? 'Submitting...' : 'Sign Up Now'}
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-900/20">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-cyan-900/30 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        Phone
                      </h4>
                      <p className="text-gray-300">0300-12345678</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Mon-Fri from 9am to 6pm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-cyan-900/30 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        Email
                      </h4>
                      <p className="text-gray-300">info@wifivision.com</p>
                      <p className="text-gray-400 text-sm mt-1">
                        We'll respond as soon as possible
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-cyan-900/30 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        Location
                      </h4>
                      <p className="text-gray-300">123 Innovation Drive</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Islamabad, PK
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-900/20">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  Frequently Asked Questions
                </h3>
                <CollapsibleFAQ faqs={faqItems} />
              </div> */}
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 to-blue-900" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg shadow-cyan-500/20">
                  <Wifi className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold">WIVI</h2>
              </div>
              <p className="text-gray-400 mb-6">
                Innovative home security without cameras. Privacy-focused,
                AI-powered protection for your peace of mind.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {[
                  'features',
                  'how-it-works',
                  'benefits',
                  'testimonials',
                  'contact',
                ].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link}`}
                      className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                    >
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {link
                        .split('-')
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Resources</h3>
              <ul className="space-y-4">
                {[
                  'Blog',
                  'Support Center',
                  'FAQ',
                  'Privacy Policy',
                  'Terms of Service',
                ].map((resource) => (
                  <li key={resource}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                    >
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {resource}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for the latest updates and security
                tips.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-l-lg w-full focus:outline-none bg-gray-800 border border-gray-700 text-white"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-3 rounded-r-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} WIVI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
