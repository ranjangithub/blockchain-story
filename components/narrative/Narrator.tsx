"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface NarratorProps {
  children: ReactNode;
  className?: string;
}

export default function Narrator({ children, className = "" }: NarratorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`text-zinc-300 leading-relaxed text-lg max-w-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
