/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Gamepad2, 
  Palette, 
  Video, 
  Heart, 
  Settings, 
  Menu, 
  X,
  Volume2,
  VolumeX,
  Star as StarIcon,
  PlayCircle,
  Lightbulb
} from "lucide-react";
import { Mascot } from "./components/Mascot";
import { MagicButton } from "./components/MagicButton";
import { MagicQuiz } from "./components/MagicQuiz";
import { Cloud, Star, Rainbow } from "./components/MagicShapes";
import { cn } from "./lib/utils";

const NAV_ITEMS = [
  { name: "Fiabe", icon: BookOpen, color: "pink" },
  { name: "Giochi", icon: Gamepad2, color: "sky" },
  { name: "Creatività", icon: Palette, color: "orange" },
  { name: "Video", icon: Video, color: "mint" },
  { name: "Per Genitori", icon: Heart, color: "yellow" },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [loadingStory, setLoadingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [storyTopic, setStoryTopic] = useState("");

  const generateStory = async () => {
    setLoadingStory(true);
    try {
      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: storyTopic }),
      });
      const data = await res.json();
      setGeneratedStory(data.story);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStory(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E0F2FE] to-[#F0F9FF] overflow-x-hidden font-sans">
      {/* Background Shapes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-20 w-40 h-16 bg-white rounded-full shadow-[0_10px_0_#E2E8F0] opacity-80" />
        <div className="absolute top-32 left-10 w-24 h-10 bg-white rounded-full shadow-[0_10px_0_#E2E8F0] opacity-60" />
        <Star className="absolute top-1/4 left-1/3" />
        <Star className="absolute bottom-1/4 right-1/4" delay={1} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b-4 border-[#BAE6FD]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-[0_4px_0_#EAB308]">
            <span className="text-xl">✨</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-brand-sky tracking-tight">
            MondoMagico
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.name}
              className={cn(
                "px-6 py-2 rounded-full font-bold text-lg transition-all",
                item.color === "sky" && "bg-brand-sky text-white shadow-[0_4px_0_#0284C7]",
                item.color === "yellow" && "bg-brand-yellow text-amber-900 shadow-[0_4px_0_#CA8A04]",
                item.color === "mint" && "bg-brand-mint text-emerald-900 shadow-[0_4px_0_#16A34A]",
                item.color === "pink" && "bg-brand-pink text-white shadow-[0_4px_0_#BE185D]",
                item.color === "orange" && "bg-brand-orange text-white shadow-[0_4px_0_#C2410C]",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="p-3 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
          >
            {isSoundOn ? <Volume2 className="text-brand-pink" /> : <VolumeX className="text-slate-400" />}
          </button>
          <button 
            className="lg:hidden p-3 bg-white rounded-full shadow-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 px-6 pt-12 pb-24 md:pt-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[80px] font-black text-slate-800 leading-[1.1] mb-8"
          >
            Esplora, Impara e <span className="text-brand-sky">Sorridi!</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-slate-500 mb-10 max-w-xl font-medium leading-relaxed"
          >
            Benvenuti nel piccolo mondo magico dove ogni giorno è una nuova avventura colorata tra draghi gentili e stelle parlanti.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center md:justify-start gap-6 items-center"
          >
            <MagicButton variant="yellow" className="px-12 py-5 text-2xl rounded-[40px]">Inizia l'Avventura!</MagicButton>
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-brand-mint rounded-full flex items-center justify-center text-white shadow-[0_4px_0_#16A34A] cursor-pointer hover:translate-y-1 hover:shadow-none transition-all">
                 <PlayCircle size={28} />
               </div>
               <span className="font-bold text-slate-800 text-lg">Guarda il Trailer</span>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <Mascot className="relative z-10 scale-125 md:scale-150" />
        </div>
      </header>

      {/* Features Grid */}
      <main className="relative z-10 px-6 py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black text-slate-800 mb-4">Esplora le Attività 🚀</h3>
            <p className="text-lg text-slate-500">Abbiamo preparato tante sorprese per te!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            <ActivityCard 
              title="Fiabe Incantate" 
              desc="Storie magiche che prendono vita."
              icon={BookOpen}
              color="pink"
            />
            <ActivityCard 
              title="Giochi Educativi" 
              desc="Mini quiz e giochi per diventare super intelligenti."
              icon={Gamepad2}
              color="sky"
            />
            <ActivityCard 
              title="Laboratorio" 
              desc="Impara a disegnare e creare cose bellissime."
              icon={Palette}
              color="orange"
            />
            <ActivityCard 
              title="Piccoli Scienziati" 
              desc="Video brevi per scoprire come funziona il mondo."
              icon={Video}
              color="mint"
            />
          </div>

          {/* AI Story Generator Section */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-brand-pink/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink opacity-10 rounded-bl-full -z-10" />
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl md:text-5xl font-black text-slate-800 mb-6">Generatore di Fiabe 📖✨</h3>
              <p className="text-lg text-slate-600 mb-8 font-medium">
                Scegli un tema (es. bosco, razzo, draghetto) e lascia che la magia crei una storia per te!
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 mb-12">
                <input 
                  type="text" 
                  value={storyTopic}
                  onChange={(e) => setStoryTopic(e.target.value)}
                  placeholder="Di cosa vuoi leggere oggi? 🧚"
                  className="flex-1 px-8 py-4 rounded-full text-xl border-4 border-brand-pink/10 focus:border-brand-pink focus:outline-none bg-brand-pink/5 placeholder:text-brand-pink/60 transition-all"
                />
                <MagicButton 
                  variant="pink" 
                  onClick={generateStory}
                  className="whitespace-nowrap"
                >
                  {loadingStory ? "Creando Magia..." : "Crea Fiaba!"}
                </MagicButton>
              </div>

              <AnimatePresence mode="wait">
                {generatedStory && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-8 bg-brand-pink/5 rounded-3xl border-2 border-dashed border-brand-pink/30 text-left relative"
                  >
                    <div className="absolute -top-4 -left-4 text-4xl transform -rotate-12">💭</div>
                    <div className="absolute -bottom-4 -right-4 text-4xl transform rotate-12">✨</div>
                    <p className="text-xl text-slate-700 leading-relaxed whitespace-pre-wrap font-medium italic">
                      {generatedStory}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Educational Game Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-24">
            <div>
              <h3 className="text-3xl font-black text-slate-800 mb-6">Sfida la tua Mente! 🧠</h3>
              <p className="text-lg text-slate-600 mb-8 font-medium">
                Ogni giorno un piccolo quiz per scoprire nuove cose sul mondo che ci circonda.
              </p>
              <div className="p-6 bg-brand-sky/10 rounded-3xl border-2 border-brand-sky/20 flex items-center gap-4">
                 <div className="text-4xl">🏅</div>
                 <div>
                    <div className="font-black text-slate-800">Guadagna Medaglie!</div>
                    <div className="text-slate-600">Completa il quiz per sbloccare il badge di oggi.</div>
                 </div>
              </div>
            </div>
            <MagicQuiz />
          </div>

          {/* Magic Slider Section */}
          <div className="mt-32">
             <div className="text-center mb-12">
                <h3 className="text-3xl font-black text-slate-800 mb-4">Mondi da Sogno 🌈</h3>
                <p className="text-slate-500">I luoghi più belli della nostra fantasia!</p>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-8 snap-x no-scrollbar">
                {[
                  { t: "Il Bosco delle Fate", i: "🌲✨", c: "mint" },
                  { t: "L'Isola Volante", i: "🏝️☁️", c: "sky" },
                  { t: "Il Vulcano di Cioccolato", i: "🌋🍫", c: "orange" },
                  { t: "La Luna di Formaggio", i: "🌙🧀", c: "yellow" },
                  { t: "Il Mondo Rainbow", i: "🌈🦄", c: "pink" },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      "snap-center min-w-[280px] h-[350px] rounded-[3rem] p-8 flex flex-col items-center justify-center text-center border-4 relative overflow-hidden",
                      item.c === 'mint' && "bg-brand-mint/20 border-brand-mint text-green-900",
                      item.c === 'sky' && "bg-brand-sky/20 border-brand-sky text-sky-900",
                      item.c === 'orange' && "bg-brand-orange/20 border-brand-orange text-orange-900",
                      item.c === 'pink' && "bg-brand-pink/20 border-brand-pink text-pink-900",
                      item.c === 'yellow' && "bg-brand-yellow/20 border-brand-yellow text-yellow-900",
                    )}
                  >
                    <div className="text-7xl mb-6">{item.i}</div>
                    <div className="text-2xl font-black">{item.t}</div>
                    <div className="absolute top-4 right-6 text-sm font-bold opacity-30 italic">#Magia{idx}</div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </main>

      {/* Parents Section Preview */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="bg-brand-yellow/30 p-8 md:p-16 rounded-[3rem] border-4 border-dashed border-brand-yellow flex flex-col md:flex-row items-center gap-12 shadow-2xl">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4 text-brand-orange">
              <Heart fill="currentColor" size={24} />
              <span className="font-bold text-lg uppercase tracking-wider">Per i Grandi</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-slate-800 mb-6">Area Protetta per i Genitori</h3>
            <p className="text-lg text-slate-700 mb-8 leading-relaxed">
              Gestisci il tempo di gioco, scopri le attività educative consigliate e monitora i progressi dei tuoi piccoli esploratori in totale sicurezza.
            </p>
            <MagicButton variant="yellow" icon={Settings} className="bg-white hover:bg-slate-50 border-slate-200">
              Gestisci Account
            </MagicButton>
          </div>
          <div className="flex-1 w-full flex justify-center">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-center">
                   <div className="text-3xl mb-2">🛡️</div>
                   <div className="font-bold">Sicuro</div>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm text-center">
                   <div className="text-3xl mb-2">⏰</div>
                   <div className="font-bold">Timer</div>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm text-center">
                   <div className="text-3xl mb-2">📊</div>
                   <div className="font-bold">Report</div>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm text-center">
                   <div className="text-3xl mb-2">🧑‍🏫</div>
                   <div className="font-bold">Scuola</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#334155] border-t-4 border-[#1E293B] py-8 px-10 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[14px]">© 2026 MondoMagico - Sicurezza Certificata per Bambini</div>
          <div className="flex flex-wrap justify-center gap-8 text-[14px] font-medium">
             <span className="cursor-pointer hover:text-brand-pink italic underline underline-offset-4 decoration-sky-400">Privacy Policy</span>
             <span className="cursor-pointer hover:text-brand-pink italic underline underline-offset-4 decoration-sky-400">Contatti</span>
             <span className="cursor-pointer hover:text-brand-pink italic underline underline-offset-4 decoration-sky-400">Guida per i piccoli</span>
          </div>
          <div className="flex gap-3">
             <div className="w-8 h-8 bg-[#475569] rounded-full" />
             <div className="w-8 h-8 bg-[#475569] rounded-full" />
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-0 z-[100] bg-white p-8 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-12">
               <span className="font-black text-2xl">MENU 🌈</span>
               <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-brand-sky/20 rounded-full"><X /></button>
            </div>
            <div className="flex flex-col gap-8 items-center">
               {NAV_ITEMS.map((item) => (
                 <button 
                  key={item.name}
                  className="text-3xl font-black text-slate-800 flex items-center gap-4"
                 >
                   <item.icon size={32} className={cn(
                     item.color === 'pink' && "text-brand-pink",
                     item.color === 'sky' && "text-brand-sky",
                     item.color === 'orange' && "text-brand-orange",
                     item.color === 'mint' && "text-brand-mint",
                     item.color === 'yellow' && "text-brand-yellow",
                   )} />
                   {item.name}
                 </button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActivityCard({ title, desc, icon: Icon, color }: { title: string, desc: string, icon: any, color: 'pink' | 'sky' | 'orange' | 'mint' }) {
  const colors = {
    pink: "bg-brand-pink-bg border-brand-pink hover:border-pink-300 shadow-[0_6px_0_#F472B6]",
    sky: "bg-brand-sky-bg border-brand-sky hover:border-sky-300 shadow-[0_6px_0_#38BDF8]",
    orange: "bg-brand-orange-bg border-brand-orange hover:border-orange-300 shadow-[0_6px_0_#FB923C]",
    mint: "bg-brand-mint-bg border-brand-mint hover:border-green-300 shadow-[0_6px_0_#4ADE80]",
  };

  const iconColors = {
    pink: "bg-[#FDA4AF]",
    sky: "bg-[#BAE6FD]",
    orange: "bg-[#FED7AA]",
    mint: "bg-[#BBF7D0]",
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={cn(
        "p-8 rounded-[32px] border-b-[6px] transition-all cursor-pointer group text-center bg-white",
        colors[color]
      )}
    >
      <div className={cn(
        "w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto mb-4 text-4xl",
        iconColors[color]
      )}>
        <Icon size={40} />
      </div>
      <h3 className="text-[20px] font-black text-slate-800 mb-2">{title}</h3>
      <p className="text-[14px] text-slate-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

