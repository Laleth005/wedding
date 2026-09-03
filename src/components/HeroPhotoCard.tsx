import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { processImageCutout } from '../utils/cutoutProcessor';
import { getStoredImage, saveStoredImage, cleanupLegacyStorage } from '../utils/imageStorage';

interface HeroPhotoCardProps {
  replayKey: number;
  isSettled: boolean;
  onPhotoUploaded?: (photoUrl: string) => void;
}

const DEFAULT_COUPLE_PHOTO = '/couple.png';
const STORAGE_RAW_KEY = 'balachandran_karunya_custom_couple_photo';
const STORAGE_CUTOUT_KEY = 'balachandran_karunya_custom_couple_cutout';
const STORAGE_MODE_KEY = 'balachandran_karunya_cutout_mode';

const CANDIDATE_IMAGE_URLS = [
  '/couple.png',
  '/couple_candidate_1.png',
  '/ChatGPT Image Sep 3, 2026, 01_28_38 PM.png',
  '/ChatGPT%20Image%20Sep%203%2C%202026%2C%2001_28_38%20PM.png',
  '/ChatGPT Image Sep 3, 2026, 02_02_57 PM.png',
  '/ChatGPT%20Image%20Sep%203%2C%202026%2C%2002_02_57%20PM.png',
  '/groom.jpg',
  '/bride.jpg',
];

