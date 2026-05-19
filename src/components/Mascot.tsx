/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

export const Mascot = ({ className }: { className?: string }) => {
  return (
    <motion.div
      animate={{ 
        y: [0, -15, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      <div className="relative w-32 h-32 md:w-48 md:h-48 group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-brand-yellow blur-2xl opacity-40 group-hover:opacity-60 transition-opacity rounded-full" />
        
        {/* Star Body */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          <path 
            d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" 
            fill="#FEF08A" 
            stroke="#FACC15" 
            strokeWidth="2"
          />
          
          {/* Eyes */}
          <circle cx="35" cy="45" r="5" fill="#1E293B" />
          <circle cx="65" cy="45" r="5" fill="#1E293B" />
          
          {/* Eye reflections */}
          <circle cx="37" cy="43" r="1.5" fill="white" />
          <circle cx="67" cy="43" r="1.5" fill="white" />
          
          {/* Blush */}
          <circle cx="30" cy="55" r="4" fill="#FBCFE8" opacity="0.6" />
          <circle cx="70" cy="55" r="4" fill="#FBCFE8" opacity="0.6" />
          
          {/* Mouth */}
          <path 
            d="M40 60 Q50 70 60 60" 
            stroke="#1E293B" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round" 
          />
        </svg>

        {/* Floating Medals/Rewards */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-4 -right-4 w-12 h-12 bg-brand-pink border-4 border-white rounded-full flex items-center justify-center shadow-md"
        >
          <span className="text-xl">✨</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
