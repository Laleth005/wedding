import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { COUPLE_DATA } from '../data/weddingData';
import { GoldDivider } from './FloralDecorations';
import { Heart, Quote, Sparkles } from 'lucide-react';
import { getStoredImage } from '../utils/imageStorage';

const GROOM_STORAGE_KEY = '11.png';
const BRIDE_STORAGE_KEY = 'karunya_custom_bride_photo';

const GROOM_CANDIDATES = [
  '/11.png',
  '/ChatGPT Image Sep 3, 2026, 01_28_38 PM.png',
  '/ChatGPT%20Image%20Sep%203%2C%202026%2C%2001_28_38%20PM.png',
  '/groom_candidate_1.jpg',
  '/groom_candidate_2.jpg',
  COUPLE_DATA.groom.image,
];

const BRIDE_CANDIDATES = [
  '/three.png',
  '/ChatGPT Image Sep 3, 2026, 02_02_57 PM.png',
  '/ChatGPT%20Image%20Sep%203%2C%202026%2C%2002_02_57%20PM.png',
  '/bride_candidate_1.jpg',
  COUPLE_DATA.bride.image,
];

export const OurStorySection: React.FC = () => {
  const [groomImg, setGroomImg] = useState<string>(COUPLE_DATA.groom.image);
  const [brideImg, setBrideImg] = useState<string>(COUPLE_DATA.bride.image);

  // Initialize and check stored or candidate files
  useEffect(() => {
    async function loadGroomPhoto() {
      const stored = await getStoredImage(GROOM_STORAGE_KEY);
      if (stored) {
        setGroomImg(stored);
        return;
      }
      for (const candidate of GROOM_CANDIDATES) {
        try {
          const img = new Image();
          const ok = await new Promise<boolean>((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = candidate;
          });
          if (ok) {
            setGroomImg(candidate);
            break;
          }
        } catch {
          // continue
        }
      }
    }

    async function loadBridePhoto() {
      const stored = await getStoredImage(BRIDE_STORAGE_KEY);
      if (stored) {
        setBrideImg(stored);
        return;
      }
      for (const candidate of BRIDE_CANDIDATES) {
        try {
          const img = new Image();
          const ok = await new Promise<boolean>((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = candidate;
          });
          if (ok) {
            setBrideImg(candidate);
            break;
          }
        } catch {
          // continue
        }
      }
    }

    loadGroomPhoto();
    loadBridePhoto();
  }, []);

  return (
    <section id="story" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FFFDF7] scroll-mt-24 sm:scroll-mt-28">
      {/* Background Decorative Gold Watermark */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none opacity-5 font-script text-[180px] sm:text-[280px] text-[#C6A15B] whitespace-nowrap z-0">
        Balachandran & Karunya
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="font-cinzel text-xs uppercase tracking-[0.4em] text-[#C6A15B] font-bold">
            A Journey of Two Hearts
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mt-2 mb-3">
            Our Story
          </h2>
          <GoldDivider hasHeart />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#5A5A40] leading-relaxed">
            "{COUPLE_DATA.ourStoryText}"
          </p>
        </div>

        {/* Bride & Groom Gold Framed Cards with Center Connecting Heart Line */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Animated Golden Line Connecting Profiles with Heart Icon (Desktop) */}
          <div className="hidden md:flex absolute top-1/2 left-0 right-0 -translate-y-1/2 items-center justify-center z-20 pointer-events-none">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF67] to-transparent"
            />
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9, type: 'spring', stiffness: 200 }}
              className="absolute w-12 h-12 rounded-full bg-[#FAF5E8] border-2 border-[#D4AF67] flex items-center justify-center shadow-md"
            >
              <motion.div
                animate={{
                  scale: [1, 1.18, 1],
                  y: [0, -3, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.4,
                  ease: 'easeInOut',
                }}
              >
                <Heart className="w-5 h-5 fill-[#C6A15B] text-[#D4AF67] drop-shadow-[0_1px_4px_rgba(212,175,103,0.4)]" />
              </motion.div>
            </motion.div>
          </div>

          {/* GROOM CARD: Enters from LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="group relative"
          >
            {/* Natural Tones Card */}
            <div className="relative rounded-3xl p-6 sm:p-8 bg-[#FAF5E8] border border-[#D4AF67] shadow-sm hover:shadow-md transition-all duration-500">
              {/* Corner Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4AF67]" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4AF67]" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4AF67]" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4AF67]" />

              {/* Portrait Image with Golden Border */}
              <div className="relative mx-auto w-48 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden p-1.5 bg-[#E6D7B8] border border-[#D4AF67] shadow-sm mb-6">
                <img
                  src={groomImg}
                  alt={COUPLE_DATA.groom.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (COUPLE_DATA.groom.fallbackImage && e.currentTarget.src !== COUPLE_DATA.groom.fallbackImage) {
                      e.currentTarget.src = COUPLE_DATA.groom.fallbackImage;
                    }
                  }}
                  className="w-full h-full object-cover object-top rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Details */}
              <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FFFDF7] border border-[#D4AF67] font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-bold mb-2">
                  {COUPLE_DATA.groom.title}
                </span>

                <h3 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#1A1A1A]">
                  {COUPLE_DATA.groom.name}
                </h3>

                <p className="font-cinzel text-xs text-[#5A5A40] font-medium tracking-wide mt-1 mb-4">
                  {COUPLE_DATA.groom.parents}
                </p>

                <p className="font-sans text-xs sm:text-sm text-[#5A5A40] leading-relaxed mb-4">
                  {COUPLE_DATA.groom.bio}
                </p>

                {/* Quote */}
                <div className="p-3.5 rounded-xl bg-[#E6D7B8]/40 border border-[#D4AF67]/40 flex items-start gap-2.5 text-left">
                  <Quote className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                  <p className="font-cormorant italic text-sm sm:text-base text-[#1A1A1A]">
                    "{COUPLE_DATA.groom.quote}"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* BRIDE CARD: Enters from RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="group relative"
          >
            {/* Natural Tones Card */}
            <div className="relative rounded-3xl p-6 sm:p-8 bg-[#FAF5E8] border border-[#D4AF67] shadow-sm hover:shadow-md transition-all duration-500">
              {/* Corner Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4AF67]" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4AF67]" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4AF67]" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4AF67]" />

              {/* Portrait Image with Golden Border */}
              <div className="relative mx-auto w-48 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden p-1.5 bg-[#E6D7B8] border border-[#D4AF67] shadow-sm mb-6">
                <img
                  src={brideImg}
                  alt={COUPLE_DATA.bride.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (COUPLE_DATA.bride.fallbackImage && e.currentTarget.src !== COUPLE_DATA.bride.fallbackImage) {
                      e.currentTarget.src = COUPLE_DATA.bride.fallbackImage;
                    }
                  }}
                  className="w-full h-full object-cover object-top rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Details */}
              <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FFFDF7] border border-[#D4AF67] font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-bold mb-2">
                  {COUPLE_DATA.bride.title}
                </span>

                <h3 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#1A1A1A]">
                  {COUPLE_DATA.bride.name}
                </h3>

                <p className="font-cinzel text-xs text-[#5A5A40] font-medium tracking-wide mt-1 mb-4">
                  {COUPLE_DATA.bride.parents}
                </p>

                <p className="font-sans text-xs sm:text-sm text-[#5A5A40] leading-relaxed mb-4">
                  {COUPLE_DATA.bride.bio}
                </p>

                {/* Quote */}
                <div className="p-3.5 rounded-xl bg-[#E6D7B8]/40 border border-[#D4AF67]/40 flex items-start gap-2.5 text-left">
                  <Quote className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                  <p className="font-cormorant italic text-sm sm:text-base text-[#1A1A1A]">
                    "{COUPLE_DATA.bride.quote}"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
