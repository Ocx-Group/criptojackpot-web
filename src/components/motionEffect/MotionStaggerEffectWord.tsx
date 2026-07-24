'use client';
import { motion } from 'framer-motion';

const MotionStaggerEffectWord = ({ text, className }: { text: string; className?: string }) => {
  return (
    <p className="inline-flex">
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className={className}
          initial={{
            opacity: 0,
            y: 70,
          }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.1 * index,
              type: 'spring',
              stiffness: 50,
            },
          }}
        >
          <span>{char}</span>
        </motion.span>
      ))}
    </p>
  );
};

export default MotionStaggerEffectWord;
