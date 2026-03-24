/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  RefreshCw,
  Gamepad2,
  BookOpen,
  Trophy,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

// Alphabet data in Indonesian
const ALPHABET = [
  { letter: 'A', word: 'Apel', color: 'bg-red-400', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&w=400&q=80' },
  { letter: 'B', word: 'Bola', color: 'bg-blue-400', image: 'https://images.unsplash.com/photo-1580086319619-3ed71cad3f5d?auto=format&fit=crop&w=400&q=80' },
  { letter: 'C', word: 'Ceri', color: 'bg-red-500', image: 'https://images.unsplash.com/photo-1528821128474-27f9e77858c3?auto=format&fit=crop&w=400&q=80' },
  { letter: 'D', word: 'Domba', color: 'bg-green-400', image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=400&q=80' },
  { letter: 'E', word: 'Elang', color: 'bg-amber-700', image: 'https://images.unsplash.com/photo-1535083319918-2989b399d0d1?auto=format&fit=crop&w=400&q=80' },
  { letter: 'F', word: 'Flamingo', color: 'bg-pink-300', image: 'https://images.unsplash.com/photo-1512108002777-aa3a44393344?auto=format&fit=crop&w=400&q=80' },
  { letter: 'G', word: 'Gajah', color: 'bg-slate-500', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=400&q=80' },
  { letter: 'H', word: 'Harimau', color: 'bg-orange-600', image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80' },
  { letter: 'I', word: 'Ikan', color: 'bg-cyan-400', image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=400&q=80' },
  { letter: 'J', word: 'Jerapah', color: 'bg-yellow-500', image: 'https://images.unsplash.com/photo-1547721064-36202634a1be?auto=format&fit=crop&w=400&q=80' },
  { letter: 'K', word: 'Kucing', color: 'bg-orange-400', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80' },
  { letter: 'L', word: 'Lampu', color: 'bg-yellow-400', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80' },
  { letter: 'M', word: 'Monyet', color: 'bg-emerald-400', image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=400&q=80' },
  { letter: 'N', word: 'Nanas', color: 'bg-yellow-600', image: 'https://images.unsplash.com/photo-1550258114-b834e70e9be1?auto=format&fit=crop&w=400&q=80' },
  { letter: 'O', word: 'Orangutan', color: 'bg-orange-800', image: 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?auto=format&fit=crop&w=400&q=80' },
  { letter: 'P', word: 'Pisang', color: 'bg-yellow-300', image: 'https://images.unsplash.com/photo-1571771894821-ad990241274d?auto=format&fit=crop&w=400&q=80' },
  { letter: 'Q', word: 'Quran', color: 'bg-emerald-700', image: 'https://images.unsplash.com/photo-1584281729155-3c9933058122?auto=format&fit=crop&w=400&q=80' },
  { letter: 'R', word: 'Rusa', color: 'bg-amber-600', image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=400&q=80' },
  { letter: 'S', word: 'Sapi', color: 'bg-stone-400', image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=400&q=80' },
  { letter: 'T', word: 'Topi', color: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1533055640609-24b498dfd74c?auto=format&fit=crop&w=400&q=80' },
  { letter: 'U', word: 'Ular', color: 'bg-lime-600', image: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=400&q=80' },
  { letter: 'V', word: 'Vas', color: 'bg-rose-400', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=400&q=80' },
  { letter: 'W', word: 'Wortel', color: 'bg-orange-500', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80' },
  { letter: 'X', word: 'Xylophone', color: 'bg-violet-500', image: 'https://images.unsplash.com/photo-1598367817238-66299b085731?auto=format&fit=crop&w=400&q=80' },
  { letter: 'Y', word: 'Yoyo', color: 'bg-red-600', image: 'https://images.unsplash.com/photo-1531928351158-2f7360d9ee16?auto=format&fit=crop&w=400&q=80' },
  { letter: 'Z', word: 'Zebra', color: 'bg-zinc-800', image: 'https://images.unsplash.com/photo-1501705388883-4ed8a543392c?auto=format&fit=crop&w=400&q=80' },
];

export default function App() {
  const [mode, setMode] = useState<'learning' | 'game'>('learning');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Game state
  const [gameRound, setGameRound] = useState<{ target: typeof ALPHABET[0], options: typeof ALPHABET[0][] } | null>(null);
  const [gameFeedback, setGameFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const createParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color: ['text-yellow-400', 'text-orange-400', 'text-pink-400', 'text-blue-400', 'text-green-400'][Math.floor(Math.random() * 5)]
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  // Initialize AudioContext on first user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const speakText = async (text: string) => {
    if (isSpeaking) return;
    initAudio();
    setIsSpeaking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;
        const audioBuffer = await audioContextRef.current!.decodeAudioData(audioData);
        const source = audioContextRef.current!.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current!.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(false);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const speak = (letter: string, word: string) => {
    speakText(`${letter} adalah untuk ${word}!`);
  };

  const handleLetterClick = (index: number, e: React.MouseEvent) => {
    createParticles(e.clientX, e.clientY);
    setSelectedIndex(index);
    speak(ALPHABET[index].letter, ALPHABET[index].word);
  };

  const nextLetter = () => {
    if (selectedIndex === null) return;
    const next = (selectedIndex + 1) % ALPHABET.length;
    setSelectedIndex(next);
    speak(ALPHABET[next].letter, ALPHABET[next].word);
  };

  const prevLetter = () => {
    if (selectedIndex === null) return;
    const prev = (selectedIndex - 1 + ALPHABET.length) % ALPHABET.length;
    setSelectedIndex(prev);
    speak(ALPHABET[prev].letter, ALPHABET[prev].word);
  };

  // Game logic
  const startNewRound = () => {
    const target = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    const others = ALPHABET.filter(a => a.letter !== target.letter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    const options = [target, ...others].sort(() => 0.5 - Math.random());
    setGameRound({ target, options });
    setGameFeedback(null);
  };

  useEffect(() => {
    if (mode === 'game' && !gameRound) {
      startNewRound();
    }
  }, [mode]);

  const handleGameChoice = (choice: typeof ALPHABET[0], e: React.MouseEvent) => {
    if (gameFeedback === 'correct') return;

    if (choice.letter === gameRound?.target.letter) {
      setGameFeedback('correct');
      setScore(s => s + 1);
      createParticles(e.clientX, e.clientY);
      speakText(`Hebat! ${choice.letter} adalah untuk ${choice.word}!`);
      setTimeout(() => {
        startNewRound();
      }, 2500);
    } else {
      setGameFeedback('wrong');
      speakText(`Ups, coba lagi ya!`);
      setTimeout(() => setGameFeedback(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] font-sans text-[#4A4A4A] p-4 md:p-8 overflow-x-hidden">
      {/* Header */}
      <header className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#2D2D2D]">
            Petualangan <span className="text-orange-500 italic">Alfabet</span>
          </h1>
        </motion.div>
        
        <div className="flex items-center gap-4">
          {/* Mode Switcher */}
          <div className="bg-white p-1 rounded-full shadow-md flex">
            <button 
              onClick={() => setMode('learning')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${mode === 'learning' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-orange-500'}`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-bold">Belajar</span>
            </button>
            <button 
              onClick={() => setMode('game')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${mode === 'game' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-purple-500'}`}
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="font-bold">Main</span>
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedIndex(null);
              if (mode === 'game') startNewRound();
            }}
            className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-6 h-6 text-orange-500" />
          </motion.button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {mode === 'learning' ? (
            selectedIndex === null ? (
              /* Grid View */
              <motion.div 
                key="grid"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 md:gap-6"
              >
                {ALPHABET.map((item, index) => (
                  <motion.button
                    key={item.letter}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleLetterClick(index, e)}
                    className={`${item.color} aspect-square rounded-3xl flex flex-col items-center justify-center shadow-xl border-4 border-white/30 relative group overflow-hidden`}
                  >
                    <span className="text-5xl md:text-6xl font-black text-white drop-shadow-md">
                      {item.letter}
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              /* Detail View */
              <motion.div 
                key="detail"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden relative"
              >
                <div className="flex flex-col md:flex-row h-full md:h-[500px]">
                  {/* Image Section */}
                  <div className="w-full md:w-1/2 relative h-64 md:h-full">
                    <img 
                      src={ALPHABET[selectedIndex].image} 
                      alt={ALPHABET[selectedIndex].word}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute inset-0 ${ALPHABET[selectedIndex].color} opacity-20`} />
                    
                    {/* Navigation Buttons */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); prevLetter(); }}
                        className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-8 h-8 text-[#2D2D2D]" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); nextLetter(); }}
                        className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-8 h-8 text-[#2D2D2D]" />
                      </button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                    <motion.div
                      key={ALPHABET[selectedIndex].letter}
                      initial={{ scale: 0.5, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={`w-32 h-32 ${ALPHABET[selectedIndex].color} rounded-3xl flex items-center justify-center shadow-2xl mb-6 border-8 border-white`}
                    >
                      <span className="text-7xl font-black text-white">
                        {ALPHABET[selectedIndex].letter}
                      </span>
                    </motion.div>
                    
                    <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-2">
                      adalah untuk
                    </h2>
                    
                    <h3 className="text-5xl md:text-6xl font-black text-[#2D2D2D] mb-8">
                      {ALPHABET[selectedIndex].word}
                    </h3>

                    <button 
                      onClick={() => speak(ALPHABET[selectedIndex].letter, ALPHABET[selectedIndex].word)}
                      disabled={isSpeaking}
                      className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-xl shadow-lg transition-all ${
                        isSpeaking 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                      }`}
                    >
                      <Volume2 className={`w-8 h-8 ${isSpeaking ? 'animate-pulse' : ''}`} />
                      {isSpeaking ? 'Mendengarkan...' : 'Dengarkan!'}
                    </button>
                  </div>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setSelectedIndex(null)}
                  className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all text-2xl font-bold"
                >
                  ✕
                </button>
              </motion.div>
            )
          ) : (
            /* Game Mode */
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
                {/* Score Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-800">Skor: {score}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-[#2D2D2D] mb-8">
                  Manakah huruf yang tepat?
                </h2>

                {gameRound && (
                  <div className="flex flex-col items-center">
                    {/* Target Image */}
                    <motion.div 
                      key={gameRound.target.image}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-64 h-64 rounded-[40px] overflow-hidden shadow-xl mb-12 border-8 border-white"
                    >
                      <img 
                        src={gameRound.target.image} 
                        alt="Tebak" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>

                    {/* Options */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-2xl">
                      {gameRound.options.map((option) => (
                        <motion.button
                          key={option.letter}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleGameChoice(option, e)}
                          className={`aspect-square rounded-3xl flex items-center justify-center text-5xl md:text-6xl font-black text-white shadow-xl transition-all relative ${
                            gameFeedback === 'correct' && option.letter === gameRound.target.letter
                              ? 'bg-green-500 scale-110'
                              : gameFeedback === 'wrong' && option.letter !== gameRound.target.letter
                              ? 'bg-red-400'
                              : option.color
                          }`}
                        >
                          {option.letter}
                          
                          {/* Feedback Icons */}
                          {gameFeedback === 'correct' && option.letter === gameRound.target.letter && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-4 -right-4 bg-white rounded-full p-1 shadow-lg"
                            >
                              <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Feedback Message */}
                    <AnimatePresence>
                      {gameFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`mt-8 text-2xl font-black ${gameFeedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {gameFeedback === 'correct' ? 'Hebat! Kamu benar!' : 'Ups! Coba lagi ya!'}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-12 text-center text-gray-400 font-medium">
        <p>Dibuat dengan ❤️ untuk penjelajah kecil</p>
      </footer>

      {/* Background Shapes */}
      <div className="fixed -z-10 top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-50 rounded-full blur-3xl" />
      </div>

      {/* Sparkle Particles */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: p.x, y: p.y }}
            animate={{ 
              opacity: 0, 
              scale: [0, 1.5, 0],
              x: p.x + (Math.random() - 0.5) * 200,
              y: p.y + (Math.random() - 0.5) * 200,
              rotate: Math.random() * 360
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed pointer-events-none z-50 ${p.color}`}
          >
            <Sparkles className="w-6 h-6 fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
