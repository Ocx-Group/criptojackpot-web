"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const variable = {
  initial: {
    opacity: 0,
    y: -30,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * index,
    },
  }),
};

const MotionStaggerEffectUl = ({ id, children, className }: { id: number; children: ReactNode; className?: string }) => {
  return (
    <>
      <motion.li className={className} key={id} variants={variable} initial="initial" animate="animate" custom={id}>
        {children}
      </motion.li>
    </>
  );
};

export default MotionStaggerEffectUl;
