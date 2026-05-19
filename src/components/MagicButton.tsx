/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { type LucideIcon } from "lucide-react";

interface MagicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'sky' | 'yellow' | 'mint' | 'pink' | 'orange';
  icon?: LucideIcon;
}

const variants = {
  sky: "btn-3d-sky",
  yellow: "btn-3d-yellow",
  mint: "btn-3d-mint",
  pink: "btn-3d-pink",
  orange: "btn-3d-orange",
};

export const MagicButton = ({ 
  children, 
  onClick, 
  className, 
  variant = 'sky',
  icon: Icon
}: MagicButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "px-8 py-3 rounded-full text-xl font-bold transition-all flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon size={24} />}
      {children}
    </motion.button>
  );
};
