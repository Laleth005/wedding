import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoldDivider, RoyalMonogram } from './FloralDecorations';
import { Sparkles, CheckCircle2, Heart, User, Phone, Mail, Users, Utensils, MessageSquare, Download, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RSVPFormData } from '../types';

export const RSVPSection: React.FC = () => {
  const [formData, setFormData] = useState<RSVPFormData>({
    fullName: '',
    phone: '',
    email: '',
    attending: 'yes',
    guestCount: 2,
    dietPreference: 'vegetarian',
    eventsAttending: ['ceremony', 'reception'],
    personalMessage: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);

      // Celebrate with golden & rose confetti burst
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF67', '#F3E5C8', '#FAF5E8', '#C6A15B', '#E8C5C8'],
      });
    }, 600);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      attending: 'yes',
      guestCount: 1,
      dietPreference: 'vegetarian',
      eventsAttending: ['ceremony', 'reception'],
      personalMessage: '',
    });
  };

  return (
    <section id="rsvp" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FFFDF7]">
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-cinzel text-xs uppercase tracking-[0.4em] text-[#C6A15B] font-bold">
            Honour Us With Your Presence
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mt-2 mb-3">
            Wedding RSVP
          </h2>
          <GoldDivider hasHeart />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#5A5A40]">
            Kindly respond by 25 May 2025 so we may welcome you with warm coastal hospitality.
          </p>
        </div>

        {/* RSVP Form Container */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-[#FAF5E8] border border-[#D4AF67] shadow-sm">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="rsvp-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6 sm:space-y-8"
              >
                {/* Attending Toggle */}
                <div>
                  <label className="block font-cinzel text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-bold mb-3 text-center">
                    Will you be attending the celebrations? *
                  </label>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: 'yes' })}
                      className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        formData.attending === 'yes'
                          ? 'bg-[#FFFDF7] border-[#D4AF67] shadow-sm text-[#1A1A1A]'
                          : 'bg-[#FAF5E8]/60 border-[#D4AF67]/30 text-[#5A5A40] hover:bg-[#FFFDF7]'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${formData.attending === 'yes' ? 'fill-[#C6A15B] text-[#D4AF67]' : 'text-gray-400'}`} />
                      <span className="font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Joyfully Accept
                      </span>
                      <span className="text-[11px] font-cormorant italic text-[#C6A15B]">
                        Can’t wait to celebrate!
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: 'no' })}
                      className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        formData.attending === 'no'
                          ? 'bg-[#FFFDF7] border-[#D4AF67] shadow-sm text-[#1A1A1A]'
                          : 'bg-[#FAF5E8]/60 border-[#D4AF67]/30 text-[#5A5A40] hover:bg-[#FFFDF7]'
                      }`}
                    >
                      <span className="text-base text-gray-400">🕊️</span>
                      <span className="font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Regretfully Decline
                      </span>
                      <span className="text-[11px] font-cormorant italic text-[#5A5A40]">
                        Celebrating from afar
                      </span>
                    </button>
                  </div>
                </div>

                {/* Name & Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold mb-1.5">
                      Guest Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g., Dr. Arvind Raman"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 pl-10 rounded-xl bg-[#FFFDF7] border border-[#D4AF67] text-sm text-[#1A1A1A] placeholder-[#5A5A40]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF67]"
                      />
                      <User className="w-4 h-4 text-[#C6A15B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 pl-10 rounded-xl bg-[#FFFDF7] border border-[#D4AF67] text-sm text-[#1A1A1A] placeholder-[#5A5A40]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF67]"
                      />
                      <Phone className="w-4 h-4 text-[#C6A15B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Email & Guests Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 pl-10 rounded-xl bg-[#FFFDF7] border border-[#D4AF67] text-sm text-[#1A1A1A] placeholder-[#5A5A40]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF67]"
                      />
                      <Mail className="w-4 h-4 text-[#C6A15B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold mb-1.5">
                      Number of Guests Attending
                    </label>
                    <div className="relative">
                      <select
                        value={formData.guestCount}
                        onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                        disabled={formData.attending === 'no'}
                        className="w-full px-4 py-3 pl-10 rounded-xl bg-[#FFFDF7] border border-[#D4AF67] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#D4AF67]"
                      >
                        <option value={1}>1 Guest (Just Myself)</option>
                        <option value={2}>2 Guests (Couple)</option>
                        <option value={3}>3 Guests (Family)</option>
                        <option value={4}>4 Guests (Family)</option>
                        <option value={5}>5+ Guests</option>
                      </select>
                      <Users className="w-4 h-4 text-[#C6A15B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Food Preference */}
                {formData.attending === 'yes' && (
                  <div>
                    <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold mb-2">
                      Culinary & Dietary Preference
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'vegetarian', label: 'Traditional South Indian Veg (Elai Saapadu)' },
                        { id: 'non-veg', label: 'Coastal Seafood & Biryani Feast' },
                        { id: 'jain', label: 'Strict Jain Pure Vegetarian' },
                      ].map((diet) => (
                        <button
                          key={diet.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, dietPreference: diet.id as any })}
                          className={`p-3 rounded-xl border text-xs font-sans text-left transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                            formData.dietPreference === diet.id
                              ? 'bg-[#FFFDF7] border-[#D4AF67] text-[#1A1A1A] font-medium shadow-sm'
                              : 'bg-[#FAF5E8]/60 border-[#D4AF67]/30 text-[#5A5A40] hover:bg-[#FFFDF7]'
                          }`}
                        >
                          <Utensils className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                          <span>{diet.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message for the Couple */}
                <div>
                  <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold mb-1.5">
                    Warm Message or Blessing for Balachandran & Karunya
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      placeholder="Share a sweet memory, blessing, or song request..."
                      value={formData.personalMessage}
                      onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-[#FFFDF7] border border-[#D4AF67] text-sm text-[#1A1A1A] placeholder-[#5A5A40]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF67]"
                    />
                    <MessageSquare className="w-4 h-4 text-[#C6A15B] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto min-w-[280px] px-8 py-3.5 rounded-full gold-gradient-btn text-[#1A1A1A] font-cinzel font-bold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-sm hover:shadow-md cursor-pointer inline-flex items-center justify-center gap-2 border border-[#D4AF67]"
                  >
                    <span>{isLoading ? 'Confirming...' : 'Confirm Attendance'}</span>
                    <Sparkles className="w-4 h-4 text-[#C6A15B]" />
                  </button>
                  <p className="font-cormorant italic text-xs text-[#5A5A40] mt-3">
                    A confirmation SMS & invitation pass will be sent to your phone.
                  </p>
                </div>
              </motion.form>
            ) : (
              /* Success Confirmation Card */
              <motion.div
                key="rsvp-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-8 px-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#FAF5E8] border-2 border-[#D4AF67] flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-[#C6A15B]" />
                </div>

                <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-bold">
                  RSVP Received with Gratitude
                </span>

                <h3 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#1A1A1A] mt-2 mb-2">
                  Thank You, {formData.fullName}!
                </h3>

                <p className="font-cormorant italic text-lg text-[#5A5A40] max-w-md mx-auto mb-8">
                  {formData.attending === 'yes'
                    ? 'Your attendance has been recorded. Balachandran, Karunya, and their families eagerly await celebrating with you!'
                    : 'Thank you for letting us know. You will be dearly missed, and your warm blessings remain in our hearts.'}
                </p>

                {/* Digital Guest Pass Card */}
                {formData.attending === 'yes' && (
                  <div className="max-w-md mx-auto rounded-2xl p-5 bg-[#FFFDF7] border border-[#D4AF67] shadow-sm text-left mb-8 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-[#D4AF67]/30 pb-3 mb-3">
                      <div>
                        <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#C6A15B] font-bold">
                          Digital Royal Pass
                        </span>
                        <h4 className="font-cinzel font-bold text-sm text-[#1A1A1A]">
                          Balachandran & Karunya Wedding
                        </h4>
                      </div>
                      <RoyalMonogram size="sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-[#1A1A1A]">
                      <div>
                        <span className="text-[#C6A15B] block text-[10px] uppercase font-cinzel font-semibold">Guest</span>
                        <span className="font-semibold">{formData.fullName}</span>
                      </div>
                      <div>
                        <span className="text-[#C6A15B] block text-[10px] uppercase font-cinzel font-semibold">Party Size</span>
                        <span className="font-semibold">{formData.guestCount} Guest(s)</span>
                      </div>
                      <div>
                        <span className="text-[#C6A15B] block text-[10px] uppercase font-cinzel font-semibold">Date & Time</span>
                        <span>15 June 2025 • 5:30 PM</span>
                      </div>
                      <div>
                        <span className="text-[#C6A15B] block text-[10px] uppercase font-cinzel font-semibold">Venue</span>
                        <span>Ocean Breeze, ECR</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-full border border-[#D4AF67] text-xs font-cinzel tracking-wider uppercase text-[#1A1A1A] hover:bg-[#FAF5E8] transition-colors cursor-pointer"
                >
                  Submit Another Response
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
