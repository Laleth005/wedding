import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WaxSeal, FloralCorner, RoyalMonogram, GoldDivider } from './FloralDecorations';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnvelopeEntranceProps {
  onOpenComplete: () => void;
  onClose?: () => void;
}

export const EnvelopeEntrance: React.FC<EnvelopeEntranceProps> = ({ onOpenComplete, onClose }) => {
  const [stage, setStage] = useState<'envelope-ready' | 'opening' | 'opened'>('envelope-ready');

  const handleClose = () => {
    setStage('opened');
    if (onClose) {
      onClose();
    } else {
      onOpenComplete();
    }
  };

  const handleOpenEnvelope = () => {
    if (stage !== 'envelope-ready') return;
    setStage('opening');

    // Trigger celebratory gold and rose petal confetti burst
    confetti({
      particleCount: 85,
      spread: 100,
      origin: { y: 0.55 },
      colors: ['#D4AF67', '#F3E5C8', '#FFFDF7', '#C6A15B', '#FAD4D8'],
      ticks: 200,
      gravity: 0.8,
      scalar: 1.2,
      shapes: ['circle'],
    });

    // Secondary delayed petal sweep
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.6 },
        colors: ['#E8D3A7', '#D4AF67', '#FFEFEF'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.6 },
        colors: ['#E8D3A7', '#D4AF67', '#FFEFEF'],
      });
    }, 350);

    // Complete transition to main page
    setTimeout(() => {
      setStage('opened');
      onOpenComplete();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {stage !== 'opened' && (
        <motion.div
          key="entrance-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          {/* Subtle background luxury ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A2D1B]/40 via-transparent to-transparent pointer-events-none" />

          {/* Golden floating dust dots */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#D4AF67] blur-[1px] animate-pulse" />
            <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 rounded-full bg-[#F3E5C8] blur-[1px] animate-ping" />
            <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-[#C6A15B] blur-[1px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-[#FFEAC0] blur-[1px] animate-pulse" />
          </div>

          {/* The Luxury Wedding Envelope Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg my-auto"
          >
            {/* Top Close Bar */}
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#E6D7B8]">
                INV
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5E8]/15 hover:bg-[#FAF5E8]/30 border border-[#D4AF67]/40 text-[#FAF5E8] text-xs font-cinzel tracking-wider uppercase transition-colors cursor-pointer"
              >
                <span>Close ✕</span>
              </button>
            </div>

              {/* Envelope Body */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#FAF5E8] via-[#FFFDF7] to-[#F5EEDD] p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_30px_rgba(212,175,103,0.25)] border border-[#D4AF67]/50 text-center overflow-hidden">
                {/* Corner Floral Ornaments */}
                <FloralCorner position="top-left" className="!w-24 !h-24 sm:!w-32 sm:!h-32 -top-2 -left-2" />
                <FloralCorner position="top-right" className="!w-24 !h-24 sm:!w-32 sm:!h-32 -top-2 -right-2" />
                <FloralCorner position="bottom-left" className="!w-24 !h-24 sm:!w-32 sm:!h-32 -bottom-2 -left-2" />
                <FloralCorner position="bottom-right" className="!w-24 !h-24 sm:!w-32 sm:!h-32 -bottom-2 -right-2" />

                {/* Fine double gold border inside envelope */}
                <div className="absolute inset-3 sm:inset-4 rounded-xl border border-[#D4AF67]/30 pointer-events-none" />
                <div className="absolute inset-4 sm:inset-5 rounded-lg border border-dashed border-[#C6A15B]/20 pointer-events-none" />

                {/* Envelope Triangular Flap Fold Lines */}
                <motion.div
                  animate={stage === 'opening' ? { rotateX: 180, y: -40, opacity: 0 } : { rotateX: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-none absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#F2E7CD]/70 to-transparent border-b border-[#D4AF67]/40 [clip-path:polygon(0_0,100%_0,50%_100%)] origin-top"
                />

                {/* Content Inside Envelope */}
                <div className="relative z-10 py-4">
                  <p className="font-cinzel text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#C6A15B] font-bold">
                    Together with their families
                  </p>

                  {/* Couple Names */}
                  <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#1A1A1A] mt-2 mb-1 drop-shadow-sm">
                    Balachandran <span className="font-cormorant italic text-3xl sm:text-4xl text-[#C6A15B]">&</span> Karunya
                  </h1>

                  <GoldDivider hasHeart className="my-3" />

                  <p className="font-cormorant italic text-lg sm:text-xl text-[#5A5A40]">
                    Cordially invite you to celebrate their wedding
                  </p>

                  <div className="mt-4 inline-flex flex-col items-center justify-center px-4 py-2 rounded-lg bg-[#FAF5E8] border border-[#D4AF67]">
                    <span className="font-cinzel text-xs font-semibold tracking-widest text-[#1A1A1A] uppercase">
                      Thursday, 15 October 2026 • 5:30 PM
                    </span>
                    <span className="text-[11px] text-[#5A5A40] font-medium tracking-wide mt-0.5">
                      Ocean Breeze Beach Resort, ECR, Chennai
                    </span>
                  </div>

                  {/* Wax Seal / Open Button Area */}
                  <div className="mt-8 flex flex-col items-center justify-center">
                    <motion.div
                      animate={
                        stage === 'opening'
                          ? { scale: [1, 1.25, 0], rotate: 45, opacity: 0 }
                          : { scale: [1, 1.03, 1] }
                      }
                      transition={
                        stage === 'opening'
                          ? { duration: 0.8, ease: 'easeInOut' }
                          : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
                      }
                    >
                      <WaxSeal onClick={handleOpenEnvelope} isInteractive={stage === 'envelope-ready'} />
                    </motion.div>

                    {/* Open Invitation Button */}
                    <motion.button
                      type="button"
                      onClick={handleOpenEnvelope}
                      disabled={stage === 'opening'}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-6 inline-flex items-center gap-2.5 px-8 py-3 rounded-full gold-gradient-btn text-[#1A1A1A] border border-[#D4AF67] font-cinzel font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-sm group cursor-pointer"
                    >
                      <span>{stage === 'opening' ? 'Unfolding Invitation...' : 'Open Invitation'}</span>
                      <Sparkles className="w-4 h-4 text-[#C6A15B] group-hover:rotate-45 transition-transform" />
                    </motion.button>

                    <p className="text-[11px] font-cormorant italic text-[#5A5A40] mt-3">
                      Touch the golden wax seal or click to enter the celebration
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
