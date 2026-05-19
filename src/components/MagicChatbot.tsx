/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/src/lib/utils";

export const MagicChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: "Ciao bambini! Sono Bunny, il vostro amico magico. Vi sto ascoltando! 🐰✨", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    const currentInput = input.toLowerCase();
    setInput("");

    // Simple reactive responses for kids
    setTimeout(() => {
      let botResponse = "Che bello! Dimmi di più! 🌈";
      if (currentInput.includes("ciao")) botResponse = "Ciao carissimo! Come va oggi nel mondo magico? 😊";
      else if (currentInput.includes("gioco")) botResponse = "I giochi sono fantastici! Hai provato il nostro quiz? 🎮";
      else if (currentInput.includes("storia") || currentInput.includes("fiaba")) botResponse = "Adoro le storie! Chiedimi di crearne una nel generatore! 📖";
      
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="mb-4 w-[320px] md:w-[380px] bg-white rounded-[2.5rem] shadow-2xl border-4 border-brand-sky overflow-hidden flex flex-col h-[450px]"
          >
            {/* Header */}
            <div className="bg-brand-sky p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="text-3xl bg-white rounded-full w-10 h-10 flex items-center justify-center">🐰</div>
                <div className="font-black text-lg">Amico Bunny</div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-brand-sky/5">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.isBot ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl font-medium text-sm md:text-base shadow-sm",
                    msg.isBot 
                      ? "bg-white text-slate-800 rounded-tl-none border-2 border-slate-100" 
                      : "bg-brand-pink text-white ml-auto rounded-tr-none"
                  )}
                >
                  {msg.text}
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t-2 border-slate-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Scrivi a Bunny..."
                className="flex-1 px-4 py-2 rounded-full bg-slate-50 border-2 border-transparent focus:border-brand-sky outline-none font-medium transition-all"
              />
              <button 
                onClick={handleSend}
                className="bg-brand-sky text-white p-2 rounded-full hover:scale-110 active:scale-95 transition-transform shadow-md"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 md:w-20 md:h-20 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all border-4",
          isOpen ? "bg-white border-brand-pink text-brand-pink" : "bg-brand-pink border-white text-white"
        )}
      >
        {isOpen ? <X size={32} /> : "🐰"}
      </motion.button>
    </div>
  );
};
