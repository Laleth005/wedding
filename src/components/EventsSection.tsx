import React from 'react';
import { motion } from 'motion/react';
import { WEDDING_EVENTS } from '../data/weddingData';
import { GoldDivider } from './FloralDecorations';
import { Calendar, Clock, MapPin, Sparkles, Heart, Wine, Flower2, Gem } from 'lucide-react';
import { WeddingEvent } from '../types';

export const EventsSection: React.FC = () => {
  const getEventIcon = (iconName: WeddingEvent['iconName']) => {
    switch (iconName) {
      case 'ring':
        return <Gem className="w-5 h-5 text-[#C6A15B]" />;
      case 'flower':
        return <Flower2 className="w-5 h-5 text-[#C6A15B]" />;
      case 'heart':
        return <Heart className="w-5 h-5 fill-[#C6A15B]/30 text-[#C6A15B]" />;
      case 'glass':
        return <Wine className="w-5 h-5 text-[#C6A15B]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#C6A15B]" />;
    }
  };

  // 4 directional animation variants as requested:
  // 1st card from left
  // 2nd card from right
  // 3rd card from bottom
  // 4th card with zoom/fade
  const getAnimationProps = (direction: WeddingEvent['entranceDirection'], index: number) => {
    switch (direction) {
      case 'left':
        return {
          initial: { opacity: 0, x: -60 },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
        };
      case 'right':
        return {
          initial: { opacity: 0, x: 60 },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
        };
      case 'bottom':
        return {
          initial: { opacity: 0, y: 60 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.85 },
          whileInView: { opacity: 1, scale: 1 },
          transition: { duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
        };
    }
  };

  return (
    <section id="events" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FFFDF7]">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="font-cinzel text-xs uppercase tracking-[0.4em] text-[#C6A15B] font-bold">
            Celebrations of Love
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mt-2 mb-3">
            Wedding Events
          </h2>
          <GoldDivider hasHeart />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#5A5A40]">
            Four beautiful occasions, each filled with laughter, sacred blessings, and memorable coastal moments.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {WEDDING_EVENTS.map((event, idx) => {
            const animProps = getAnimationProps(event.entranceDirection, idx);

            return (
              <motion.div
                key={event.id}
                {...animProps}
                viewport={{ once: true, margin: '-40px' }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.3, ease: 'easeOut' },
                }}
                className="group relative rounded-3xl p-6 sm:p-8 bg-[#FAF5E8] border border-[#D4AF67] shadow-sm hover:shadow-md transition-all duration-500"
              >
                {/* Thin Gold Corner Borders */}
                <div className="absolute top-3.5 left-3.5 w-3 h-3 border-t-2 border-l-2 border-[#D4AF67] group-hover:w-5 group-hover:h-5 transition-all duration-300" />
                <div className="absolute top-3.5 right-3.5 w-3 h-3 border-t-2 border-r-2 border-[#D4AF67] group-hover:w-5 group-hover:h-5 transition-all duration-300" />
                <div className="absolute bottom-3.5 left-3.5 w-3 h-3 border-b-2 border-l-2 border-[#D4AF67] group-hover:w-5 group-hover:h-5 transition-all duration-300" />
                <div className="absolute bottom-3.5 right-3.5 w-3 h-3 border-b-2 border-r-2 border-[#D4AF67] group-hover:w-5 group-hover:h-5 transition-all duration-300" />

                {/* Top Icon Badge & Tag */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6D7B8]/60 border border-[#D4AF67] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {getEventIcon(event.iconName)}
                  </div>

                  <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A15B] px-3.5 py-1 rounded-full bg-[#FFFDF7] border border-[#D4AF67]">
                    Event 0{idx + 1}
                  </span>
                </div>

                {/* Event Name & Subtitle */}
                <h3 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#1A1A1A] group-hover:text-[#C6A15B] transition-colors">
                  {event.name}
                </h3>
                <p className="font-cormorant italic text-base text-[#C6A15B] mt-1 mb-4">
                  {event.subTitle}
                </p>

                <p className="font-sans text-xs sm:text-sm text-[#5A5A40] leading-relaxed mb-6">
                  {event.description}
                </p>

                {/* Event Details Key-Values */}
                <div className="space-y-2.5 pt-4 border-t border-[#D4AF67]/30 text-xs sm:text-sm text-[#5A5A40]">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#C6A15B] shrink-0" />
                    <span className="font-cinzel font-semibold text-[#1A1A1A]">{event.date}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#C6A15B] shrink-0" />
                    <span>{event.time}</span>
                  </div>

                  {/* Venue */}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>

                  {/* Dress Code */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#C6A15B] font-bold shrink-0">
                      Attire:
                    </span>
                    <span className="font-cormorant italic text-sm text-[#5A5A40]">
                      {event.dressCode}
                    </span>
                  </div>
                </div>

                {/* Subtle Inner Shimmer on Hover */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-[#D4AF67]/10 via-white/10 to-transparent" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
