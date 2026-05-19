/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
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
  Music,
  PlayCircle,
  Lightbulb
} from "lucide-react";
import { Mascot } from "./components/Mascot";
import { MagicButton } from "./components/MagicButton";
import { MagicChatbot } from "./components/MagicChatbot";
import { MagicQuiz } from "./components/MagicQuiz";
import { MagicCanvas } from "./components/MagicCanvas";
import { MagicPuzzle } from "./components/MagicPuzzle";
import { Cloud, Rainbow } from "./components/MagicShapes";
import { cn } from "./lib/utils";

const NAV_ITEMS = [
  { name: "Fiabe", icon: BookOpen, color: "pink" },
  { name: "Giochi", icon: Gamepad2, color: "sky" },
  { name: "Musica", icon: Volume2, color: "orange" },
  { name: "Creatività", icon: Palette, color: "mint" },
  { name: "Video", icon: Video, color: "yellow" },
  { name: "Per Genitori", icon: Heart, color: "pink" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [bgMusic] = useState(new Audio("https://www.singing-bell.com/wp-content/uploads/2015/01/Twinkle-Twinkle-Little-Star-Singing-Bell.mp3"));

  useEffect(() => {
    bgMusic.loop = true;
    bgMusic.volume = 0.15; // Volume low for background music
    if (isMusicOn && hasInteracted) {
      bgMusic.play().catch(e => console.log("Audio play blocked until user interaction", e));
    } else {
      bgMusic.pause();
    }
  }, [isMusicOn, bgMusic, hasInteracted]);

  // Handle first interaction anywhere
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener("click", handleFirstInteraction);
    };
    window.addEventListener("click", handleFirstInteraction);
    return () => window.removeEventListener("click", handleFirstInteraction);
  }, []);

  // Clean up
  useEffect(() => {
    return () => {
      bgMusic.pause();
      bgMusic.src = "";
    };
  }, [bgMusic]);

  const [loadingStory, setLoadingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [storyTopic, setStoryTopic] = useState("");

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

   const navigateTo = (section: string) => {
    setHasInteracted(true);
    setActiveSection(section.toLowerCase());
    setIsMenuOpen(false);
    setSelectedVideo(null); // Reset video on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!isSoundOn) return;

    const greetings: Record<string, string> = {
      home: "Ciao bambini, come state oggi?",
      giochi: "A cosa volete giocare oggi?",
      musica: "Che cosa volete ascoltare oggi?",
      creatività: "Che cosa volete creare oggi?"
    };

    const textToSpeak = greetings[activeSection];
    if (!textToSpeak) return;

    const speak = () => {
      const msg = new SpeechSynthesisUtterance(textToSpeak);
      msg.lang = "it-IT";
      
      const voices = window.speechSynthesis.getVoices();
      const italianVoices = voices.filter(v => v.lang.startsWith('it'));
      
      const femaleVoice = italianVoices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('alice') || 
        v.name.toLowerCase().includes('elsa') ||
        v.name.toLowerCase().includes('paola')
      ) || italianVoices[0];
      
      if (femaleVoice) msg.voice = femaleVoice;

      msg.onend = () => {
        if (activeSection === "home" && !isMusicOn) {
          setIsMusicOn(true);
        }
      };

      msg.pitch = 1.0;
      msg.rate = 0.85; 
      
      if (activeSection === 'home') {
        msg.pitch = 1.05;
        msg.rate = 0.9;
      }
      
      setTimeout(() => {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
      }, 300);
    };

    // Initial speak
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speak;
    } else {
      speak();
    }

    // Repeat every 30 seconds
    const intervalId = setInterval(speak, 30000);
    
    return () => {
      window.speechSynthesis.cancel();
      clearInterval(intervalId);
    };
  }, [activeSection, isSoundOn, isMusicOn]);

  const generateStory = async () => {
    setLoadingStory(true);
    setGeneratedStory("");
    setGeneratedImage(null);
    setGeneratedAudio(null);
    try {
      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: storyTopic }),
      });
      const data = await res.json();
      setGeneratedStory(data.story);
      setGeneratedImage(data.image);
      setGeneratedAudio(data.audio);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStory(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F7FA] relative overflow-x-hidden">
      {/* Cartoon Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated Sky Elements */}
        {/* Sun */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 md:right-32 text-6xl md:text-8xl flex items-center justify-center"
        >
          ☀️
        </motion.div>

        <motion.div 
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-1/4"
        >
          <Cloud />
        </motion.div>
        <motion.div 
          animate={{ x: [20, -20, 20] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-48 left-10 md:left-20"
        >
          <Cloud />
        </motion.div>
        
        {/* Cartoon Hills (Background) */}
        <svg className="absolute bottom-0 w-full h-[50vh] opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
           <path fill="#4ADE80" d="M0,160L80,170.7C160,181,320,203,480,186.7C640,171,800,117,960,117.3C1120,117,1280,171,1360,197.3L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>

        {/* Playground Elements (Distant silhouette style) */}
        <div className="absolute bottom-12 left-[15%] text-5xl opacity-40 -rotate-12">🛝</div>
        <div className="absolute bottom-24 right-[20%] text-6xl opacity-30 rotate-12">🎠</div>
        <div className="absolute bottom-32 left-1/2 text-4xl opacity-25">🌳</div>
        <div className="absolute bottom-40 right-1/4 text-3xl opacity-20">🦋</div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b-4 border-[#BAE6FD]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo("home")}>
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
              onClick={() => navigateTo(item.name === "Per Genitori" ? "genitori" : item.name)}
              className={cn(
                "px-6 py-2 rounded-full font-bold text-lg transition-all",
                activeSection === item.name.toLowerCase() || (activeSection === "genitori" && item.name === "Per Genitori")
                  ? "bg-slate-800 text-white scale-105"
                  : cn(
                      item.color === "sky" && "bg-brand-sky text-white shadow-[0_4px_0_#0284C7] hover:translate-y-[-2px]",
                      item.color === "yellow" && "bg-brand-yellow text-amber-900 shadow-[0_4px_0_#CA8A04] hover:translate-y-[-2px]",
                      item.color === "mint" && "bg-brand-mint text-emerald-900 shadow-[0_4px_0_#16A34A] hover:translate-y-[-2px]",
                      item.color === "pink" && "bg-brand-pink text-white shadow-[0_4px_0_#BE185D] hover:translate-y-[-2px]",
                      item.color === "orange" && "bg-brand-orange text-white shadow-[0_4px_0_#C2410C] hover:translate-y-[-2px]",
                    )
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMusicOn(!isMusicOn)}
            className={cn(
              "p-3 rounded-full shadow-md transition-all flex items-center gap-2",
              isMusicOn ? "bg-brand-sky text-white" : "bg-white text-slate-400"
            )}
            title={isMusicOn ? "Spegni Musica" : "Accendi Musica"}
          >
            <Music size={20} />
            <span className="hidden md:inline font-bold text-sm">{isMusicOn ? "Musica ON" : "Musica OFF"}</span>
          </button>
          <button 
            onClick={() => setIsSoundOn(!isSoundOn)}
            className={cn(
              "p-3 rounded-full shadow-md transition-all flex items-center gap-2",
              isSoundOn ? "bg-brand-pink text-white" : "bg-white text-slate-400"
            )}
            title={isSoundOn ? "Disattiva Voci" : "Attiva Voci"}
          >
            {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span className="hidden md:inline font-bold text-sm">{isSoundOn ? "Suoni ON" : "Suoni OFF"}</span>
          </button>
          <button 
            className="lg:hidden p-3 bg-white rounded-full shadow-md text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </button>
        </div>
      </nav>

      {/* Main Content Areas */}
      <AnimatePresence mode="wait">
        {activeSection === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
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
                  <MagicButton variant="yellow" onClick={() => navigateTo("giochi")} className="px-12 py-5 text-2xl rounded-[40px]">Inizia l'Avventura!</MagicButton>
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

            {/* Magic Play Section */}
            <section className="relative z-20 px-6 py-12 max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl relative aspect-[21/9] bg-brand-sky/10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1545627221-df3f3366f00e?q=80&w=1200&auto=format&fit=crop" 
                  alt="Bambini felici che saltano" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-sky/80 via-transparent to-transparent flex items-end justify-center pb-12">
                   <div className="text-white text-center px-4">
                      <motion.h4 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-2xl"
                      >
                        Il Divertimento è per Tutti! ⚽
                      </motion.h4>
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl font-bold italic drop-shadow-lg"
                      >
                        Giocare insieme è la magia più grande del mondo.
                      </motion.p>
                   </div>
                </div>
              </motion.div>
            </section>

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
                    onClick={() => navigateTo("fiabe")}
                  />
                  <ActivityCard 
                    title="Giochi Educativi" 
                    desc="Mini quiz e giochi per diventare super intelligenti."
                    icon={Gamepad2}
                    color="sky"
                    onClick={() => navigateTo("giochi")}
                  />
                  <ActivityCard 
                    title="Musica e Ballo" 
                    desc="Canta e balla con le canzoni magiche."
                    icon={Volume2}
                    color="orange"
                    onClick={() => navigateTo("musica")}
                  />
                  <ActivityCard 
                    title="Laboratorio" 
                    desc="Impara a disegnare e creare cose bellissime."
                    icon={Palette}
                    color="mint"
                    onClick={() => navigateTo("creatività")}
                  />
                  <ActivityCard 
                    title="Piccoli Scienziati" 
                    desc="Video brevi per scoprire come funziona il mondo."
                    icon={Video}
                    color="yellow"
                    onClick={() => navigateTo("video")}
                  />
                </div>
              </div>
            </main>
          </motion.div>
        )}

        {activeSection === "musica" && (
          <motion.div
            key="musica"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 px-6 py-24 max-w-7xl mx-auto"
          >
            <div className="mb-12 flex items-center gap-4">
               <button onClick={() => navigateTo("home")} className="p-4 bg-white rounded-full shadow-md text-2xl hover:scale-110 transition-transform">🏠</button>
               <h2 className="text-5xl font-black text-slate-800">Canta e Balla! 🎵</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 { t: "Le Ruote del Bus", d: "Girano e girano per tutta la città! Una canzone divertente con le parole.", color: "sky", icon: "🚌", url: "https://www.singing-bell.com/wp-content/uploads/2015/10/The-Wheels-on-the-Bus-Singing-Bell.mp3" },
                 { t: "Nella Vecchia Fattoria", d: "Quanti animali ci sono? Cantiamo insieme i loro versi!", color: "orange", icon: "🚜", url: "https://www.singing-bell.com/wp-content/uploads/2014/11/Old-MacDonald-Had-a-Farm-Singing-Bell.mp3" },
                 { t: "Se Sei Felice", d: "Batti le mani e canta con noi la gioia di essere amici.", color: "pink", icon: "👏", url: "https://www.singing-bell.com/wp-content/uploads/2015/05/If-Youre-Happy-and-You-Know-It-Singing-Bell.mp3" },
                 { t: "Incy Wincy Ragnetto", d: "La storia del piccolo ragnetto che sale sulla grondaia.", color: "mint", icon: "🕷️", url: "https://www.singing-bell.com/wp-content/uploads/2014/11/Itsy-Bitsy-Spider-Singing-Bell.mp3" },
                 { t: "Brilla Brilla Stellina", d: "Una dolce canzone per guardare il cielo di notte.", color: "yellow", icon: "⭐", url: "https://www.singing-bell.com/wp-content/uploads/2015/01/Twinkle-Twinkle-Little-Star-Singing-Bell.mp3" },
                 { t: "Cinque Scimmiette", d: "Saltano sul letto e... oh no! Quante ne restano?", color: "sky", icon: "🐒", url: "https://www.singing-bell.com/wp-content/uploads/2014/12/Five-Little-Monkeys-Singing-Bell.mp3" },
               ].map((song, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -10 }}
                   className={cn(
                     "p-8 rounded-[3rem] border-4 bg-white shadow-xl flex flex-col items-center text-center",
                     song.color === 'sky' && "border-brand-sky",
                     song.color === 'pink' && "border-brand-pink",
                     song.color === 'mint' && "border-brand-mint",
                     song.color === 'orange' && "border-brand-orange",
                     song.color === 'yellow' && "border-brand-yellow",
                   )}
                 >
                    <div className={cn(
                      "w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-inner",
                      song.color === 'sky' && "bg-brand-sky/20",
                      song.color === 'pink' && "bg-brand-pink/20",
                      song.color === 'mint' && "bg-brand-mint/20",
                      song.color === 'orange' && "bg-brand-orange/20",
                      song.color === 'yellow' && "bg-brand-yellow/20",
                    )}>
                       {song.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-3">{song.t}</h3>
                    <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">{song.d}</p>
                    <audio 
                      controls 
                      src={song.url} 
                      className="w-full h-10 accent-brand-sky rounded-full"
                    />
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}

        {activeSection === "fiabe" && (
          <motion.div
            key="fiabe"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="relative z-10 px-6 py-24 max-w-7xl mx-auto"
          >
            <div className="mb-12 flex items-center gap-4">
               <button onClick={() => navigateTo("home")} className="p-4 bg-white rounded-full shadow-md text-2xl hover:scale-110 transition-transform">🏠</button>
               <h2 className="text-5xl font-black text-slate-800">Fiabe Incantate 📖</h2>
            </div>
            {/* Move Generator here */}
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-brand-pink/20 overflow-hidden relative">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-3xl md:text-5xl font-black text-slate-800 mb-6">Generatore di Fiabe ✨</h3>
                <p className="text-lg text-slate-600 mb-8 font-medium">Scegli un tema e lascia che la magia crei una storia per te!</p>
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                  <input 
                    type="text" 
                    value={storyTopic}
                    onChange={(e) => setStoryTopic(e.target.value)}
                    placeholder="Di cosa vuoi leggere oggi? 🧚"
                    className="flex-1 px-8 py-4 rounded-full text-xl border-4 border-brand-pink/10 focus:border-brand-pink focus:outline-none bg-brand-pink/5"
                  />
                  <MagicButton variant="pink" onClick={generateStory}>{loadingStory ? "Creando..." : "Crea Fiaba!"}</MagicButton>
                </div>

                {loadingStory && (
                  <div className="mb-12">
                    <div className="flex justify-between mb-2 px-2">
                       <span className="text-brand-pink font-bold text-sm italic">Polvere magica in corso...</span>
                       <span className="text-brand-pink font-bold text-sm">85%</span>
                    </div>
                    <div className="w-full h-4 bg-brand-pink/10 rounded-full overflow-hidden border-2 border-brand-pink/20">
                       <motion.div 
                         initial={{ width: "0%" }}
                         animate={{ width: "100%" }}
                         transition={{ duration: 3 }}
                         className="h-full bg-brand-pink"
                       />
                    </div>
                  </div>
                )}

                {generatedStory && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="space-y-8"
                  >
                    {generatedImage && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl"
                      >
                        <img 
                          src={generatedImage} 
                          alt="Illustrazione Fiaba" 
                          className="w-full h-auto object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                    )}

                    {generatedAudio && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-brand-pink/10 rounded-full flex items-center gap-6 justify-center border-4 border-white shadow-xl"
                      >
                        <div className="text-3xl animate-bounce">🎧</div>
                        <audio 
                          controls 
                          src={generatedAudio} 
                          className="flex-1 h-10 accent-brand-pink" 
                          autoPlay={isSoundOn}
                        />
                      </motion.div>
                    )}

                    <div className="p-8 md:p-12 bg-white/50 backdrop-blur-sm rounded-[3rem] text-left border-4 border-dashed border-brand-pink/30 shadow-inner">
                      <div className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed whitespace-pre-wrap font-serif decoration-brand-pink underline-offset-8">
                        {generatedStory}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === "giochi" && (
          <motion.div
            key="giochi"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="relative z-10 px-6 py-24 max-w-7xl mx-auto"
          >
            <div className="mb-12 flex items-center gap-4">
               <button onClick={() => navigateTo("home")} className="p-4 bg-white rounded-full shadow-md text-2xl hover:scale-110 transition-transform">🏠</button>
               <h2 className="text-5xl font-black text-slate-800">Sala Giochi 🎮</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div><h3 className="text-3xl font-black mb-6">Sfida la tua Mente! 🧠</h3><MagicQuiz /></div>
               <div className="bg-brand-sky/10 p-8 rounded-3xl border-2 border-brand-sky/20">
                  <h4 className="text-2xl font-black mb-4 italic">Prossimamente...</h4>
                  <p className="text-slate-600">Altre sfide magiche e mini-giochi interattivi stanno per arrivare!</p>
               </div>
            </div>
          </motion.div>
        )}

        {activeSection === "creatività" && (
          <motion.div
            key="creatività"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="relative z-10 px-6 py-24 max-w-7xl mx-auto"
          >
            <div className="mb-12 flex items-center gap-4">
               <button onClick={() => navigateTo("home")} className="p-4 bg-white rounded-full shadow-md text-2xl hover:scale-110 transition-transform">🏠</button>
               <h2 className="text-5xl font-black text-slate-800">Laboratorio Creativo 🎨</h2>
            </div>
            <div className="grid grid-cols-1 gap-12">
               <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-slate-100">
                 <h3 className="text-3xl font-black mb-6 flex items-center gap-4">
                    <span className="p-3 bg-brand-orange/10 rounded-2xl text-2xl">🎨</span>
                    Il tuo Studio d'Arte ✨
                 </h3>
                 <p className="text-lg text-slate-600 mb-8 italic">Prendi i pennelli magici, scegli un disegno da colorare o crea il tuo capolavoro!</p>
                 <MagicCanvas />
               </div>

               <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-slate-100">
                 <h3 className="text-3xl font-black mb-6 flex items-center gap-4">
                    <span className="p-3 bg-brand-mint/10 rounded-2xl text-2xl">🧩</span>
                    Puzzle Magici
                 </h3>
                 <p className="text-lg text-slate-600 mb-8 italic">Metti insieme i pezzi del puzzle per svelare l'immagine segreta!</p>
                 <MagicPuzzle />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div className="p-8 bg-brand-pink-bg rounded-3xl border-4 border-brand-pink text-center">
                    <div className="text-5xl mb-4">🌈</div>
                    <h4 className="font-black text-xl mb-2">Colori Vivi</h4>
                    <p className="text-slate-500 text-sm">Usa i colori dell'arcobaleno per i tuoi disegni.</p>
                  </div>
                  <div className="p-8 bg-brand-sky-bg rounded-3xl border-4 border-brand-sky text-center">
                    <div className="text-5xl mb-4">✨</div>
                    <h4 className="font-black text-xl mb-2">Effetti Magici</h4>
                    <p className="text-slate-500 text-sm">Aggiungi brillantini virtuali ad ogni tratto.</p>
                  </div>
                  <div className="p-8 bg-brand-mint-bg rounded-3xl border-4 border-brand-mint text-center">
                    <div className="text-5xl mb-4">🏆</div>
                    <h4 className="font-black text-xl mb-2">Mostra d'Arte</h4>
                    <p className="text-slate-500 text-sm">Pubblica i tuoi lavori nella nostra galleria.</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeSection === "genitori" && (
          <motion.div
            key="genitori"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 px-6 py-24 max-w-7xl mx-auto"
          >
             <div className="mb-12 flex items-center gap-4">
               <button onClick={() => navigateTo("home")} className="p-4 bg-white rounded-full shadow-md text-2xl">🏠</button>
               <h2 className="text-5xl font-black text-slate-800">Area Genitori 🛡️</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-slate-100">
                     <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                        <Heart className="text-brand-pink" /> 
                        Benvenuti Cari Genitori
                     </h3>
                     <p className="text-slate-600 leading-relaxed mb-6">
                        In Piccolo Mondo Magico, la sicurezza è la nostra priorità. Questa dashboard vi permette di gestire l'esperienza digitale dei vostri figli in modo semplice e gratificante.
                     </p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
                           <div className="font-bold text-slate-400 text-xs uppercase mb-1">Tempo di Oggi</div>
                           <div className="text-3xl font-black text-slate-800">45 <span className="text-lg">min</span></div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
                           <div className="font-bold text-slate-400 text-xs uppercase mb-1">Attività Completate</div>
                           <div className="text-3xl font-black text-slate-800">12</div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-brand-mint/20">
                     <h3 className="text-2xl font-black mb-6">Consigli Educativi della Settimana</h3>
                     <div className="space-y-4">
                        {[
                          "L'importanza del disegno libero per lo sviluppo motorio.",
                          "Come discutere le fiabe serali con i propri figli.",
                          "Sviluppare l'empatia attraverso il gioco cooperativo."
                        ].map((tip, i) => (
                          <div key={i} className="flex gap-4 p-4 hover:bg-brand-mint-bg rounded-2xl transition-colors cursor-pointer border-2 border-transparent hover:border-brand-mint">
                             <div className="text-2xl">💡</div>
                             <div className="font-medium text-slate-700">{tip}</div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
                     <h3 className="text-xl font-black mb-6">Sicurezza 🔒</h3>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <span className="font-bold">Timer Sessione</span>
                           <div className="w-12 h-6 bg-brand-mint rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"/></div>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="font-bold">Filtro Contenuti</span>
                           <div className="w-12 h-6 bg-slate-700 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"/></div>
                        </div>
                        <MagicButton variant="pink" className="w-full text-lg">Modifica Codice PIN</MagicButton>
                     </div>
                  </div>

                  <div className="bg-brand-yellow p-8 rounded-[3rem] shadow-xl border-4 border-white">
                     <h3 className="text-xl font-black text-amber-900 mb-4">Supporto ✨</h3>
                     <p className="text-amber-800 text-sm font-medium mb-6">Hai bisogno di aiuto per navigare nel sito o configurare i limiti?</p>
                     <button className="w-full py-3 bg-white rounded-full font-bold text-amber-900 shadow-lg">Contatta Esperti</button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeSection === "video" && (
          <motion.div
            key="video"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 px-6 py-24 max-w-7xl mx-auto"
          >
            <div className="mb-12 flex items-center gap-4">
               <button onClick={() => navigateTo("home")} className="p-4 bg-white rounded-full shadow-md text-2xl hover:scale-110 transition-transform">🏠</button>
               <h2 className="text-5xl font-black text-slate-800">Video Curiosi 🎥</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 { t: "Il Ciclo dell'Acqua", d: "Scopri come nasce la pioggia!", c: "sky", e: "💧", id: "0v8i4v1oeT0" },
                 { t: "Viaggio nel Sistema Solare", d: "Esplora i pianeti con noi.", c: "yellow", e: "🌍", id: "I7mZ9vO9yV0" },
                 { t: "I Cinque Sensi", d: "Come sentiamo il mondo?", c: "pink", e: "👂", id: "vD98SHeLAt8" },
                 { t: "Festa degli Animali", d: "Canta e impara gli animali.", c: "mint", e: "🦁", id: "5oYKonYBujg" },
                 { t: "Perché il cielo è blu?", d: "Scienza per piccoli geni.", c: "orange", e: "☁️", id: "bcV_L6W_jXk" },
                 { t: "Laviamoci le mani!", d: "Impariamo l'igiene giocando.", c: "sky", e: "🧼", id: "QzL8F7uP0Hk" },
               ].map((video, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ scale: 1.05 }}
                   onClick={() => setSelectedVideo(video.id)}
                   className={cn(
                     "rounded-[2.5rem] overflow-hidden bg-white shadow-xl border-4 group cursor-pointer h-full flex flex-col",
                     video.c === 'mint' && "border-brand-mint",
                     video.c === 'sky' && "border-brand-sky",
                     video.c === 'pink' && "border-brand-pink",
                     video.c === 'orange' && "border-brand-orange",
                     video.c === 'yellow' && "border-brand-yellow",
                   )}
                 >
                    <div className={cn(
                      "h-48 flex items-center justify-center text-7xl relative",
                      video.c === 'mint' && "bg-brand-mint/20",
                      video.c === 'sky' && "bg-brand-sky/20",
                      video.c === 'pink' && "bg-brand-pink/20",
                      video.c === 'orange' && "bg-brand-orange/20",
                      video.c === 'yellow' && "bg-brand-yellow/20",
                    )}>
                       {video.e}
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                             <PlayCircle className="text-slate-800" size={32} />
                          </div>
                       </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                       <div>
                         <h4 className="text-xl font-black mb-2">{video.t}</h4>
                         <p className="text-slate-500 text-sm font-medium">{video.d}</p>
                       </div>
                       <div className="mt-4 flex items-center gap-2 text-brand-sky font-bold text-sm">
                          <PlayCircle size={16} /> Guarda Ora
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MagicChatbot />
      
      {/* Video Modal Player */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-5xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 z-10 p-4 bg-brand-pink text-white rounded-full shadow-lg hover:rotate-90 transition-transform"
              >
                <X />
              </button>
              <div className="aspect-video bg-black">
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0&modestbranding=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-8 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="font-black text-2xl text-slate-800 text-center md:text-left">Stai guardando un video magico! ✨</div>
                 <MagicButton variant="pink" onClick={() => setSelectedVideo(null)}>Chiudi Player</MagicButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parents Section Preview (Solo in Home) */}
      {activeSection === "home" && (
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
              <MagicButton variant="yellow" icon={Settings} onClick={() => navigateTo("genitori")} className="bg-white hover:bg-slate-50 border-slate-200">
                Gestisci Account
              </MagicButton>
            </div>
            <div className="flex-1 w-full flex justify-center">
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { e: "🛡️", t: "Sicuro" },
                    { e: "⏰", t: "Timer" },
                    { e: "📊", t: "Report" },
                    { e: "🧑‍🏫", t: "Scuola" },
                  ].map(badge => (
                    <div key={badge.t} className="p-4 bg-white rounded-2xl shadow-sm text-center border-2 border-slate-50 hover:border-brand-yellow transition-colors">
                       <div className="text-3xl mb-2">{badge.e}</div>
                       <div className="font-bold text-slate-800">{badge.t}</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-[#334155] border-t-4 border-[#1E293B] py-12 px-10 text-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="text-[14px]">
             <div className="font-black text-2xl mb-2 text-brand-sky">MondoMagico ✨</div>
             © 2026 Piccolo Mondo Magico - Sicurezza Certificata
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[14px] font-bold">
             <span onClick={() => navigateTo("home")} className="cursor-pointer hover:text-brand-sky transition-colors">Home</span>
             <span onClick={() => navigateTo("fiabe")} className="cursor-pointer hover:text-brand-sky transition-colors">Fiabe</span>
             <span onClick={() => navigateTo("giochi")} className="cursor-pointer hover:text-brand-sky transition-colors">Giochi</span>
             <span onClick={() => navigateTo("genitori")} className="cursor-pointer hover:text-brand-sky transition-colors">Area Genitori</span>
          </div>
          <div className="flex gap-4">
             <div className="w-10 h-10 bg-[#475569] rounded-full flex items-center justify-center hover:bg-brand-pink transition-all cursor-pointer">FB</div>
             <div className="w-10 h-10 bg-[#475569] rounded-full flex items-center justify-center hover:bg-brand-sky transition-all cursor-pointer">IG</div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white p-8 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-12">
               <span className="font-black text-2xl uppercase tracking-tighter">Menu Magico 🌈</span>
               <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-brand-sky/20 rounded-full hover:rotate-90 transition-transform"><X /></button>
            </div>
            <div className="flex flex-col gap-6 items-center">
               {NAV_ITEMS.map((item) => (
                 <button 
                  key={item.name}
                  onClick={() => navigateTo(item.name === "Per Genitori" ? "genitori" : item.name)}
                  className="text-4xl font-black text-slate-800 flex items-center gap-4 active:scale-95 transition-transform"
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
               <hr className="w-full border-slate-100 my-8" />
               <button onClick={() => navigateTo("home")} className="text-2xl font-bold text-brand-sky italic underline decoration-4 active:scale-95 transition-transform">Torna alla Home</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActivityCard({ title, desc, icon: Icon, color, onClick }: { title: string, desc: string, icon: any, color: 'pink' | 'sky' | 'orange' | 'mint' | 'yellow', onClick: () => void }) {
  const colors = {
    pink: "bg-brand-pink-bg border-brand-pink hover:border-pink-300 shadow-[0_6px_0_#F472B6]",
    sky: "bg-brand-sky-bg border-brand-sky hover:border-sky-300 shadow-[0_6px_0_#38BDF8]",
    orange: "bg-brand-orange-bg border-brand-orange hover:border-orange-300 shadow-[0_6px_0_#FB923C]",
    mint: "bg-brand-mint-bg border-brand-mint hover:border-green-300 shadow-[0_6px_0_#4ADE80]",
    yellow: "bg-brand-yellow/10 border-brand-yellow hover:border-yellow-300 shadow-[0_6px_0_#EAB308]",
  };

  const iconColors = {
    pink: "bg-[#FDA4AF]",
    sky: "bg-[#BAE6FD]",
    orange: "bg-[#FED7AA]",
    mint: "bg-[#BBF7D0]",
    yellow: "bg-[#FEF08A]",
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={onClick}
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

