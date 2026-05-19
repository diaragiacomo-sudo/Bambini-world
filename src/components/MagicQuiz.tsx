/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Trophy } from "lucide-react";
import { MagicButton } from "./MagicButton";
import { cn } from "@/src/lib/utils";

const QUIZ_DATA = {
  natura: [
    {
      q: "Qual è il colore delle foglie in primavera?",
      options: ["Rosso", "Verde", "Blu", "Rosa"],
      a: 1
    },
    {
      q: "Cosa brilla in cielo di notte?",
      options: ["Il Sole", "La Luna", "Una Lampadina", "Un Gelato"],
      a: 1
    }
  ],
  animali: [
    {
      q: "Quante sono le zampe di un ragnetto?",
      options: ["4", "6", "8", "2"],
      a: 2
    },
    {
      q: "Quale animale fa 'Miao'?",
      options: ["Cane", "Gatto", "Mucca", "Papera"],
      a: 1
    }
  ],
  spazio: [
    {
      q: "Qual è il pianeta rosso?",
      options: ["Marte", "Venere", "Terra", "Giove"],
      a: 0
    },
    {
      q: "Il Sole è una...",
      options: ["Pianeta", "Luna", "Stella", "Cometa"],
      a: 2
    }
  ]
};

export const MagicQuiz = () => {
  const [category, setCategory] = useState<keyof typeof QUIZ_DATA | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const QUESTIONS = category ? QUIZ_DATA[category] : [];

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === QUESTIONS[currentStep].a) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(s => s + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const reset = () => {
    setCategory(null);
    setCurrentStep(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
  };

  if (!category) {
    return (
      <div className="p-8 bg-white rounded-[2rem] shadow-xl border-4 border-brand-sky/20">
        <h4 className="text-2xl font-black text-slate-800 mb-6 text-center">Scegli una Categoria! 🎯</h4>
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(QUIZ_DATA).map((cat) => (
            <MagicButton 
              key={cat} 
              variant={cat === 'natura' ? 'mint' : cat === 'animali' ? 'pink' : 'sky'}
              onClick={() => setCategory(cat as keyof typeof QUIZ_DATA)}
              className="w-full capitalize"
            >
              {cat}
            </MagicButton>
          ))}
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-brand-sky/10 rounded-[2rem] border-4 border-brand-sky/30 relative overflow-hidden"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-10 -right-10 w-40 h-40 bg-brand-yellow opacity-10 rounded-full"
        />
        <Trophy size={64} className="mx-auto text-brand-yellow mb-4 drop-shadow-lg" />
        <h4 className="text-3xl font-black mb-2">Bravissimo! 🌟</h4>
        <p className="text-xl mb-6">Hai risposto bene a {score} domande su {QUESTIONS.length}!</p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-4 rounded-2xl shadow-md inline-flex items-center gap-3 mb-8 border-2 border-brand-mint"
        >
          <span className="text-2xl">🏅</span>
          <div className="text-left">
            <div className="font-bold text-[10px] text-slate-500 uppercase">Medaglia Sbloccata</div>
            <div className="font-black text-slate-800">Piccolo Esploratore</div>
          </div>
        </motion.div>
        
        <br />
        <MagicButton variant="sky" onClick={reset}>Gioca ancora!</MagicButton>
      </motion.div>
    );
  }

  const current = QUESTIONS[currentStep];

  return (
    <div className="p-8 bg-white rounded-[2rem] shadow-xl border-4 border-brand-sky/20">
      <div className="flex justify-between items-center mb-8">
        <span className="font-bold text-brand-sky">Domanda {currentStep + 1} di {QUESTIONS.length}</span>
        <div className="flex gap-2">
          {QUESTIONS.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                i === currentStep ? "bg-brand-sky" : i < currentStep ? "bg-brand-mint" : "bg-slate-200"
              )} 
            />
          ))}
        </div>
      </div>

      <h4 className="text-2xl font-black text-slate-800 mb-8">{current.q}</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={cn(
              "p-4 rounded-2xl text-lg font-bold transition-all border-4 flex items-center justify-between group",
              selected === null && "bg-slate-50 border-transparent hover:border-brand-sky hover:bg-brand-sky/5",
              selected === i && i === current.a && "bg-brand-mint/20 border-brand-mint text-green-900",
              selected === i && i !== current.a && "bg-brand-pink/20 border-brand-pink text-pink-900",
              selected !== null && i === current.a && "bg-brand-mint/20 border-brand-mint",
              selected !== null && i !== current.a && i !== selected && "opacity-50"
            )}
          >
            {opt}
            {selected === i && i === current.a && <Check />}
            {selected === i && i !== current.a && <X />}
          </button>
        ))}
      </div>
    </div>
  );
};
