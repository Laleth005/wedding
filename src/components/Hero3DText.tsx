import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Sparkles, Heart } from 'lucide-react';
import { COUPLE_DATA } from '../data/weddingData';

interface Hero3DTextProps {
  replayKey: number;
  isSettled: boolean;
  onRsvpClick: () => void;
  onAddToCalendar: () => void;
}

export const Hero3DText: React.FC<Hero3DTextProps> = ({
  replayKey,
  isSettled,
  onRsvpClick,
  onAddToCalendar,
}) => {
  return (
    <div className="w-full text-center md:text-left perspective-1200 flex flex-col justify-center items-center md:items-start">
      
      {/* 1. Subtitle Invitation Line */}
      <motion.div
        key={`sub-${replayKey}`}
        initial={{ opacity: 0, x: -40, filter: 'blur(6px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5E8] border border-[#D4AF67] mb-4 sm:mb-6 shadow-sm w-fit mx-auto md:mx-0"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
        <span className="font-cinzel text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold">
          Together with their families
        </span>
      </motion.div>

      {/* 2. 3D Floating Typography Container */}
      <div className="relative preserve-3d my-1 sm:my-2">
        {/* Ambient floating twinkling sparkles */}
        <motion.div
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.75, 1.25, 0.75],
            rotate: [0, 90, 180],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: 'easeInOut',
          }}
          className="absolute -top-3 -right-3 text-[#D4AF67] pointer-events-none hidden sm:block"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>

        <motion.div
          animate={{
            opacity: [0.1, 0.9, 0.1],
            scale: [0.7, 1.2, 0.7],
            rotate: [180, 90, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            delay: 1.5,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-2 -left-3 text-[#C6A15B] pointer-events-none hidden sm:block"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </motion.div>

        {/* --- BALACHANDRAN --- */}
        <div className="overflow-visible">
          <motion.div
            key={`groom-3d-${replayKey}`}
            initial={{
              opacity: 0,
              x: -70,
              y: 15,
              z: -120,
              rotateX: 10,
              rotateY: -8,
              rotateZ: -2,
              filter: 'blur(6px)',
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              z: 0,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              filter: 'blur(0px)',
            }}
            transition={{
              duration: 1.2,
              delay: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative font-cinzel font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl tracking-wider leading-none select-none"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Background 3D depth shadow extrusion */}
            <span
              aria-hidden="true"
              className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 text-[#8C6A28]/25 select-none -z-10 blur-[1px]"
            >
              BALACHANDRAN
            </span>

            {/* Main Champagne Metallic Gold Letters with traveling light sweep */}
            <span className="relative z-10 champagne-gold-3d drop-shadow-[0_4px_16px_rgba(212,175,103,0.35)]">
              BALACHANDRAN
            </span>

            {/* Light sweep specular traveling sheen with periodic repeat */}
            <motion.span
              initial={{ x: '-100%', opacity: 0 }}
              animate={{
                x: ['-100%', '200%', '200%'],
                opacity: [0, 0.75, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 5,
                delay: 2.2,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-20deg] pointer-events-none mix-blend-overlay"
            />
          </motion.div>
        </div>

        {/* --- & (Smaller & More Elegant with subtle floating breathing) --- */}
        <div className="my-1 sm:my-2 flex items-center justify-center md:justify-start gap-4">
          <motion.div
            key={`ampersand-${replayKey}`}
            initial={{
              opacity: 0,
              scale: 0.4,
              rotateZ: -25,
              filter: 'blur(6px)',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateZ: 0,
              filter: 'blur(0px)',
            }}
            transition={{
              duration: 1.0,
              delay: 1.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center gap-3"
          >
            <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-[#D4AF67] to-transparent" />
            <motion.span
              animate={
                isSettled
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 2, 0, -2, 0],
                    }
                  : {}
              }
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: 'easeInOut',
              }}
              className="font-script text-3xl sm:text-4xl md:text-5xl text-[#C6A15B] drop-shadow-sm inline-block"
            >
              &
            </motion.span>
            <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-[#D4AF67] to-transparent" />
          </motion.div>
        </div>

        {/* --- KARUNYA --- */}
        <div className="overflow-visible">
          <motion.div
            key={`bride-3d-${replayKey}`}
            initial={{
              opacity: 0,
              x: -70,
              y: 15,
              z: -120,
              rotateX: -8,
              rotateY: 6,
              rotateZ: 2,
              filter: 'blur(6px)',
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              z: 0,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              filter: 'blur(0px)',
            }}
            transition={{
              duration: 1.2,
              delay: 1.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative font-cinzel font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl tracking-wider leading-none select-none"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Background 3D depth shadow extrusion */}
            <span
              aria-hidden="true"
              className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 text-[#8C6A28]/25 select-none -z-10 blur-[1px]"
            >
              KARUNYA
            </span>

            {/* Main Champagne Metallic Gold Letters with traveling light sweep */}
            <span className="relative z-10 champagne-gold-3d drop-shadow-[0_4px_16px_rgba(212,175,103,0.35)]">
              KARUNYA
            </span>

            {/* Light sweep specular traveling sheen with periodic repeat */}
            <motion.span
              initial={{ x: '-100%', opacity: 0 }}
              animate={{
                x: ['-100%', '200%', '200%'],
                opacity: [0, 0.75, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 5,
                delay: 2.8,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-20deg] pointer-events-none mix-blend-overlay"
            />
          </motion.div>
        </div>
      </div>

      {/* 3. Invitation Line */}
      <motion.p
        key={`invite-line-${replayKey}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-cormorant italic text-lg sm:text-xl md:text-2xl text-[#5A5A40] mt-4 mb-5 max-w-md tracking-wide mx-auto md:mx-0 text-center md:text-left"
      >
        Invite you to celebrate their holy union by the oceanfront
      </motion.p>

      {/* 4. Wedding Date & Venue Badges */}
      <motion.div
        key={`badges-${replayKey}`}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row flex-wrap items-center md:items-start justify-center md:justify-start gap-3 sm:gap-4 my-2 text-[#5A5A40] w-full"
      >
        {/* Date badge */}
        <div className="bg-[#FAF5E8]/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm border border-[#D4AF67]">
          <div className="p-1.5 rounded-full bg-[#E6D7B8]/60 text-[#C6A15B]">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="block font-cinzel text-[9px] uppercase tracking-[0.25em] text-[#C6A15B] font-bold">
              Wedding Date
            </span>
            <span className="block font-cinzel font-bold text-xs sm:text-sm text-[#1A1A1A]">
              {COUPLE_DATA.weddingDisplayDate}
            </span>
          </div>
        </div>

        {/* Venue badge */}
        <div className="bg-[#FAF5E8]/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm border border-[#D4AF67]">
          <div className="p-1.5 rounded-full bg-[#E6D7B8]/60 text-[#C6A15B]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="block font-cinzel text-[9px] uppercase tracking-[0.25em] text-[#C6A15B] font-bold">
              Oceanfront Sanctuary
            </span>
            <span className="block font-cinzel font-bold text-xs sm:text-sm text-[#1A1A1A]">
              {COUPLE_DATA.venueName}, Chennai
            </span>
          </div>
        </div>
      </motion.div>

      {/* 5. Action Buttons (RSVP & Add to Calendar) */}
      <motion.div
        key={`ctas-${replayKey}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center md:justify-start gap-3.5 mt-5 sm:mt-6 w-full"
      >
        <button
          type="button"
          onClick={onRsvpClick}
          className="gold-gradient-btn px-6 sm:px-8 py-3 rounded-full text-xs uppercase tracking-[0.3em] font-cinzel font-bold flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <span>Confirm RSVP</span>
          <Heart className="w-3.5 h-3.5 fill-current text-white/90" />
        </button>

        <button
          type="button"
          onClick={onAddToCalendar}
          className="px-5 sm:px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-cinzel font-semibold text-[#1A1A1A] bg-[#FAF5E8] hover:bg-[#F3E5C8] border border-[#D4AF67] shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          Add to Calendar
        </button>
      </motion.div>
    </div>
  );
};
