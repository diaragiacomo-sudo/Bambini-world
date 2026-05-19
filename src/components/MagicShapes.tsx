/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

export const Cloud = ({ className }: { className?: string }) => (
  <motion.div
    animate={{ x: [0, 20, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    className={className}
  >
    <svg width="120" height="80" viewBox="0 0 120 80" fill="white">
      <path d="M100 50C100 66.5685 86.5685 80 70 80C53.4315 80 40 66.5685 40 50C40 33.4315 53.4315 20 70 20C86.5685 20 100 33.4315 100 50Z" opacity="0.8" />
      <path d="M60 40C60 56.5685 46.5685 70 30 70C13.4315 70 0 56.5685 0 40C0 23.4315 13.4315 10 30 10C46.5685 10 60 23.4315 60 40Z" opacity="0.8" />
      <path d="M120 40C120 56.5685 106.5685 70 90 70C73.4315 70 60 56.5685 60 40C60 23.4315 73.4315 10 90 10C106.5685 10 120 23.4315 120 40Z" opacity="0.8" />
    </svg>
  </motion.div>
);

export const Star = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
  <motion.div
    animate={{ 
      scale: [1, 1.2, 1],
      rotate: [0, 15, 0],
      opacity: [1, 0.7, 1]
    }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
    className={className}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#FEF08A">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  </motion.div>
);

export const Rainbow = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg width="200" height="100" viewBox="0 0 200 100" fill="none">
      <path d="M10 100C10 50.2944 50.2944 10 100 10C149.706 10 190 50.2944 190 100" stroke="#FBCFE8" strokeWidth="12" />
      <path d="M30 100C30 61.3401 61.3401 30 100 30C138.66 30 170 61.3401 170 100" stroke="#FED7AA" strokeWidth="12" />
      <path d="M50 100C50 72.3858 72.3858 50 100 50C127.614 50 150 72.3858 150 100" stroke="#FEF08A" strokeWidth="12" />
      <path d="M70 100C70 83.4315 83.4315 70 100 70C116.569 70 130 83.4315 130 100" stroke="#BBF7D0" strokeWidth="12" />
    </svg>
  </div>
);
