import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, BellRing, CalendarCheck } from 'lucide-react';
import { COUPLE_DATA } from '../data/weddingData';
import { GoldDivider } from './FloralDecorations';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      let targetDate = new Date(COUPLE_DATA.weddingDate).getTime();
      const now = new Date().getTime();
      let difference = targetDate - now;

      // If static date has elapsed relative to runtime year, project to the upcoming June 15
      if (difference <= 0) {
        const nextWedding = new Date();
        nextWedding.setMonth(5); // June
        nextWedding.setDate(15);
        nextWedding.setHours(17, 30, 0, 0);
        if (nextWedding.getTime() <= now) {
          nextWedding.setFullYear(nextWedding.getFullYear() + 1);
        }
        difference = nextWedding.getTime() - now;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  const handleAddToCalendar = () => {
    // Generate Google Calendar Link for June 15, 2025 at 5:30 PM (17:30 IST is 12:00 UTC)
    const title = encodeURIComponent('Balachandran & Karunya Wedding');
    const details = encodeURIComponent('Together with their families, invite you to celebrate their royal wedding ceremony & reception at Ocean Breeze Beach Resort, ECR, Chennai.');
    const location = encodeURIComponent('Ocean Breeze Beach Resort, East Coast Road, Chennai, Tamil Nadu');
    const dates = '20250615T120000Z/20250615T173000Z';
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="countdown" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#FFFDF7] via-[#FAF5E8] to-[#FFFDF7]">
      {/* Background radial gold aura */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#D4AF67]/15 via-[#F3E5C8]/30 to-[#D4AF67]/15 rounded-full blur-3xl opacity-70" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Subtle sparkle floating around */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#C6A15B] animate-spin-slow" />
          <span className="font-cinzel text-xs uppercase tracking-[0.4em] text-[#C6A15B] font-bold">
            The Golden Hour Awaits
          </span>
          <Sparkles className="w-4 h-4 text-[#C6A15B] animate-spin-slow" />
        </div>

        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mt-1 mb-3">
          Counting Down to Forever
        </h2>

        <GoldDivider hasHeart />

        <p className="font-cormorant italic text-base sm:text-lg text-[#5A5A40] max-w-xl mx-auto mb-10 sm:mb-12">
          Every second brings us closer to vows beneath the coastal sunset. Join us as we count down to our sacred beginning.
        </p>

        {/* 4 Natural Tones Cream Cards with Golden Borders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {timeUnits.map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative rounded-2xl p-5 sm:p-7 bg-[#FAF5E8] border border-[#D4AF67] text-center shadow-md group"
            >
              {/* Corner gold ticks */}
              <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#D4AF67]" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#D4AF67]" />
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#D4AF67]" />
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#D4AF67]" />

              {/* Number display */}
              <div className="font-cinzel font-bold text-4xl sm:text-5xl md:text-6xl text-[#1A1A1A] tracking-tight group-hover:scale-105 transition-transform duration-300">
                {String(unit.value).padStart(2, '0')}
              </div>

              {/* Label */}
              <div className="font-cinzel text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold mt-2">
                {unit.label}
              </div>

              {/* Ambient shimmer */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Date Stamp & Add to Calendar CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="px-6 py-2.5 rounded-full bg-[#FAF5E8] border border-[#D4AF67] text-[10px] font-cinzel text-[#5A5A40] tracking-[0.25em] uppercase">
            Sunday, 15 June 2025 • Ocean Breeze Resort, Chennai
          </div>

          <button
            type="button"
            onClick={handleAddToCalendar}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#D4AF67] text-white text-[10px] font-cinzel font-bold tracking-[0.3em] uppercase shadow-md hover:bg-[#C6A15B] transition-all cursor-pointer group"
          >
            <CalendarCheck className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" />
            <span>Add to Calendar</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
