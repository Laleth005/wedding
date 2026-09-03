import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoldDivider, FloralCorner } from './FloralDecorations';
import { Camera, Upload, Maximize2, X, Sparkles, RotateCcw, Heart, Users } from 'lucide-react';
import { getStoredImage, saveStoredImage, removeStoredImage } from '../utils/imageStorage';

const FAMILY_STORAGE_KEY = 'balachandran_karunya_custom_family_photo';
const DEFAULT_FAMILY_PHOTO = '/family.jpg';
const FALLBACK_FAMILY_PHOTO = '/family_celebration.jpg';

export const FamilySection: React.FC = () => {
  const [photoSrc, setPhotoSrc] = useState<string>(DEFAULT_FAMILY_PHOTO);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    async function loadSavedFamilyPhoto() {
      const stored = await getStoredImage(FAMILY_STORAGE_KEY);
      if (stored) {
        setPhotoSrc(stored);
        setIsCustom(true);
      }
    }
    loadSavedFamilyPhoto();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    try {
      showToast('Updating family portrait...');
      const reader = new FileReader();
      reader.onload = async () => {
        const rawData = reader.result as string;
        // Optimize image to reasonable dimensions (max 1800px)
        const img = new Image();
        img.onload = async () => {
          let { width, height } = img;
          const maxDim = 1800;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.9);
            await saveStoredImage(FAMILY_STORAGE_KEY, optimized);
            setPhotoSrc(optimized);
          } else {
            await saveStoredImage(FAMILY_STORAGE_KEY, rawData);
            setPhotoSrc(rawData);
          }
          setIsCustom(true);
          showToast('Family portrait updated successfully! ✨');
        };
        img.onerror = async () => {
          await saveStoredImage(FAMILY_STORAGE_KEY, rawData);
          setPhotoSrc(rawData);
          setIsCustom(true);
          showToast('Family portrait updated! ✨');
        };
        img.src = rawData;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to update family photo:', err);
      showToast('Could not load image file');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset the family photo to the default portrait?')) return;
    try {
      await removeStoredImage(FAMILY_STORAGE_KEY);
      setPhotoSrc(DEFAULT_FAMILY_PHOTO);
      setIsCustom(false);
      showToast('Family portrait reset to default');
    } catch (e) {
      console.error('Error resetting family photo:', e);
    }
  };

  return (
    <section
      id="family"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FFFDF7] border-t border-[#D4AF67]/40"
    >
      {/* Botanical Corner Accents */}
      <FloralCorner position="top-left" className="top-0 left-0 opacity-30" />
      <FloralCorner position="top-right" className="top-0 right-0 opacity-30" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5E8] border border-[#D4AF67]/60 text-[#8C6A28] font-cinzel text-[11px] uppercase tracking-[0.25em] font-semibold mb-3">
            <Users className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Blessed By Tradition</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mt-1 mb-3">
            Our Beloved Families
          </h2>
          <GoldDivider hasHeart />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#5A5A40] mt-3">
            "With the divine grace of the Almighty and the loving blessings of our parents and elders, two families unite as one."
          </p>

          {/* Controls */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF67] to-[#C6A15B] hover:from-[#C6A15B] hover:to-[#B5914A] text-white font-cinzel text-xs tracking-wider uppercase font-semibold shadow-sm hover:shadow transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Change Family Photo</span>
            </button>

            {isCustom && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FAF5E8] hover:bg-[#F3ECD8] border border-[#D4AF67]/60 text-[#8C6A28] font-cinzel text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <RotateCcw className="w-3 h-3 text-[#C6A15B]" />
                <span>Reset Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="hidden"
        />

        {/* Grand Family Portrait Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className={`relative rounded-3xl p-3 sm:p-5 bg-gradient-to-br from-[#EFE6CE] via-[#FAF5E8] to-[#E3D4B0] border-2 transition-all duration-500 shadow-xl ${
            isDragging
              ? 'border-dashed border-[#C6A15B] ring-4 ring-[#C6A15B]/30 scale-[1.01]'
              : 'border-[#D4AF67]'
          }`}
        >
          {/* Inner Ornate Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-[#1A1612] border border-[#D4AF67]/60 group">
            {/* Aspect Ratio Container for Panoramic / Group Photo */}
            <div
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] max-h-[580px] overflow-hidden cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={photoSrc}
                alt="Balachandran & Karunya Family Portrait"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (e.currentTarget.src !== FALLBACK_FAMILY_PHOTO) {
                    e.currentTarget.src = FALLBACK_FAMILY_PHOTO;
                  }
                }}
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

              {/* Drag & Drop Overlay */}
              {isDragging && (
                <div className="absolute inset-0 bg-[#FAF5E8]/92 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
                  <Upload className="w-10 h-10 text-[#C6A15B] animate-bounce mb-2" />
                  <span className="font-cinzel text-sm uppercase tracking-wider text-[#8C6A28] font-bold">
                    Drop your family photograph here to update
                  </span>
                </div>
              )}

              {/* Top Controls on Image */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#FAF5E8]/95 hover:bg-[#FAF5E8] border border-[#D4AF67] text-[#8C6A28] font-cinzel text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-xs"
                  title="Upload new family photo"
                >
                  <Camera className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Change Photo</span>
                </button>

                <div
                  className="w-8 h-8 rounded-full bg-[#FAF5E8]/90 backdrop-blur-xs border border-[#D4AF67] flex items-center justify-center text-[#5A5A40] shadow-sm group-hover:scale-105 transition-transform"
                  title="Click to view full size"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bottom Caption on Image */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2 pointer-events-none">
                <div>
                  <span className="font-cinzel text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#E6D7B8] font-semibold drop-shadow">
                    United In Love & Blessings
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl text-white drop-shadow-md">
                    The Kanagaraj & Mathivanan Families
                  </h3>
                </div>

                <span className="font-cormorant italic text-sm sm:text-base text-[#FAF5E8]/90 drop-shadow">
                  Ocean Breeze Beach Resort, ECR
                </span>
              </div>
            </div>
          </div>

          {/* Two Families Cards Grid Below the Portrait */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Groom's Family */}
            <div className="rounded-2xl p-5 sm:p-6 bg-[#FFFDF7] border border-[#D4AF67]/70 shadow-xs relative overflow-hidden text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#C6A15B]" />
                <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#8C6A28] font-bold">
                  Groom's Family
                </span>
              </div>

              <h4 className="font-cinzel text-lg sm:text-xl text-[#1A1A1A] font-semibold">
                Mr. K. Kanagaraj & Mrs. Kavitha
              </h4>
              <p className="font-cormorant text-base text-[#5A5A40] mt-0.5">
                Beloved Parents of Balachandran
              </p>

              <div className="mt-3 pt-3 border-t border-[#D4AF67]/30 flex flex-col gap-1">
                <p className="text-xs sm:text-sm text-[#1A1A1A] font-medium font-sans">
                  <span className="text-[#8C6A28] font-cinzel text-xs">Sister:</span> Harinitha
                </p>
                <p className="font-cormorant italic text-sm text-[#5A5A40] mt-1">
                  "Welcoming Karunya as the bright light and daughter of our home and hearts."
                </p>
              </div>
            </div>

            {/* Bride's Family */}
            <div className="rounded-2xl p-5 sm:p-6 bg-[#FFFDF7] border border-[#D4AF67]/70 shadow-xs relative overflow-hidden text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#C6A15B]" />
                <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#8C6A28] font-bold">
                  Bride's Family
                </span>
              </div>

              <h4 className="font-cinzel text-lg sm:text-xl text-[#1A1A1A] font-semibold">
                Mr. Mathivanan & Mrs. Akilandeswari
              </h4>
              <p className="font-cormorant text-base text-[#5A5A40] mt-0.5">
                Cherished Parents of Karunya
              </p>

              <div className="mt-3 pt-3 border-t border-[#D4AF67]/30 flex flex-col gap-1">
                <p className="text-xs sm:text-sm text-[#1A1A1A] font-medium font-sans">
                  <span className="text-[#8C6A28] font-cinzel text-xs">With Love & Grace</span>
                </p>
                <p className="font-cormorant italic text-sm text-[#5A5A40] mt-1">
                  "Blessing Balachandran as our beloved son-in-law and walking together in joy."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer z-20"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full rounded-2xl overflow-hidden bg-[#1A1612] p-2 border border-[#D4AF67]/60 shadow-2xl"
            >
              <div className="relative max-h-[80vh] flex items-center justify-center overflow-hidden rounded-xl bg-black">
                <img
                  src={photoSrc}
                  alt="Family Portrait"
                  referrerPolicy="no-referrer"
                  className="max-h-[78vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="p-4 text-center bg-[#241E18] text-[#FAF5E8]">
                <h4 className="font-cinzel text-lg sm:text-xl text-[#D4AF67]">
                  The Kanagaraj & Mathivanan Families
                </h4>
                <p className="font-cormorant italic text-sm sm:text-base text-[#FAF5E8]/80 mt-0.5">
                  "A bond forged by love, strengthened by family, and blessed by eternity."
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-6 z-50 px-4 py-2.5 rounded-full bg-[#1A1A1A]/90 backdrop-blur-md border border-[#D4AF67] text-[#FAF5E8] shadow-xl flex items-center gap-2 font-cinzel text-xs tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF67]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
