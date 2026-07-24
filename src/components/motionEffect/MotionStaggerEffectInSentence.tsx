"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const variable = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * index,
    },
  }),
};

const MotionStaggerEffectInSentence = ({
  id,
  children,
  className,
}: {
  id: number;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <motion.span
        className={className}
        key={id}
        variants={variable}
        initial="initial"
        animate="animate"
        custom={id}
      >
        {children !== " " ? children : "\u00A0"}
      </motion.span>
    </>
  );
};

export default MotionStaggerEffectInSentence;
