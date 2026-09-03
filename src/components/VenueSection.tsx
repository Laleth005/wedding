import React from 'react';
import { motion } from 'motion/react';
import { COUPLE_DATA } from '../data/weddingData';
import { GoldDivider } from './FloralDecorations';
import { MapPin, Navigation, Calendar, Clock, Car, Compass, PhoneCall } from 'lucide-react';

export const VenueSection: React.FC = () => {
  const handleGetDirections = () => {
    window.open(COUPLE_DATA.googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="venue" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FFFDF7] scroll-mt-24 sm:scroll-mt-28">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="font-cinzel text-xs uppercase tracking-[0.4em] text-[#C6A15B] font-bold">
            Where Forever Begins
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mt-2 mb-3">
            The Wedding Venue
          </h2>
          <GoldDivider hasHeart />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#5A5A40]">
            Set against the golden sands and soothing waves along Chennai’s scenic East Coast Road.
          </p>
        </div>

        {/* Venue Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Venue Details & Badges (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-[#FAF5E8] border border-[#D4AF67] shadow-sm relative"
          >
            {/* Animated Gold Map Pin Badge */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="relative w-12 h-12 rounded-2xl bg-[#E6D7B8]/60 border border-[#D4AF67] flex items-center justify-center shadow-sm">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <MapPin className="w-6 h-6 text-[#C6A15B] fill-[#D4AF67]/30" />
                </motion.div>
                {/* Ping ring beneath pin */}
                <div className="absolute -bottom-1 w-6 h-1 bg-[#D4AF67]/50 rounded-full blur-[1px] animate-pulse" />
              </div>

              <div>
                <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-bold">
                  Destination Coastal Venue
                </span>
                <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-[#1A1A1A]">
                  {COUPLE_DATA.venueName}
                </h3>
              </div>
            </div>

            {/* Address */}
            <p className="font-sans text-sm text-[#5A5A40] leading-relaxed mb-6">
              {COUPLE_DATA.venueLocation}
            </p>

            {/* Key Information Badges */}
            <div className="space-y-3.5 pt-4 border-t border-[#D4AF67]/30 text-xs sm:text-sm text-[#5A5A40]">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <span className="font-cinzel font-semibold text-[#1A1A1A]">{COUPLE_DATA.weddingDisplayDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <span>{COUPLE_DATA.weddingTime}</span>
              </div>
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <span>Complimentary Valet Parking for all guests</span>
              </div>
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <span>35 mins from Chennai International Airport via ECR</span>
              </div>
            </div>

            {/* Get Directions Button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handleGetDirections}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full gold-gradient-btn text-[#1A1A1A] font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase shadow-sm cursor-pointer group"
              >
                <Navigation className="w-4 h-4 text-[#C6A15B] group-hover:rotate-12 transition-transform" />
                <span>Get Directions via Google Maps</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Google Maps Embed Card & Seaside Visual (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 rounded-3xl overflow-hidden bg-[#FAF5E8] border border-[#D4AF67] shadow-sm p-2 sm:p-3 relative"
          >
            {/* Map Frame */}
            <div className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden bg-[#E6D7B8]/40">
              <iframe
                title="Ocean Breeze Beach Resort Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124434.9392233634!2d80.17066041042784!3d12.933979430397554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525b42d7650893%3A0xb71a8fb180a0660e!2sEast%20Coast%20Rd%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale-[20%] contrast-[105%]"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Gold floating address card over map */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs p-4 rounded-xl bg-[#FAF5E8]/95 backdrop-blur-md border border-[#D4AF67] shadow-sm">
                <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#C6A15B] font-bold block">
                  Beachfront Landmark
                </span>
                <p className="font-sans text-xs text-[#1A1A1A] font-medium mt-0.5">
                  Scenic ECR coastal stretch near Kovalam Beach, Chennai
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
