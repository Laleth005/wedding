import React from 'react';
import { motion } from 'motion/react';
import { TIMELINE_SCHEDULE } from '../data/weddingData';
import { GoldDivider } from './FloralDecorations';
import { Clock, Sun, Music, Heart, Utensils, Camera, Sparkles } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const getTimelineIcon = (icon: string) => {
    switch (icon) {
      case 'welcome':
        return <Sun className="w-4 h-4 text-[#C6A15B]" />;
      case 'entrance':
        return <Music className="w-4 h-4 text-[#C6A15B]" />;
      case 'vows':
        return <Heart className="w-4 h-4 text-[#C6A15B] fill-[#C6A15B]/20" />;
      case 'photos':
        return <Camera className="w-4 h-4 text-[#C6A15B]" />;
      case 'dinner':
        return <Utensils className="w-4 h-4 text-[#C6A15B]" />;
      default:
        return <Clock className="w-4 h-4 text-[#C6A15B]" />;
    }
  };

  return (
    <section id="timeline" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FFFDF7]">
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16 sm:mb-20">
          <span className="font-cinzel text-xs uppercase tracking-[0.4em] text-[#C6A15B] font-bold">
            The Order of Auspicious Moments
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mt-2 mb-3">
            Wedding Day Timeline
          </h2>
          <GoldDivider hasHeart />
          <p className="font-cormorant italic text-base sm:text-lg text-[#5A5A40]">
            Sunday, 15 June 2025 • A day destined to live forever in our memories.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Gold Vertical Line (Animated as scrolls) */}
          <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px] bg-[#D4AF67]/40">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-[#D4AF67] shadow-sm"
            />
          </div>

          {/* Timeline Nodes */}
          <div className="space-y-12 sm:space-y-16">
            {TIMELINE_SCHEDULE.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`relative flex items-center ${
                    isEven ? 'sm:flex-row-reverse' : 'sm:flex-row'
                  } flex-row pl-14 sm:pl-0`}
                >
                  {/* Center Node Indicator */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15, type: 'spring' }}
                    className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#FAF5E8] border-2 border-[#D4AF67] flex items-center justify-center shadow-md z-20 group"
                  >
                    {getTimelineIcon(item.icon)}
                  </motion.div>

                  {/* Content Card (Half Width on Desktop) */}
                  <div className="w-full sm:w-1/2 sm:px-8">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -3 }}
                      className={`p-6 rounded-2xl bg-[#FAF5E8] border border-[#D4AF67] shadow-sm hover:shadow-md transition-all text-left ${
                        isEven ? 'sm:text-left' : 'sm:text-right'
                      }`}
                    >
                      {/* Time Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF7] border border-[#D4AF67] text-[10px] font-cinzel font-bold text-[#C6A15B] tracking-wider mb-2.5">
                        <Clock className="w-3 h-3 text-[#C6A15B]" />
                        {item.time}
                      </span>

                      {/* Title */}
                      <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#1A1A1A]">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-xs sm:text-sm text-[#5A5A40] leading-relaxed mt-2">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
