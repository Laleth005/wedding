import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_PHOTOS } from '../data/weddingData';
import { GoldDivider } from './FloralDecorations';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
  Plus,
  RotateCcw,
  Edit3,
  Check,
  Download,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { GalleryPhoto } from '../types';
import { getStoredImage, saveStoredImage, removeStoredImage } from '../utils/imageStorage';

const GROOM_STORAGE_KEY = 'balachandran_custom_groom_photo';
const BRIDE_STORAGE_KEY = 'karunya_custom_bride_photo';
const COUPLE_STORAGE_KEY = 'balachandran_karunya_custom_couple_photo';
const GALLERY_PREFIX = 'wedding_gallery_item_';
const GALLERY_META_KEY = 'wedding_gallery_metadata_v2';
const GALLERY_CUSTOM_IDS_KEY = 'wedding_gallery_custom_ids_v2';

// Helper to optimize image file to high-res, light DataURL (max 1600px width/height)
function readFileAsOptimizedDataUrl(file: File, maxDim = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
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
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const GallerySection: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(GALLERY_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [hasCustomPhotos, setHasCustomPhotos] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dragOverPhotoId, setDragOverPhotoId] = useState<string | null>(null);

  // Lightbox edit caption mode
  const [isEditingCaption, setIsEditingCaption] = useState<boolean>(false);
  const [editCaption, setEditCaption] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');

  // Add Photo Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [newPhotoCaption, setNewPhotoCaption] = useState<string>('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<string>('Wedding Memory');

  // Input refs
  const cardFileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const lightboxFileInputRef = useRef<HTMLInputElement | null>(null);
  const addModalFileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Synchronize stored custom photos from IndexedDB on initial mount
  useEffect(() => {
    async function loadCustomGallery() {
      let isAnyCustom = false;
      const basePhotos = [...GALLERY_PHOTOS];

      // Check global groom, bride, couple stored keys
      const [customGroom, customBride, customCouple] = await Promise.all([
        getStoredImage(GROOM_STORAGE_KEY),
        getStoredImage(BRIDE_STORAGE_KEY),
        getStoredImage(COUPLE_STORAGE_KEY),
      ]);

      // Check per-photo overrides in IndexedDB
      const loadedPhotos = await Promise.all(
        basePhotos.map(async (p) => {
          const directCustom = await getStoredImage(`${GALLERY_PREFIX}${p.id}`);
          if (directCustom) {
            isAnyCustom = true;
            return { ...p, src: directCustom };
          }
          if (p.id === 'g1' && customCouple) {
            isAnyCustom = true;
            return { ...p, src: customCouple };
          }
          if (p.id === 'g4' && customGroom) {
            isAnyCustom = true;
            return { ...p, src: customGroom };
          }
          if (p.id === 'g5' && customBride) {
            isAnyCustom = true;
            return { ...p, src: customBride };
          }
          return p;
        })
      );

      // Check custom extra photos added by user
      try {
        const customIdsRaw = await getStoredImage(GALLERY_CUSTOM_IDS_KEY);
        if (customIdsRaw) {
          const customIds: string[] = JSON.parse(customIdsRaw);
          for (const customId of customIds) {
            const customSrc = await getStoredImage(`${GALLERY_PREFIX}${customId}`);
            const metaRaw = await getStoredImage(`${GALLERY_META_KEY}_${customId}`);
            const meta = metaRaw ? JSON.parse(metaRaw) : { caption: 'Cherished Celebration', category: 'Wedding Memory' };
            if (customSrc) {
              isAnyCustom = true;
              loadedPhotos.push({
                id: customId,
                src: customSrc,
                caption: meta.caption,
                category: meta.category,
              });
            }
          }
        }
      } catch (e) {
        console.warn('Error loading custom gallery photos:', e);
      }

      // Check custom metadata for standard photos
      const photosWithMeta = await Promise.all(
        loadedPhotos.map(async (p) => {
          try {
            const metaRaw = await getStoredImage(`${GALLERY_META_KEY}_${p.id}`);
            if (metaRaw) {
              const meta = JSON.parse(metaRaw);
              return { ...p, caption: meta.caption || p.caption, category: meta.category || p.category };
            }
          } catch {
            // Ignore
          }
          return p;
        })
      );

      setPhotos(photosWithMeta);
      setHasCustomPhotos(isAnyCustom);
    }

    loadCustomGallery();
  }, []);

  // Update a specific photo image with a selected file
  const handleUpdatePhoto = async (photoId: string, file: File) => {
    try {
      showToast('Processing photo...');
      const dataUrl = await readFileAsOptimizedDataUrl(file);

      // Save into IndexedDB
      await saveStoredImage(`${GALLERY_PREFIX}${photoId}`, dataUrl);

      // If it's the hero couple, groom, or bride, also update the main keys so the whole website stays synced
      if (photoId === 'g1') {
        await saveStoredImage(COUPLE_STORAGE_KEY, dataUrl);
      } else if (photoId === 'g4') {
        await saveStoredImage(GROOM_STORAGE_KEY, dataUrl);
      } else if (photoId === 'g5') {
        await saveStoredImage(BRIDE_STORAGE_KEY, dataUrl);
      }

      setPhotos((prev) =>
        prev.map((p) => {
          if (p.id === photoId) {
            return { ...p, src: dataUrl };
          }
          return p;
        })
      );

      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto((prev) => (prev ? { ...prev, src: dataUrl } : null));
      }

      setHasCustomPhotos(true);
      showToast('Gallery photo successfully updated! ✨');
    } catch (err) {
      console.error('Failed to update gallery photo:', err);
      showToast('Could not load image. Please try another file.');
    }
  };

  // Reset gallery to curated defaults
  const handleResetGallery = async () => {
    if (!window.confirm('Reset the wedding gallery to the original curated photos?')) {
      return;
    }

    try {
      // Clear custom storage keys for gallery
      for (const p of photos) {
        await removeStoredImage(`${GALLERY_PREFIX}${p.id}`);
        await removeStoredImage(`${GALLERY_META_KEY}_${p.id}`);
      }
      await removeStoredImage(GALLERY_CUSTOM_IDS_KEY);

      setPhotos(GALLERY_PHOTOS);
      setHasCustomPhotos(false);
      if (selectedPhoto) {
        const found = GALLERY_PHOTOS.find((p) => p.id === selectedPhoto.id);
        setSelectedPhoto(found || null);
      }
      showToast('Gallery restored to original curated photos');
    } catch (e) {
      console.error('Error resetting gallery:', e);
    }
  };

  // Add a brand new photo to the gallery
  const handleAddNewPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoFile && !newPhotoPreview) {
      showToast('Please select a photo to upload');
      return;
    }

    try {
      const dataUrl = newPhotoPreview || (await readFileAsOptimizedDataUrl(newPhotoFile!));
      const newId = `g_custom_${Date.now()}`;
      const newEntry: GalleryPhoto = {
        id: newId,
        src: dataUrl,
        caption: newPhotoCaption.trim() || 'A golden memory etched in time',
        category: newPhotoCategory.trim() || 'Wedding Memory',
      };

      // Save photo & metadata
      await saveStoredImage(`${GALLERY_PREFIX}${newId}`, dataUrl);
      await saveStoredImage(
        `${GALLERY_META_KEY}_${newId}`,
        JSON.stringify({ caption: newEntry.caption, category: newEntry.category })
      );

      // Save to custom IDs list
      const customIdsRaw = await getStoredImage(GALLERY_CUSTOM_IDS_KEY);
      const customIds: string[] = customIdsRaw ? JSON.parse(customIdsRaw) : [];
      customIds.push(newId);
      await saveStoredImage(GALLERY_CUSTOM_IDS_KEY, JSON.stringify(customIds));

      setPhotos((prev) => [...prev, newEntry]);
      setHasCustomPhotos(true);
      setIsAddModalOpen(false);
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
      setNewPhotoCaption('');
      setNewPhotoCategory('Wedding Memory');
      showToast('New photo added to the gallery! ✨');
    } catch (err) {
      console.error('Failed to add new photo:', err);
      showToast('Failed to add photo. Please try again.');
    }
  };

  // Save edited caption & category
  const handleSaveCaption = async () => {
    if (!selectedPhoto) return;
    const photoId = selectedPhoto.id;
    const updatedCaption = editCaption.trim() || selectedPhoto.caption;
    const updatedCategory = editCategory.trim() || selectedPhoto.category;

    const updated = {
      ...selectedPhoto,
      caption: updatedCaption,
      category: updatedCategory,
    };

    setSelectedPhoto(updated);
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? updated : p)));

    try {
      await saveStoredImage(
        `${GALLERY_META_KEY}_${photoId}`,
        JSON.stringify({ caption: updatedCaption, category: updatedCategory })
      );
      setHasCustomPhotos(true);
      setIsEditingCaption(false);
      showToast('Caption updated successfully!');
    } catch (err) {
      console.error('Error saving caption:', err);
    }
  };

  // Delete a custom added photo
  const handleDeletePhoto = async (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this custom photo from the gallery?')) return;

    try {
      await removeStoredImage(`${GALLERY_PREFIX}${photoId}`);
      await removeStoredImage(`${GALLERY_META_KEY}_${photoId}`);

      const customIdsRaw = await getStoredImage(GALLERY_CUSTOM_IDS_KEY);
      if (customIdsRaw) {
        const customIds: string[] = JSON.parse(customIdsRaw);
        const filtered = customIds.filter((id) => id !== photoId);
        await saveStoredImage(GALLERY_CUSTOM_IDS_KEY, JSON.stringify(filtered));
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto(null);
      }
      showToast('Photo removed from gallery');
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  // Lightbox handlers
  const handleOpenLightbox = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    setEditCaption(photo.caption);
    setEditCategory(photo.category);
    setIsEditingCaption(false);
  };

  const handleCloseLightbox = () => {
    setSelectedPhoto(null);
    setIsEditingCaption(false);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    const nextPhoto = photos[nextIndex];
    setSelectedPhoto(nextPhoto);
    setEditCaption(nextPhoto.caption);
    setEditCategory(nextPhoto.category);
    setIsEditingCaption(false);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    const prevPhoto = photos[prevIndex];
    setSelectedPhoto(prevPhoto);
    setEditCaption(prevPhoto.caption);
    setEditCategory(prevPhoto.category);
    setIsEditingCaption(false);
  };

  return (
    <section id="gallery" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FFFDF7]">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
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

          {/* Interactive Controls Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF67] to-[#C6A15B] hover:from-[#C6A15B] hover:to-[#B5914A] text-white font-cinzel text-xs tracking-wider uppercase font-semibold shadow-sm hover:shadow transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photo</span>
            </button>

            {hasCustomPhotos && (
              <button
                type="button"
                onClick={handleResetGallery}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FAF5E8] hover:bg-[#F3ECD8] border border-[#D4AF67]/60 text-[#8C6A28] font-cinzel text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer hover:scale-105"
                title="Reset all customized photos back to default"
              >
                <RotateCcw className="w-3 h-3 text-[#C6A15B]" />
                <span>Reset to Curated</span>
              </button>
            )}
          </div>
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
            const isCustomAdded = photo.id.startsWith('g_custom_');
            const isDragging = dragOverPhotoId === photo.id;

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, x: dir.x, y: dir.y }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5 }}
                onClick={() => handleOpenLightbox(photo)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverPhotoId(photo.id);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverPhotoId(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverPhotoId(null);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    handleUpdatePhoto(photo.id, file);
                  }
                }}
                className={`group relative cursor-pointer rounded-2xl overflow-hidden bg-[#FAF5E8] border transition-all duration-500 shadow-sm hover:shadow-md ${
                  isDragging
                    ? 'border-2 border-dashed border-[#C6A15B] ring-4 ring-[#C6A15B]/30 scale-102'
                    : 'border-[#D4AF67]'
                }`}
              >
                {/* Hidden File Input for this card */}
                <input
                  ref={(el) => {
                    cardFileInputRefs.current[photo.id] = el;
                  }}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleUpdatePhoto(photo.id, file);
                    }
                  }}
                  className="hidden"
                />

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

                  {/* Drag and Drop Visual Highlight */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-[#FAF5E8]/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
                      <Upload className="w-8 h-8 text-[#C6A15B] animate-bounce mb-2" />
                      <span className="font-cinzel text-xs uppercase tracking-wider text-[#8C6A28] font-bold">
                        Drop image to replace photo
                      </span>
                    </div>
                  )}

                  {/* Top Action Pills */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    {/* "Change Photo" Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cardFileInputRefs.current[photo.id]?.click();
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#FAF5E8]/95 hover:bg-[#FAF5E8] border border-[#D4AF67] text-[#8C6A28] font-cinzel text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1 shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-xs"
                      title="Upload custom image to replace this photo"
                    >
                      <Camera className="w-3 h-3 text-[#C6A15B]" />
                      <span>Change</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {isCustomAdded && (
                        <button
                          type="button"
                          onClick={(e) => handleDeletePhoto(photo.id, e)}
                          className="w-7 h-7 rounded-full bg-[#FAF5E8]/95 hover:bg-rose-50 border border-rose-300 text-rose-600 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 cursor-pointer backdrop-blur-xs"
                          title="Delete this custom photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      <div
                        className="w-7 h-7 rounded-full bg-[#FAF5E8]/90 backdrop-blur-xs border border-[#D4AF67] flex items-center justify-center text-[#5A5A40] shadow-sm opacity-90 group-hover:opacity-100 transition-opacity"
                        title="Click to expand full screen"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Gold border drawing effect on hover */}
                  <div className="absolute inset-3 rounded-xl border border-[#D4AF67]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

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
            {/* Hidden Input for Lightbox photo replacement */}
            <input
              ref={lightboxFileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && selectedPhoto) {
                  handleUpdatePhoto(selectedPhoto.id, file);
                }
              }}
              className="hidden"
            />

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
                <div className="w-full px-4 py-2.5 bg-[#241E18] border-b border-[#D4AF67]/30 flex flex-wrap items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => lightboxFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF67] hover:bg-[#C6A15B] text-[#1A1A1A] font-cinzel text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Replace Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEditingCaption(!isEditingCaption)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF5E8] font-cinzel text-[11px] tracking-wider uppercase transition-all duration-200 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditingCaption ? 'Cancel' : 'Edit Caption'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={selectedPhoto.src}
                      download={`wedding-photo-${selectedPhoto.id}.jpg`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF5E8] font-cinzel text-[11px] tracking-wider uppercase transition-all duration-200"
                      title="Download image"
                    >
                      <Download className="w-3 h-3" />
                      <span className="hidden sm:inline">Save</span>
                    </a>
                    {selectedPhoto.id.startsWith('g_custom_') && (
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(selectedPhoto.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-cinzel text-[11px] tracking-wider uppercase transition-all duration-200 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
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

                {/* Caption / Caption Editor Footer */}
                <div className="w-full p-4 sm:p-5 bg-gradient-to-t from-[#1A1612] via-[#2A2218] to-[#1A1612] text-center border-t border-[#D4AF67]/20">
                  {isEditingCaption ? (
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          placeholder="Category (e.g. Couple Portrait, Haldi)"
                          className="w-1/3 px-3 py-1.5 text-xs rounded-lg bg-black/40 border border-[#D4AF67]/50 text-[#E6D7B8] font-cinzel uppercase tracking-wider focus:outline-none focus:border-[#D4AF67]"
                        />
                        <input
                          type="text"
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          placeholder="Caption / Memory description"
                          className="w-2/3 px-3 py-1.5 text-sm rounded-lg bg-black/40 border border-[#D4AF67]/50 text-white font-cormorant italic focus:outline-none focus:border-[#D4AF67]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveCaption}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#D4AF67] text-[#1A1A1A] font-cinzel text-xs font-bold tracking-wider uppercase hover:bg-[#C6A15B] transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Caption</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span className="font-cinzel text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF67] font-semibold">
                        {selectedPhoto.category}
                      </span>
                      <p className="font-cormorant italic text-lg sm:text-2xl text-[#FAF5E8] mt-1">
                        "{selectedPhoto.caption}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Photo Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-[#FAF5E8] border border-[#D4AF67] p-6 sm:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#EFE6CE] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-bold">
                  New Wedding Memory
                </span>
                <h3 className="font-cinzel text-2xl text-[#1A1A1A] mt-1">Add Photo to Gallery</h3>
                <p className="font-cormorant italic text-[#5A5A40] text-sm mt-1">
                  Upload an authentic moment from the festivities to feature in the album.
                </p>
              </div>

              <form onSubmit={handleAddNewPhotoSubmit} className="space-y-4">
                {/* Photo Dropzone / Picker */}
                <input
                  ref={addModalFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewPhotoFile(file);
                      const preview = await readFileAsOptimizedDataUrl(file);
                      setNewPhotoPreview(preview);
                    }
                  }}
                  className="hidden"
                />

                <div
                  onClick={() => addModalFileInputRef.current?.click()}
                  className="w-full aspect-[16/9] rounded-2xl border-2 border-dashed border-[#D4AF67] hover:border-[#C6A15B] bg-[#FFFDF7] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors overflow-hidden group"
                >
                  {newPhotoPreview ? (
                    <img
                      src={newPhotoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-[#C6A15B] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-cinzel text-xs uppercase tracking-wider text-[#8C6A28] font-bold">
                        Click to select photo
                      </span>
                      <span className="font-cormorant text-xs text-[#5A5A40] mt-1">
                        PNG, JPG or WebP up to 25MB
                      </span>
                    </>
                  )}
                </div>

                <div>
                  <label className="block font-cinzel text-xs uppercase tracking-wider text-[#5A5A40] mb-1 font-semibold">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newPhotoCategory}
                    onChange={(e) => setNewPhotoCategory(e.target.value)}
                    placeholder="e.g., Sangeet Night, Beach Walk, Haldi"
                    className="w-full px-4 py-2 rounded-xl bg-white border border-[#D4AF67]/60 text-[#1A1A1A] font-cormorant text-base focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block font-cinzel text-xs uppercase tracking-wider text-[#5A5A40] mb-1 font-semibold">
                    Caption / Quote
                  </label>
                  <input
                    type="text"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    placeholder="e.g., Dancing under a canopy of warm lanterns"
                    className="w-full px-4 py-2 rounded-xl bg-white border border-[#D4AF67]/60 text-[#1A1A1A] font-cormorant italic text-base focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-1/2 py-2.5 rounded-full border border-[#D4AF67] text-[#5A5A40] font-cinzel text-xs tracking-wider uppercase font-semibold hover:bg-[#EFE6CE] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF67] to-[#C6A15B] text-white font-cinzel text-xs tracking-wider uppercase font-bold shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-102"
                  >
                    Add to Gallery
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Elegant Toast Notification */}
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
