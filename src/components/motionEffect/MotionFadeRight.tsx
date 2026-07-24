'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
const MotionFadeRight = ({ children, className }: { children?: ReactNode; className?: string }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 150 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.7 } }}
    >
      {children}
    </motion.div>
  );
};
export default MotionFadeRight;
