import { motion } from 'framer-motion'

export function FloatingCard({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
        y: {
          type: "spring",
          damping: 10,
          stiffness: 100,
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FloatingElement({ children, className }) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

