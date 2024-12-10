import { motion } from 'framer-motion'

export function HourglassLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative w-32 h-48">
        {/* Hourglass Container */}
        <div className="absolute inset-0 border-4 border-blue-600 rounded-lg" />
        
        {/* Top Chamber */}
        <motion.div
          className="absolute top-2 left-1/2 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2"
          animate={{
            y: [0, 160],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Bottom Chamber - Accumulating Sand */}
        <motion.div
          className="absolute bottom-2 left-1/2 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2"
          animate={{
            scaleY: [0, 1],
            opacity: [0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Hourglass Shape */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-40 border-4 border-blue-600 rounded-full transform rotate-45" />
        </div>
      </div>
    </div>
  )
}