export const HeroPhotoCard: React.FC<HeroPhotoCardProps> = ({ replayKey, isSettled }) => {
  // Raw source image
  const [rawPhotoSrc, setRawPhotoSrc] = useState<string>(() => {
    return CANDIDATE_IMAGE_URLS[0];
  });

  // Processed cutout image with transparent background
  const [cutoutSrc, setCutoutSrc] = useState<string>('');

  // Default to CUTOUT (No Background) mode
  const [isCutoutMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MODE_KEY);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tolerance] = useState<number>(45);

  const cardRef = useRef<HTMLDivElement | null>(null);

  // Function to process an image into a background-free cutout
  const processAndSetImage = useCallback(async (src: string, tol = tolerance) => {
    setIsProcessing(true);
    try {
      const result = await processImageCutout(src, tol);
      setCutoutSrc(result.dataUrl);
      // Persist to IndexedDB (virtually unlimited quota, no localStorage 5MB crashes)
      await saveStoredImage(STORAGE_CUTOUT_KEY, result.dataUrl);
    } catch (err) {
      console.warn('[HeroPhotoCard] Cutout processing fallback:', err);
      setCutoutSrc(src);
    } finally {
      setIsProcessing(false);
    }
  }, [tolerance]);

  // Load from IndexedDB or try candidate file paths on mount
  useEffect(() => {
    async function initImages() {
      // Free localStorage quota from old giant strings
      cleanupLegacyStorage([STORAGE_RAW_KEY, STORAGE_CUTOUT_KEY]);

      const storedCutout = await getStoredImage(STORAGE_CUTOUT_KEY);
      const storedRaw = await getStoredImage(STORAGE_RAW_KEY);

      if (storedCutout && storedRaw && storedRaw !== DEFAULT_COUPLE_PHOTO) {
        setRawPhotoSrc(storedRaw);
        setCutoutSrc(storedCutout);
        return;
      }

      // Test candidate URLs from public directory
      let foundValidUrl = false;
      for (const candidate of CANDIDATE_IMAGE_URLS) {
        try {
          const img = new Image();
          const loaded = await new Promise<boolean>((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = candidate;
          });
          if (loaded) {
            setRawPhotoSrc(candidate);
            await processAndSetImage(candidate);
            foundValidUrl = true;
            break;
          }
        } catch {
          // Continue
        }
      }

      if (!foundValidUrl) {
        if (storedCutout) {
          setCutoutSrc(storedCutout);
          if (storedRaw) setRawPhotoSrc(storedRaw);
        } else {
          setRawPhotoSrc(DEFAULT_COUPLE_PHOTO);
          processAndSetImage(DEFAULT_COUPLE_PHOTO);
        }
      }
    }

    initImages();
  }, [processAndSetImage]);

  // Handle image load error on fallback
  const handleImageError = () => {
    if (rawPhotoSrc !== DEFAULT_COUPLE_PHOTO) {
      setRawPhotoSrc(DEFAULT_COUPLE_PHOTO);
      saveStoredImage(STORAGE_RAW_KEY, DEFAULT_COUPLE_PHOTO);
      processAndSetImage(DEFAULT_COUPLE_PHOTO);
    }
  };

  // Subtle interactive 3D parallax on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSettled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 12, y: -y * 12 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const displayedImageSrc = isCutoutMode && cutoutSrc ? cutoutSrc : rawPhotoSrc;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[500px] lg:max-w-[560px] xl:max-w-[600px] flex flex-col items-center md:items-end justify-end perspective-1200 mx-auto md:ml-auto md:mr-0 select-none"
    >
      {/* 3D Animated Couple Presentation */}
      <motion.div
        key={`couple-stage-${replayKey}`}
        initial={{
          opacity: 0,
          scale: 1.15,
          filter: 'blur(12px)',
          rotateY: 0,
          rotateX: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          rotateY: isHovered && isSettled ? mousePos.x : 0,
          rotateX: isHovered && isSettled ? mousePos.y : 0,
        }}
        transition={{
          opacity: { duration: 1.2, delay: 0.8 },
          scale: { duration: 2.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] },
          filter: { duration: 1.6, delay: 0.8, ease: 'easeOut' },
          rotateY: { duration: 0.4, ease: 'easeOut' },
          rotateX: { duration: 0.4, ease: 'easeOut' },
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full flex flex-col items-center md:items-end justify-end"
      >
        {isCutoutMode ? (
          /* =======================================================
             NO BACKGROUND (PURE TRANSPARENT CUTOUT)
             The couple stands directly in the 3D cinematic scene
             ======================================================= */
          <div className="relative w-full flex flex-col items-center md:items-end">
            {/* Soft Champagne Golden Aura / Rim Glow tracing behind couple */}
            <motion.div
              animate={
                isSettled
                  ? {
                      scale: [0.98, 1.05, 0.98],
                      opacity: [0.65, 0.95, 0.65],
                    }
                  : {}
              }
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: 'easeInOut',
              }}
              className="pointer-events-none absolute -inset-4 bg-radial from-[#D4AF67]/35 via-[#F5E5C0]/15 to-transparent blur-3xl -z-10"
            />

            {/* Subtle Volumetric Golden Halo behind heads */}
            <motion.div
              animate={
                isSettled
                  ? {
                      scale: [0.96, 1.04, 0.96],
                      opacity: [0.75, 1, 0.75],
                    }
                  : {}
              }
              transition={{
                repeat: Infinity,
                duration: 4.5,
                delay: 0.5,
                ease: 'easeInOut',
              }}
              className="pointer-events-none absolute top-[8%] right-[10%] md:right-[8%] w-[320px] h-[320px] rounded-full bg-gradient-to-b from-[#F5E5C0]/40 to-transparent blur-2xl -z-10"
            />

            {/* The Cutout Couple Image - Right Aligned with Lifelike Subtle Floating Animation */}
            <motion.div
              className="relative z-10 w-full flex justify-center md:justify-end"
              animate={
                isSettled
                  ? {
                      y: [0, -6, 0],
                    }
                  : {}
              }
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={displayedImageSrc}
                alt="Balachandran and Karunya authentic wedding portrait without background"
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-auto max-h-[500px] sm:max-h-[560px] lg:max-h-[620px] xl:max-h-[660px] object-contain object-bottom select-none transition-all duration-700 md:ml-auto"
                style={{
                  // Golden Rim Lighting and Realistic Soft Ambient Shadows
                  filter: isHovered
                    ? 'drop-shadow(0 25px 35px rgba(26,22,18,0.32)) drop-shadow(0 0 35px rgba(212,175,103,0.45)) drop-shadow(0 2px 6px rgba(140,106,40,0.3))'
                    : 'drop-shadow(0 20px 30px rgba(26,22,18,0.24)) drop-shadow(0 0 25px rgba(212,175,103,0.3)) drop-shadow(0 2px 4px rgba(140,106,40,0.2))',
                }}
              />
            </motion.div>

            {/* 3D Ground Elliptical Shadow beneath couple's feet (gently breathes with levitation) */}
            <motion.div
              animate={
                isSettled
                  ? {
                      scale: [1, 0.93, 1],
                      opacity: [0.85, 0.65, 0.85],
                    }
                  : {}
              }
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: 'easeInOut',
              }}
              className="w-[300px] sm:w-[380px] h-7 rounded-[100%] bg-radial from-[#5A4018]/30 via-[#8C6A28]/15 to-transparent blur-md -mt-4 z-0 pointer-events-none md:mr-6"
            />
          </div>
        ) : (
          /* =======================================================
             MODE 2: FRAMED PORTRAIT VIEW
             (Available via toggle if user wants classical frame)
             ======================================================= */
          <div
            className={`relative rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-[#FFFDF7] via-[#FAF5E8] to-[#F3E5C8] border border-[#D4AF67] transition-shadow duration-700 w-full max-w-[440px] sm:max-w-[480px] ${
              isHovered ? 'gold-rim-lighting-active' : 'gold-rim-lighting'
            }`}
          >
            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF67]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4AF67]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4AF67]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF67]" />

            <div className="relative overflow-hidden rounded-2xl border border-[#D4AF67]/60 aspect-[3/4] w-full bg-[#1A1815] shadow-inner group">
              <img
                src={displayedImageSrc}
                alt="Balachandran and Karunya authentic wedding portrait"
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full h-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141210]/75 via-transparent to-[#D4AF67]/15" />
            </div>
          </div>
        )}

        {/* Loading / Processing Indicator */}
        {isProcessing && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-[#FAF5E8]/95 border border-[#D4AF67] shadow-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C6A15B] animate-spin" />
            <span className="font-cinzel text-xs text-[#8C6A28] font-bold">
              Removing background...
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
