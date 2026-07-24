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
      delay: 0.04 * index,
    },
  }),
};

const MotionStaggerEffectButton = ({ id, children, className }: { id: number; children: ReactNode; className?: string }) => {
  return (
    <>
      {/* Animate on mount (not whileInView): a button must never stay stuck
          invisible/untappable if the IntersectionObserver misfires on iOS Safari. */}
      <motion.button className={className} key={id} variants={variable} initial="initial" animate="animate" custom={id}>
        {children}
      </motion.button>
    </>
  );
};

export default MotionStaggerEffectButton;
