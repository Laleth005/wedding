import React from 'react';
import { motion } from 'motion/react';

/**
 * Royal floral corners matching the style of the invitation card:
 * Ivory cream roses, champagne blossoms, soft sage/eucalyptus green leaves,
 * and fine gold ornamental linework.
 */
export const FloralCorner: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position, className = '' }) => {
  const rotationClass = {
    'top-left': '',
    'top-right': 'scale-x-[-1]',
    'bottom-left': 'scale-y-[-1]',
    'bottom-right': 'scale-x-[-1] scale-y-[-1]',
  }[position];

  return (
    <motion.div
      animate={{
        rotate: [-0.8, 0.8, -0.8],
      }}
      transition={{
        repeat: Infinity,
        duration: 7,
        ease: 'easeInOut',
      }}
      className={`pointer-events-none absolute z-10 w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 ${rotationClass} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm opacity-90"
      >
        <defs>
          <linearGradient id={`goldGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C6A15B" />
            <stop offset="50%" stopColor="#F5DFB3" />
            <stop offset="100%" stopColor="#A68037" />
          </linearGradient>
          <linearGradient id={`roseGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="60%" stopColor="#F9F1DF" />
            <stop offset="100%" stopColor="#E6D3B1" />
          </linearGradient>
          <linearGradient id={`leafGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9FB396" />
            <stop offset="100%" stopColor="#6C8064" />
          </linearGradient>
        </defs>

        {/* Outer corner gold accent lines */}
        <path
          d="M 10 90 L 10 10 L 90 10"
          stroke={`url(#goldGrad-${position})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 16 70 L 16 16 L 70 16"
          stroke={`url(#goldGrad-${position})`}
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />
        <circle cx="10" cy="10" r="2.5" fill={`url(#goldGrad-${position})`} />
        <circle cx="90" cy="10" r="1.5" fill={`url(#goldGrad-${position})`} />
        <circle cx="10" cy="90" r="1.5" fill={`url(#goldGrad-${position})`} />

        {/* Botanical eucalyptus leaves */}
        <path
          d="M 18 18 C 35 12 55 24 62 42 C 50 48 30 38 18 18 Z"
          fill={`url(#leafGrad-${position})`}
          opacity="0.85"
        />
        <path
          d="M 22 22 Q 40 30 58 40"
          stroke="#55664F"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        <path
          d="M 18 18 C 12 35 24 55 42 62 C 48 50 38 30 18 18 Z"
          fill={`url(#leafGrad-${position})`}
          opacity="0.85"
        />
        <path
          d="M 22 22 Q 30 40 40 58"
          stroke="#55664F"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Additional gentle foliage */}
        <path
          d="M 45 18 C 65 14 80 28 82 45 C 68 46 54 34 45 18 Z"
          fill="#AFC2A7"
          opacity="0.7"
        />
        <path
          d="M 18 45 C 14 65 28 80 45 82 C 46 68 34 54 18 45 Z"
          fill="#AFC2A7"
          opacity="0.7"
        />

        {/* Rose blossom petals */}
        <ellipse
          cx="38"
          cy="38"
          rx="22"
          ry="22"
          fill={`url(#roseGrad-${position})`}
          stroke={`url(#goldGrad-${position})`}
          strokeWidth="0.75"
        />
        {/* Rose inner swirling petals */}
        <path
          d="M 26 38 C 26 28 48 24 48 36 C 48 48 28 46 36 34 C 40 28 44 38 38 40"
          stroke="#D4AF67"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 30 32 C 34 26 44 26 46 32 C 48 40 38 44 32 38"
          fill="#FAF3E3"
          stroke="#C6A15B"
          strokeWidth="0.7"
        />

        {/* Secondary bud */}
        <circle cx="68" cy="26" r="10" fill={`url(#roseGrad-${position})`} stroke="#D4AF67" strokeWidth="0.6" />
        <path d="M 64 26 Q 68 22 72 26" stroke="#C6A15B" strokeWidth="0.8" fill="none" />
        <circle cx="26" cy="68" r="10" fill={`url(#roseGrad-${position})`} stroke="#D4AF67" strokeWidth="0.6" />
        <path d="M 26 64 Q 22 68 26 72" stroke="#C6A15B" strokeWidth="0.8" fill="none" />

        {/* Delicate golden scroll flourish */}
        <path
          d="M 12 12 Q 32 4 48 10 T 78 8"
          stroke={`url(#goldGrad-${position})`}
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 12 12 Q 4 32 10 48 T 8 78"
          stroke={`url(#goldGrad-${position})`}
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </motion.div>
  );
};

/**
 * Gold divider with heart & leaf sprigs directly from the uploaded invitation card:
 * ─── 🌿 ♥ 🌿 ───
 */
export const GoldDivider: React.FC<{
  className?: string;
  hasHeart?: boolean;
}> = ({ className = '', hasHeart = true }) => {
  return (
    <div className={`flex items-center justify-center gap-3 my-4 select-none ${className}`} aria-hidden="true">
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#D4AF67] to-[#C6A15B]" />
      
      {/* Left Leaf sprig */}
      <svg className="w-5 h-5 text-[#8A9E82] opacity-90 transform -rotate-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C7 2 3 6 3 11C3 15.5 6.5 19.5 11 21.5C11 16 8 13 8 13C8 13 13 13 15 8C17 3.5 14 2 12 2Z" />
      </svg>

      {hasHeart && (
        <div className="flex items-center justify-center">
          <span className="text-xs text-[#C6A15B] transform hover:scale-125 transition-transform duration-300">
            ♦
          </span>
          <motion.svg
            animate={{
              scale: [1, 1.18, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
            className="w-3.5 h-3.5 mx-1 text-[#C6A15B] fill-current drop-shadow-[0_1px_4px_rgba(212,175,103,0.4)]"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </motion.svg>
          <span className="text-xs text-[#C6A15B] transform hover:scale-125 transition-transform duration-300">
            ♦
          </span>
        </div>
      )}

      {/* Right Leaf sprig */}
      <svg className="w-5 h-5 text-[#8A9E82] opacity-90 transform scale-x-[-1] rotate-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C7 2 3 6 3 11C3 15.5 6.5 19.5 11 21.5C11 16 8 13 8 13C8 13 13 13 15 8C17 3.5 14 2 12 2Z" />
      </svg>

      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-[#D4AF67] to-[#C6A15B]" />
    </div>
  );
};

/**
 * Royal Monogram "B & K" in ornate gold crest
 */
export const RoyalMonogram: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-24 h-24 text-xl',
    xl: 'w-32 h-32 text-3xl',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      {/* Outer spinning or shimmering gold ring */}
      <div className="absolute inset-0 rounded-full border border-[#D4AF67]/60 p-1 shadow-sm">
        <div className="w-full h-full rounded-full border border-dashed border-[#C6A15B]/50" />
      </div>

      {/* Inner background glow */}
      <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-[#FFFDF7] via-[#FAF5E8] to-[#F3E5C8] flex items-center justify-center shadow-inner border border-[#D4AF67]/40">
        <span className="font-cinzel font-bold text-[#A68037] tracking-widest drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
          B <span className="text-[#C6A15B] font-script text-[1.2em] -mx-0.5">&</span> K
        </span>
      </div>
    </div>
  );
};

/**
 * Authentic 3D Champagne Gold Wax Seal
 */
export const WaxSeal: React.FC<{
  onClick?: () => void;
  className?: string;
  isInteractive?: boolean;
}> = ({ onClick, className = '', isInteractive = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isInteractive}
      className={`relative group select-none transition-all duration-300 ${
        isInteractive ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
      } ${className}`}
      aria-label="Golden wax seal of Balachandran and Karunya"
    >
      {/* Wax drip organic edges shadow */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#E2C37B] via-[#C99C44] to-[#8E671D] p-[3px] shadow-[0_10px_25px_-5px_rgba(142,103,29,0.5),0_0_15px_rgba(212,175,103,0.3)]">
        {/* Organic scalloped wax edge container */}
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#D4AF67] via-[#C2953B] to-[#997022] flex items-center justify-center relative overflow-hidden border border-[#FFF5DC]/30">
          
          {/* Subtle 3D wax shine */}
          <div className="absolute top-1 left-2 right-2 h-6 bg-gradient-to-b from-white/35 to-transparent rounded-full blur-[1px]" />
          
          {/* Embossed inner ring */}
          <div className="w-[78%] h-[78%] rounded-full border-2 border-[#7E5714]/40 shadow-inner flex flex-col items-center justify-center bg-gradient-to-tr from-[#B5892D] via-[#CFA74E] to-[#E9CB7E]">
            <span className="text-[9px] uppercase tracking-[0.25em] font-cinzel text-[#573C0C] font-semibold opacity-80 -mt-1">
              EST. 2025
            </span>
            <div className="font-cinzel font-bold text-lg sm:text-xl text-[#4A3207] tracking-wider drop-shadow-[0_1px_0_rgba(255,255,255,0.4)] flex items-center">
              <span>B</span>
              <span className="font-script text-xl mx-0.5 text-[#3A2603]">&</span>
              <span>K</span>
            </div>
            <span className="text-[7px] tracking-[0.3em] font-cinzel text-[#573C0C] uppercase opacity-75">
              FOREVER
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
