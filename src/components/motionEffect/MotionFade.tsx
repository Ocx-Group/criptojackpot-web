"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
const MotionFade = ({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => {
  return (
    <motion.div
      onClick={onClick}
      className={className}
      initial={{ opacity: 0, scale: 0.5, y: 40 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7 },
      }}
    >
      {children}
    </motion.div>
  );
};
export default MotionFade;
