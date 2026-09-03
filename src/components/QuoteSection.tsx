import React from 'react';
import { motion } from 'motion/react';
import { COUPLE_DATA } from '../data/weddingData';
import { GoldDivider, FloralCorner } from './FloralDecorations';
import { Heart, Sparkles } from 'lucide-react';

export const QuoteSection: React.FC = () => {
  return (
    <section className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FAF5E8]">
      {/* Background Floral Overlay Elements */}
      <FloralCorner position="top-left" className="top-0 left-0 opacity-40" />
      <FloralCorner position="bottom-right" className="bottom-0 right-0 opacity-40" />

      {/* Center soft glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#D4AF67]/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Shimmering Top Accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="w-5 h-5 text-[#C6A15B] animate-spin-slow" />
          <Heart className="w-5 h-5 text-[#D4AF67] fill-[#D4AF67]/40" />
          <Sparkles className="w-5 h-5 text-[#C6A15B] animate-spin-slow" />
        </motion.div>

        {/* The Golden Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-cormorant italic text-3xl sm:text-5xl md:text-6xl text-[#1A1A1A] leading-snug sm:leading-tight px-4"
        >
          <span className="gold-gradient-text drop-shadow-sm font-semibold">
            “{COUPLE_DATA.primaryQuote}”
          </span>
        </motion.blockquote>

        <GoldDivider hasHeart className="my-6 sm:my-8" />

        {/* Script Signatures */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <span className="font-script text-4xl sm:text-5xl text-[#1A1A1A]">
            Balachandran & Karunya
          </span>
          <span className="font-cinzel text-xs uppercase tracking-[0.35em] text-[#C6A15B] mt-1 font-semibold">
            {COUPLE_DATA.weddingDisplayDate}
          </span>
        </motion.div>
      </div>
    </section>
  );
};
