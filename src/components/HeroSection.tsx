import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HeroCinematicBackground } from './HeroCinematicBackground';
import { Hero3DText } from './Hero3DText';
import { HeroPhotoCard } from './HeroPhotoCard';
import { RotateCcw, FastForward, ChevronDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [replayKey, setReplayKey] = useState<number>(1);
  const [isSettled, setIsSettled] = useState<boolean>(false);

  // Timer to mark the animation as fully settled after ~6.5 seconds
  useEffect(() => {
    setIsSettled(false);
    const timer = setTimeout(() => {
      setIsSettled(true);
    }, 6500);

    return () => clearTimeout(timer);
  }, [replayKey]);

  const handleReplay = () => {
    setIsSettled(false);
    setReplayKey((prev) => prev + 1);
  };

  const handleSkip = () => {
    setIsSettled(true);
  };

  const handleScrollToRsvp = () => {
    const el = document.getElementById('rsvp');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToStory = () => {
    const el = document.getElementById('story');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent('Balachandran & Karunya Wedding Ceremony (Muhurtham)');
    const details = encodeURIComponent(
      'Join us to celebrate the royal wedding of Balachandran & Karunya by the oceanfront.'
    );
    const location = encodeURIComponent('Ocean Breeze Beach Resort, East Coast Road (ECR), Chennai, Tamil Nadu');
    // June 15, 2025 at 17:30 IST to 21:30 IST (UTC: 20250615T120000Z to 20250615T160000Z)
    const dates = '20250615T120000Z/20250615T160000Z';
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between items-center pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden bg-[#FFFDF7]"
    >
      {/* 1. Cinematic Background Layer: Ivory, Gold Rays, Dust, Stars, Petals, Lines & Floral Corners */}
      <HeroCinematicBackground stage={isSettled ? 7 : 0} replayKey={replayKey} />

      {/* 2. Top Controls: Replay Cinematic & Skip Animation */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between mb-3 sm:mb-4">
        {/* Wedding Tagline */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF67] animate-ping" />
          <span className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#C6A15B] font-semibold">
            Official Wedding Invitation
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Skip animation button if currently playing opening */}
          {!isSettled && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              type="button"
              onClick={handleSkip}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#FAF5E8]/90 hover:bg-[#FAF5E8] border border-[#D4AF67]/70 text-[#5A5A40] hover:text-[#1A1A1A] font-cinzel text-[10px] tracking-wider uppercase transition-all duration-200 shadow-sm cursor-pointer"
              title="Skip straight to invitation"
            >
              <span>Skip Film</span>
              <FastForward className="w-3 h-3 text-[#C6A15B]" />
            </motion.button>
          )}

          {/* Replay Cinematic Opening Button */}
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#FAF5E8] hover:bg-[#F3E5C8] border border-[#D4AF67] text-[#1A1A1A] font-cinzel text-[10px] tracking-widest uppercase transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer"
            title="Replay the 3D cinematic film opening"
          >
            <RotateCcw className="w-3 h-3 text-[#C6A15B]" />
            <span>Replay Opening</span>
          </button>
        </div>
      </div>

      {/* 3. Main Hero Cinematic Stage */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center items-center py-2 sm:py-6">
        
        {/* Composition: Left Names & Details (~45%) and Right Couple Image (~55%) */}
        <div className="relative w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 lg:gap-12 items-center">
          
          {/* LEFT SIDE: 3D Typography & Names (Order 1: Always on Left) */}
          <div className="md:col-span-6 lg:col-span-6 xl:col-span-5 order-1 flex justify-center md:justify-start w-full">
            <Hero3DText
              replayKey={replayKey}
              isSettled={isSettled}
              onRsvpClick={handleScrollToRsvp}
              onAddToCalendar={handleAddToCalendar}
            />
          </div>

          {/* RIGHT SIDE: Couple Photograph / Cutout (Order 2: Always on Right) */}
          <div className="md:col-span-6 lg:col-span-6 xl:col-span-7 order-2 flex justify-center md:justify-end items-end w-full">
            {/* Smooth 3D Entrance on the Right Side */}
            <motion.div
              key={`camera-rig-${replayKey}`}
              initial={{
                opacity: 0,
                scale: 1.06,
                x: 24,
              }}
              animate={{
                opacity: 1,
                scale: 1.0,
                x: 0,
              }}
              transition={{
                duration: 1.6,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full flex justify-center md:justify-end items-end"
            >
              <HeroPhotoCard
                replayKey={replayKey}
                isSettled={isSettled}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* 4. Bottom "Scroll to Celebrate" Indicator */}
      <motion.button
        type="button"
        onClick={handleScrollToStory}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: [0, 5, 0] }}
        transition={{
          opacity: { delay: 5.5, duration: 0.8 },
          y: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
        }}
        className="relative z-20 flex flex-col items-center gap-1 text-[#5A5A40] hover:text-[#1A1A1A] transition-colors focus:outline-none cursor-pointer pt-4 select-none"
        aria-label="Scroll to celebrate"
      >
        <span className="font-cinzel text-[10px] uppercase tracking-[0.3em] font-semibold text-[#C6A15B]">
          Scroll to Celebrate
        </span>
        <div className="w-7 h-7 rounded-full border border-[#D4AF67] flex items-center justify-center bg-[#FAF5E8] shadow-sm">
          <ChevronDown className="w-3.5 h-3.5 text-[#5A5A40]" />
        </div>
      </motion.button>
    </section>
  );
};
