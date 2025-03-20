'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, User, Radio } from 'lucide-react';

const WifiSignalAnimation = () => {
  const [animationStep, setAnimationStep] = useState(0);

  // Control the animation sequence with delays
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStep(1), 1000), // Start emitting signals after 1s
      setTimeout(() => setAnimationStep(2), 3000), // Signals reach AI after 3s
      setTimeout(() => setAnimationStep(3), 5000), // AI detects human after 5s
      setTimeout(() => setAnimationStep(4), 7000), // Complete animation after 7s
      setTimeout(() => setAnimationStep(0), 9000), // Reset animation after 9s
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  // Restart animation when it completes
  useEffect(() => {
    if (animationStep === 4) {
      const resetTimer = setTimeout(() => setAnimationStep(0), 2000);
      return () => clearTimeout(resetTimer);
    }
  }, [animationStep]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 relative overflow-hidden">
      <div className="relative w-full max-w-3xl h-64 md:h-80">
        {/* WiFi Router */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Radio className="h-10 w-10 text-cyan-400 mb-2" />
          <span className="text-white text-sm">WiFi Router</span>

          {/* Signal Waves */}
          {animationStep >= 1 && (
            <>
              {[1, 2, 3].map((wave) => (
                <motion.div
                  key={wave}
                  className="absolute left-16 top-1/2 -translate-y-1/2 border-2 border-cyan-500/50 rounded-full"
                  initial={{ width: 0, height: 0, opacity: 0 }}
                  animate={{
                    width: wave * 40,
                    height: wave * 40,
                    opacity: [0, 0.5, 0],
                    x: [0, wave * 30],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: wave * 0.4,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* AI Model */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Cpu className="h-12 w-12 text-blue-500 mb-2" />
          <span className="text-white text-sm">AI Model</span>

          {/* Processing Animation */}
          {animationStep >= 2 && (
            <motion.div
              className="absolute inset-0 bg-blue-500/20 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: animationStep < 3 ? Number.POSITIVE_INFINITY : 0,
              }}
            />
          )}

          {/* Data Flow to Human */}
          {animationStep >= 3 && (
            <motion.div
              className="absolute w-full h-0.5 bg-gradient-to-r from-blue-500 to-green-500 right-0 top-1/2"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8 }}
              style={{ left: '100%' }}
            />
          )}
        </motion.div>

        {/* Human Detection */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <User className="h-10 w-10 text-green-400 mb-2" />
          <span className="text-white text-sm">Human Detected</span>

          {/* Detection Animation */}
          {animationStep >= 3 && (
            <>
              <motion.div
                className="absolute inset-0 border-2 border-green-500 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />

              {animationStep >= 4 && (
                <motion.div
                  className="absolute -inset-2 border border-green-500/50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              )}
            </>
          )}
        </motion.div>

        {/* Connection Lines */}
        <div className="absolute left-24 right-24 top-1/2 h-0.5 bg-gray-700" />

        {/* Animation Status Text */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center text-cyan-400 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {animationStep === 0 && 'Starting WiFi Analysis...'}
          {animationStep === 1 && 'Emitting WiFi Signals...'}
          {animationStep === 2 && 'Processing Signal Patterns...'}
          {animationStep === 3 && 'Detecting Human Presence...'}
          {animationStep === 4 && 'Human Detected Successfully!'}
        </motion.div>
      </div>
    </div>
  );
};

export default WifiSignalAnimation;
