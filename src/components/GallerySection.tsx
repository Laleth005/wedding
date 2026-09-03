import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_PHOTOS } from '../data/weddingData';
import { GoldDivider } from './FloralDecorations';
import { Maximize2, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { GalleryPhoto } from '../types';
import { getStoredImage } from '../utils/imageStorage';

const GALLERY_PREFIX = 'wedding_gallery_item_';

export const GallerySection: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(GALLERY_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  // Synchronize stored custom photos from IndexedDB on initial mount if present
  useEffect(() => {
    async function loadCustomGallery() {
      const basePhotos = [...GALLERY_PHOTOS];

      const loadedPhotos = await Promise.all(
        basePhotos.map(async (p) => {
          const directCustom = await getStoredImage(`${GALLERY_PREFIX}${p.id}`);
          if (directCustom) {
            return { ...p, src: directCustom };
          }
          return p;
        })
      );

      setPhotos(loadedPhotos);
    }

    loadCustomGallery();
  }, []);

  const handleOpenLightbox = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
  };

  const handleCloseLightbox = () => {
    setSelectedPhoto(null);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
  };

  return (
    <section id="gallery" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FFFDF7] scroll-mt-24 sm:scroll-mt-28">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="font-cinzel text-xs uppercase tracking-[0.4em] text-[#C6A15B] font-bold">
            Moments Frozen in Gold
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mt-2 mb-3">
            Wedding Gallery
          </h2>
          <GoldDivider hasHeart />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#5A5A40]">
            Glimpses of quiet laughter, beachside sunsets, and cherished memories leading to our wedding day.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {photos.map((photo, index) => {
            const directions = [
              { x: -30, y: 0 },
              { x: 0, y: 30 },
              { x: 30, y: 0 },
              { x: -30, y: 20 },
              { x: 0, y: -20 },
              { x: 30, y: 20 },
            ];
            const dir = directions[index % directions.length];

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, x: dir.x, y: dir.y }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5 }}
                onClick={() => handleOpenLightbox(photo)}
                className="group relative cursor-pointer rounded-2xl overflow-hidden bg-[#FAF5E8] border border-[#D4AF67] transition-all duration-500 shadow-sm hover:shadow-md"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF5E8]">
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (photo.fallbackSrc && e.currentTarget.src !== photo.fallbackSrc) {
                        e.currentTarget.src = photo.fallbackSrc;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Top Right Zoom Pill */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <div
                      className="w-7 h-7 rounded-full bg-[#FAF5E8]/90 backdrop-blur-xs border border-[#D4AF67] flex items-center justify-center text-[#5A5A40] shadow-sm opacity-90 group-hover:opacity-100 transition-opacity"
                      title="Click to expand full screen"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Gold border drawing effect on hover */}
                  <div className="absolute inset-3 rounded-xl border border-[#D4AF67]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Specular Light Sweep Shimmer on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {/* Hover Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 text-left">
                    <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#E6D7B8] font-semibold">
                      {photo.category}
                    </span>
                    <p className="font-cormorant italic text-base text-white/95 mt-0.5 leading-snug">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal Popup */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseLightbox}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A1612]/94 backdrop-blur-md"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:text-[#FAF5E8] hover:bg-white/25 transition-all focus:outline-none z-20 cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/10 text-white hover:text-[#FAF5E8] hover:bg-white/25 transition-all focus:outline-none z-20 cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/10 text-white hover:text-[#FAF5E8] hover:bg-white/25 transition-all focus:outline-none z-20 cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Image Container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] rounded-3xl overflow-hidden p-2 sm:p-2.5 bg-gradient-to-br from-[#D4AF67] via-[#FAF5E8] to-[#C6A15B] shadow-2xl flex flex-col"
            >
              <div className="relative rounded-2xl overflow-hidden bg-[#1A1612] flex flex-col items-center">
                {/* Lightbox Quick Action Toolbar */}
                <div className="w-full px-4 py-2.5 bg-[#241E18] border-b border-[#D4AF67]/30 flex items-center justify-between gap-2 z-10">
                  <span className="font-cinzel text-xs text-[#D4AF67] uppercase tracking-wider font-semibold">
                    {selectedPhoto.category}
                  </span>

                  <a
                    href={selectedPhoto.src}
                    download={`wedding-photo-${selectedPhoto.id}.jpg`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF5E8] font-cinzel text-[11px] tracking-wider uppercase transition-all duration-200"
                    title="Download image"
                  >
                    <Download className="w-3 h-3" />
                    <span>Save Photo</span>
                  </a>
                </div>

                {/* Main Photo View */}
                <div className="relative w-full flex items-center justify-center p-2 bg-[#120E0A] overflow-hidden">
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.caption}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (selectedPhoto.fallbackSrc && e.currentTarget.src !== selectedPhoto.fallbackSrc) {
                        e.currentTarget.src = selectedPhoto.fallbackSrc;
                      }
                    }}
                    className="max-h-[60vh] sm:max-h-[65vh] w-auto max-w-full object-contain rounded-lg select-none"
                  />
                </div>

                {/* Caption Footer */}
                <div className="w-full p-4 sm:p-5 bg-gradient-to-t from-[#1A1612] via-[#2A2218] to-[#1A1612] text-center border-t border-[#D4AF67]/20">
                  <span className="font-cinzel text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF67] font-semibold">
                    {selectedPhoto.category}
                  </span>
                  <p className="font-cormorant italic text-lg sm:text-2xl text-[#FAF5E8] mt-1">
                    "{selectedPhoto.caption}"
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
