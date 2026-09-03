import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Upload,
  Heart,
  Disc,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_AUDIO_PATH = '/hosanna.mp3';
const BACKUP_STREAM_URL = 'https://archive.org/download/tamil-melody-hits/Hosanna.mp3';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio();
    audio.src = customAudioUrl || DEFAULT_AUDIO_PATH;
    audio.loop = isLooping;
    audio.volume = volume;
    audio.preload = 'metadata';

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 331); // Hosanna is ~5:31
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      if (!audio.loop) {
        setIsPlaying(false);
      }
    };

    const onError = () => {
      // If local file fails, try stream backup
      if (audio.src !== BACKUP_STREAM_URL && !customAudioUrl) {
        console.warn('Falling back to stream URL for Hosanna...');
        audio.src = BACKUP_STREAM_URL;
        audio.load();
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [customAudioUrl]);

  // Handle loop changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setHasStartedOnce(true);
      } catch (err) {
        console.warn('Audio play request failed or was blocked by browser:', err);
        // Retry with backup if needed
        if (!customAudioUrl && audioRef.current.src !== BACKUP_STREAM_URL) {
          audioRef.current.src = BACKUP_STREAM_URL;
          try {
            await audioRef.current.play();
            setIsPlaying(true);
            setHasStartedOnce(true);
          } catch (e) {
            console.error('Playback error:', e);
          }
        }
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = fraction * (duration || 331);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCustomAudioUrl(url);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStartedOnce(true);
      });
    }
  };

  const resetToDefaultHosanna = () => {
    setCustomAudioUrl(null);
    if (audioRef.current) {
      audioRef.current.src = DEFAULT_AUDIO_PATH;
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Audio Card Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-3 w-76 sm:w-84 rounded-2xl bg-[#FFFDF7]/98 backdrop-blur-xl border border-[#D4AF67]/70 shadow-[0_16px_40px_rgba(142,103,29,0.22)] p-4 text-[#1A1A1A] overflow-hidden"
          >
            {/* Top Bar with Vinyl Disc & Title */}
            <div className="flex items-center gap-3">
              {/* Spinning Vinyl Disc with couple photo or music art */}
              <div
                className={`relative w-12 h-12 rounded-full border-2 border-[#D4AF67] overflow-hidden shrink-0 shadow-md ${
                  isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
                }`}
              >
                <img
                  src="/couple.jpg"
                  alt="Hosanna album art"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/couple_candidate_1.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-[#FAF5E8] border border-[#D4AF67]" />
              </div>

              {/* Song Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#C6A15B] animate-ping" />
                  <span className="font-cinzel text-[10px] tracking-widest uppercase text-[#8C6A28] font-bold">
                    Tamil Wedding Anthem
                  </span>
                </div>
                <h4 className="font-cinzel text-sm font-bold text-[#1A1A1A] truncate">
                  Hosanna
                </h4>
                <p className="font-sans text-[11px] text-[#5A5A40] truncate">
                  Vinnaithaandi Varuvaayaa &bull; A.R. Rahman
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-full text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#FAF5E8] transition-colors cursor-pointer"
                title="Minimize player"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Progress Bar */}
            <div className="mt-3.5">
              <div
                ref={progressRef}
                onClick={handleSeek}
                className="group relative h-2 bg-[#EFE6CE] rounded-full cursor-pointer overflow-hidden border border-[#D4AF67]/30"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF67] via-[#F5DFB3] to-[#C6A15B] rounded-full relative transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#7A6A55] mt-1 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#D4AF67]/30">
              {/* Loop toggle */}
              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                className={`p-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                  isLooping ? 'text-[#8C6A28] bg-[#FAF5E8]' : 'text-[#7A6A55] hover:text-[#1A1A1A]'
                }`}
                title={isLooping ? 'Auto-looping enabled' : 'Auto-loop disabled'}
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isLooping ? 'stroke-[2.5]' : ''}`} />
              </button>

              {/* Main Play / Pause Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D4AF67] via-[#C6A15B] to-[#B5914A] hover:from-[#C6A15B] hover:to-[#A37E36] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                  title={isPlaying ? 'Pause Hosanna' : 'Play Hosanna'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Volume & Mute */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full text-[#7A6A55] hover:text-[#1A1A1A] hover:bg-[#FAF5E8] transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-700" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#8C6A28]" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-14 h-1 accent-[#C6A15B] cursor-pointer"
                  title="Volume"
                />
              </div>
            </div>

            {/* Custom Track Options */}
            <div className="mt-2.5 pt-2 border-t border-[#D4AF67]/20 flex items-center justify-between text-[10px]">
              <span className="font-cormorant italic text-[#5A5A40]">
                "En Idhayam... Hosanna..."
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#8C6A28] hover:text-[#1A1A1A] underline font-cinzel cursor-pointer"
                >
                  {customAudioUrl ? 'Change Song' : 'Upload MP3'}
                </button>
                {customAudioUrl && (
                  <button
                    type="button"
                    onClick={resetToDefaultHosanna}
                    className="text-[#C6A15B] hover:text-[#8C6A28] font-cinzel cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input for custom audio */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleCustomAudioUpload}
        className="hidden"
      />

      {/* Floating Pill Controller */}
      <div className="flex items-center gap-2">
        {/* Tooltip hint when collapsed */}
        {showTooltip && !isExpanded && (
          <div className="hidden sm:block px-3 py-1.5 rounded-full bg-[#FAF5E8]/95 border border-[#D4AF67]/60 text-xs font-cinzel text-[#8C6A28] shadow-lg whitespace-nowrap animate-fade-in">
            {isPlaying ? '🎵 Playing: Hosanna (A.R. Rahman)' : '▶ Click to Play Hosanna (Tamil)'}
          </div>
        )}

        {/* Main Floating Capsule */}
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`group relative flex items-center gap-2 pl-3.5 pr-2.5 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-[0_8px_24px_rgba(142,103,29,0.2)] ${
            isPlaying
              ? 'bg-[#FAF5E8]/95 border-[#D4AF67] text-[#8C6A28] ring-2 ring-[#C6A15B]/20'
              : 'bg-white/90 border-[#D4AF67]/60 text-[#1A1A1A] hover:border-[#C6A15B]'
          }`}
        >
          {/* Play/Pause icon button */}
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            title={isPlaying ? 'Pause Hosanna' : 'Play Hosanna (Tamil Song)'}
          >
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5 w-3.5 pb-0.5">
                <span className="w-1 bg-[#C6A15B] rounded-full animate-[bounce_0.8s_infinite] h-3.5" />
                <span className="w-1 bg-[#D4AF67] rounded-full animate-[bounce_0.6s_infinite] h-2" />
                <span className="w-1 bg-[#B5892D] rounded-full animate-[bounce_0.9s_infinite] h-3" />
              </div>
            ) : (
              <Disc className="w-4 h-4 text-[#C6A15B] group-hover:scale-110 transition-transform" />
            )}

            <div className="flex flex-col text-left">
              <span className="text-[11px] sm:text-xs font-cinzel font-bold tracking-wider leading-tight flex items-center gap-1">
                <span>{isPlaying ? 'Hosanna Playing' : 'Play Hosanna'}</span>
                {isPlaying && <Sparkles className="w-3 h-3 text-[#D4AF67] animate-spin-slow" />}
              </span>
              <span className="text-[9px] font-sans text-[#7A6A55] leading-none">
                A.R. Rahman
              </span>
            </div>
          </button>

          {/* Vertical divider */}
          <div className="w-[1px] h-4 bg-[#D4AF67]/50 mx-1" />

          {/* Quick Mute / Expand toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-full text-[#7A6A55] hover:text-[#1A1A1A] hover:bg-[#FAF5E8] transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse controls' : 'Show track details & equalizer'}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#C6A15B]" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-[#C6A15B]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
