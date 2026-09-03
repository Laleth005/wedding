import React from 'react';
import { RoyalMonogram, FloralCorner, GoldDivider } from './FloralDecorations';
import { COUPLE_DATA } from '../data/weddingData';
import { Heart, ChevronUp, Sparkles, MailOpen } from 'lucide-react';

interface FooterProps {
  onReopenInvitation?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReopenInvitation }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FAF5E8] text-[#1A1A1A] border-t border-[#D4AF67]">
      {/* Corner Florals */}
      <FloralCorner position="bottom-left" className="bottom-0 left-0 opacity-40" />
      <FloralCorner position="bottom-right" className="bottom-0 right-0 opacity-40" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Monogram */}
        <div className="mb-6 inline-block">
          <RoyalMonogram size="md" />
        </div>

        {/* Couple Names */}
        <h3 className="font-script text-4xl sm:text-6xl text-[#1A1A1A] drop-shadow-sm">
          Balachandran <span className="font-cormorant italic text-3xl sm:text-4xl text-[#C6A15B]">&</span> Karunya
        </h3>

        <GoldDivider hasHeart className="my-4" />

        <p className="font-cormorant italic text-lg sm:text-2xl text-[#5A5A40] max-w-xl mx-auto mb-2">
          Thank you for being part of our beautiful beginning.
        </p>

        <p className="font-cinzel text-xs uppercase tracking-[0.35em] text-[#C6A15B] font-semibold mb-8">
          {COUPLE_DATA.weddingDisplayDate} • ECR, Chennai
        </p>

        {/* Action buttons: Reopen Invitation Envelope & Back to Top */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {onReopenInvitation && (
            <button
              type="button"
              onClick={onReopenInvitation}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFFDF7] border border-[#D4AF67] text-xs font-cinzel tracking-widest text-[#1A1A1A] hover:bg-[#FAF5E8] transition-all shadow-sm cursor-pointer"
            >
              <MailOpen className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>View Royal Envelope Again</span>
            </button>
          )}

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFFDF7] border border-[#D4AF67] text-xs font-cinzel tracking-widest text-[#1A1A1A] hover:bg-[#FAF5E8] transition-all shadow-sm cursor-pointer"
          >
            <span>Back to Top</span>
            <ChevronUp className="w-3.5 h-3.5 text-[#C6A15B]" />
          </button>
        </div>

        {/* Copyright / Blessing Note */}
        <div className="text-[11px] font-sans text-[#5A5A40]/80 pt-6 border-t border-[#D4AF67]/30">
          <p>© 2025 Balachandran & Karunya Wedding Celebration • Crafted with endless love & blessings</p>
        </div>
      </div>
    </footer>
  );
};
