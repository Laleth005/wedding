import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { INITIAL_BLESSINGS } from '../data/weddingData';
import { GoldDivider } from './FloralDecorations';
import { Quote, Send, Heart, Sparkles, MessageCircleHeart } from 'lucide-react';
import { BlessingWish } from '../types';

export const WishesSection: React.FC = () => {
  const [wishes, setWishes] = useState<BlessingWish[]>(INITIAL_BLESSINGS);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: BlessingWish = {
      id: `wish-${Date.now()}`,
      guestName: name.trim(),
      relation: relation.trim() || 'Well Wisher',
      message: message.trim(),
      date: 'Just now',
    };

    setWishes([newWish, ...wishes]);
    setName('');
    setRelation('');
    setMessage('');
    setIsSent(true);

    // Celebrate with joyous gold confetti burst
    confetti({
      particleCount: 75,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#D4AF67', '#F5DFB3', '#C6A15B', '#FAF5E8'],
    });

    setTimeout(() => setIsSent(false), 4000);
  };

  return (
    <section id="wishes" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FFFDF7] scroll-mt-24 sm:scroll-mt-28">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="font-cinzel text-xs uppercase tracking-[0.4em] text-[#C6A15B] font-bold">
            Blessings & Good Wishes
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mt-2 mb-3">
            Send Your Blessings
          </h2>
          <GoldDivider hasHeart />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#5A5A40]">
            Leave a note of love, auspicious wishes, or blessings for Balachandran & Karunya as they start their new chapter.
          </p>
        </div>

        {/* 2 Column Layout: Submit Form & Wishes Cards Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-[#FAF5E8] border border-[#D4AF67] shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#FFFDF7] border border-[#D4AF67] flex items-center justify-center text-[#C6A15B]">
                <MessageCircleHeart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-lg text-[#1A1A1A]">
                  Share a Blessing
                </h3>
                <span className="text-xs text-[#5A5A40] font-sans">
                  Your words will be cherished forever
                </span>
              </div>
            </div>

            <form onSubmit={handleSendWish} className="space-y-4">
              <div>
                <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ananya & Rahul"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF7] border border-[#D4AF67] text-xs sm:text-sm text-[#1A1A1A] placeholder-[#5A5A40]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF67]"
                />
              </div>

              <div>
                <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold mb-1">
                  Relation / Friendship (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Groom’s School Friend / Family"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF7] border border-[#D4AF67] text-xs sm:text-sm text-[#1A1A1A] placeholder-[#5A5A40]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF67]"
                />
              </div>

              <div>
                <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#1A1A1A] font-semibold mb-1">
                  Your Message or Blessing *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="May your home always be filled with joy and laughter..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF7] border border-[#D4AF67] text-xs sm:text-sm text-[#1A1A1A] placeholder-[#5A5A40]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF67]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full gold-gradient-btn text-[#1A1A1A] font-cinzel font-bold text-xs tracking-widest uppercase shadow-sm cursor-pointer flex items-center justify-center gap-2 border border-[#D4AF67]"
              >
                <span>Send Blessing</span>
                <Send className="w-3.5 h-3.5 text-[#C6A15B]" />
              </button>

              {isSent && (
                <p className="text-center font-cinzel text-xs text-[#C6A15B] font-semibold animate-fade-in flex items-center justify-center gap-1.5 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Blessing added to the wedding guestbook!</span>
                </p>
              )}
            </form>
          </motion.div>

          {/* Right Column: Display Wishes Cards Stream with Golden Quotation Marks (7 cols) */}
          <div className="lg:col-span-7 space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {wishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="relative rounded-2xl p-5 sm:p-6 bg-[#FAF5E8] border border-[#D4AF67] shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {/* Golden Quotation Marks Motif */}
                <div className="absolute top-4 right-4 text-[#D4AF67]/40 group-hover:text-[#D4AF67]/70 transition-colors">
                  <Quote className="w-8 h-8" />
                </div>

                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E6D7B8] border border-[#D4AF67] flex items-center justify-center text-xs font-cinzel font-bold text-[#1A1A1A]">
                    {wish.guestName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-cinzel font-bold text-sm text-[#1A1A1A]">
                      {wish.guestName}
                    </h4>
                    <span className="text-[11px] font-sans text-[#C6A15B] block">
                      {wish.relation} • {wish.date}
                    </span>
                  </div>
                </div>

                <p className="font-cormorant italic text-base sm:text-lg text-[#5A5A40] leading-relaxed relative z-10">
                  "{wish.message}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
