/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { RefreshCw, Trophy } from "lucide-react";
import { MagicButton } from "./MagicButton";
import { cn } from "@/src/lib/utils";

const GRID_SIZE = 3; // 3x3 puzzle
const IMAGES = [
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&h=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516233226914-d3f02197fe94?q=80&w=400&h=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=400&h=400&auto=format&fit=crop",
];

export const MagicPuzzle = () => {
  const [imgIndex, setImgIndex] = useState(0);
  const [pieces, setPieces] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  const initPuzzle = () => {
    const newPieces = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
    // Shuffle
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
    }
    setPieces(newPieces);
    setIsSolved(false);
  };

  useEffect(() => {
    initPuzzle();
  }, [imgIndex]);

  const swapPieces = (idx1: number, idx2: number) => {
    const newPieces = [...pieces];
    [newPieces[idx1], newPieces[idx2]] = [newPieces[idx2], newPieces[idx1]];
    setPieces(newPieces);

    // Check if solved
    const solved = newPieces.every((val, index) => val === index);
    if (solved) setIsSolved(true);
  };

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handlePieceClick = (idx: number) => {
    if (isSolved) return;
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else {
      swapPieces(selectedIdx, idx);
      setSelectedIdx(null);
    }
  };

  return (
    <div className="bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-brand-mint/20 text-center">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-slate-800">Puzzle Magico! 🧩</h3>
        <div className="flex gap-2">
            <button 
                onClick={() => setImgIndex((prev) => (prev + 1) % IMAGES.length)}
                className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                title="Cambia Immagine"
            >
                <RefreshCw size={20} className="text-slate-600" />
            </button>
            <button 
                onClick={initPuzzle}
                className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                title="Ricomincia"
            >
                <RefreshCw size={20} className="text-brand-mint" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[400px] mx-auto aspect-square bg-slate-200 p-2 rounded-2xl relative overflow-hidden">
        {pieces.map((pieceVal, idx) => {
          const row = Math.floor(pieceVal / GRID_SIZE);
          const col = pieceVal % GRID_SIZE;
          return (
            <motion.div
              layout
              key={`${pieceVal}-${imgIndex}`}
              onClick={() => handlePieceClick(idx)}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-lg transition-shadow",
                selectedIdx === idx ? "ring-4 ring-brand-mint scale-95 shadow-inner" : "hover:scale-[1.02]"
              )}
            >
              <div 
                className="absolute inset-0 w-[300%] h-[300%]"
                style={{
                  backgroundImage: `url(${IMAGES[imgIndex]})`,
                  backgroundSize: '100% 100%',
                  left: `-${col * 100}%`,
                  top: `-${row * 100}%`
                }}
              />
            </motion.div>
          );
        })}

        {isSolved && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-10 bg-brand-mint/90 flex flex-col items-center justify-center text-white"
          >
            <Trophy size={80} className="mb-4 animate-bounce" />
            <h4 className="text-4xl font-black mb-2">Bravissimo!</h4>
            <p className="font-bold mb-6 italic text-brand-mint-bg">Hai ricomposto la magia!</p>
            <MagicButton variant="yellow" onClick={initPuzzle}>Gioca Ancora</MagicButton>
          </motion.div>
        )}
      </div>

      <p className="mt-8 text-slate-500 font-medium italic">Clicca su due pezzi per scambiarli di posto!</p>
    </div>
  );
};
