import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  // Soothing pentatonic raga notes (Raga Mohanam / Auspicious Wedding Pentatonic: C4, D4, E4, G4, A4, C5, D5, E5)
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

  const playChime = (ctx: AudioContext, freq: number, time: number) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Gentle pluck envelope (like a warm acoustic santoor / harp)
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.04, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 2.9);
    } catch {
      // Audio context cleanup fallback
    }
  };

  const playDrone = (ctx: AudioContext) => {
    // Warm tanpura background drone (C3 & G3)
    const droneFreqs = [130.81, 196.0];
    droneFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
    });
  };

  const startMelody = () => {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    playDrone(ctx);

    let noteIndex = 0;
    const scheduleNext = () => {
      if (!ctx || ctx.state === 'closed') return;
      const freq = notes[noteIndex % notes.length];
      playChime(ctx, freq, ctx.currentTime);
      noteIndex = (noteIndex + Math.floor(Math.random() * 3 + 1)) % notes.length;
      
      const nextDelay = Math.random() * 1200 + 800;
      timerRef.current = window.setTimeout(scheduleNext, nextDelay);
    };

    scheduleNext();
  };

  const stopMelody = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMelody();
      setIsPlaying(false);
    } else {
      startMelody();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopMelody();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      {/* Tooltip hint */}
      {showTooltip && (
        <div className="hidden sm:block px-3 py-1.5 rounded-full bg-[#FAF5E8]/95 border border-[#D4AF67]/50 text-xs font-cinzel text-[#8C6A28] shadow-lg animate-fade-in whitespace-nowrap">
          {isPlaying ? 'Auspicious Wedding Shehnai & Harp Raga' : 'Play Auspicious Wedding Raga'}
        </div>
      )}

      {/* Floating Audio Controller Pill */}
      <button
        type="button"
        onClick={toggleMusic}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-md border transition-all duration-500 shadow-lg ${
          isPlaying
            ? 'bg-[#FAF5E8]/90 border-[#D4AF67] text-[#8C6A28] shadow-[0_4px_20px_rgba(212,175,103,0.35)]'
            : 'bg-white/80 border-[#D4AF67]/40 text-[#7A6A55] hover:border-[#D4AF67] hover:text-[#8C6A28]'
        }`}
        aria-label={isPlaying ? 'Pause wedding music' : 'Play royal wedding music'}
      >
        {isPlaying ? (
          <div className="flex items-center gap-1 h-3.5">
            <span className="w-1 bg-[#C6A15B] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3.5" />
            <span className="w-1 bg-[#D4AF67] rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-2.5" />
            <span className="w-1 bg-[#B5892D] rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-4" />
          </div>
        ) : (
          <Music className="w-4 h-4 text-[#C6A15B] group-hover:scale-110 transition-transform" />
        )}

        <span className="text-xs font-cinzel font-semibold tracking-wider">
          {isPlaying ? 'Music Playing' : 'Play Music'}
        </span>

        {isPlaying && <Sparkles className="w-3.5 h-3.5 text-[#D4AF67] animate-spin-slow" />}
      </button>
    </div>
  );
};
