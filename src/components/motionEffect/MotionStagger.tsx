'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const MotionStagger = ({ id, children, className }: { id: number; children: ReactNode; className?: string }) => {
  return (
    <motion.div
      className={className}
      key={id}
      initial={{
        opacity: 0,
        y: 50,
      }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.1 * id,
          duration: 0.6,
          ease: [0.6, -0.05, 0.01, 0.99],
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default MotionStagger;
