import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';

export function FloatingCard({ children, className, ...props }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / 30) * -1;
    const rotY = x / 30;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={className}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <Card className={className}>{children}</Card>
    </motion.div>
  );
}

export function FloatingElement({
  className,
  xFactor = 10,
  yFactor = 10,
  delay = 0,
}) {
  return (
    <motion.div
      className={className}
      animate={{
        x: [0, xFactor, 0],
        y: [0, yFactor, 0],
      }}
      transition={{
        duration: 8,
        ease: 'easeInOut',
        times: [0, 0.5, 1],
        repeat: Number.POSITIVE_INFINITY,
        delay,
      }}
    />
  );
}
