import React, { useState } from 'react';
import { EnvelopeEntrance } from './components/EnvelopeEntrance';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { OurStorySection } from './components/OurStorySection';
import { CountdownSection } from './components/CountdownSection';
import { EventsSection } from './components/EventsSection';
import { TimelineSection } from './components/TimelineSection';
import { GallerySection } from './components/GallerySection';
import { QuoteSection } from './components/QuoteSection';
import { VenueSection } from './components/VenueSection';
import { RSVPSection } from './components/RSVPSection';
import { WishesSection } from './components/WishesSection';
import { FamilySection } from './components/FamilySection';
import { Footer } from './components/Footer';
import { ParticleCanvas } from './components/ParticleCanvas';
import { CursorGlow } from './components/CursorGlow';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  const [hasOpenedInvitation, setHasOpenedInvitation] = useState(true);
  const [showEnvelopeModal, setShowEnvelopeModal] = useState(false);

  const handleOpenComplete = () => {
    setHasOpenedInvitation(true);
    setShowEnvelopeModal(false);
  };

  const handleCloseEnvelope = () => {
    setShowEnvelopeModal(false);
  };

  const handleReopenInvitation = () => {
    setShowEnvelopeModal(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#5A5A40] relative selection:bg-[#E6D7B8] selection:text-[#1A1A1A] overflow-x-hidden font-serif">
      {/* Natural Tones Outer Architectural Double Frame (with bottom line removed) */}
      <div className="fixed inset-0 pointer-events-none border-t-[8px] border-x-[8px] sm:border-t-[12px] sm:border-x-[12px] border-b-0 border-[#FAF5E8] m-1 sm:m-3 z-30 transition-all duration-500" />
      <div className="fixed inset-0 pointer-events-none border-t border-x border-b-0 border-[#D4AF67] m-3 sm:m-6 z-30 transition-all duration-500 opacity-80" />

      {/* Natural Tones Botanical Watermark Top-Right Accent */}
      <div className="fixed top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 opacity-5 pointer-events-none z-0">
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="#D4AF67">
          <path d="M100,0 C120,40 180,40 200,100 C160,120 160,180 100,200 C80,160 20,160 0,100 C40,80 40,20 100,0" />
        </svg>
      </div>

      {/* Luxury Envelope Opening Animation (On-demand modal) */}
      {showEnvelopeModal && (
        <EnvelopeEntrance onOpenComplete={handleOpenComplete} onClose={handleCloseEnvelope} />
      )}

      {/* Floating Gold Particles & Falling Rose Petals Canvas */}
      <ParticleCanvas enablePetals={true} enableGoldDust={true} />

      {/* Desktop Cursor-Following Soft Golden Light */}
      <CursorGlow />

      {/* Auspicious Wedding Ambient Music Controller */}
      <MusicPlayer autoPlayRequested={true} />

      {/* Floating Button to open Royal Keepsake Envelope anytime */}
      <button
        type="button"
        onClick={() => setShowEnvelopeModal(true)}
        className="fixed bottom-6 left-6 z-40 bg-[#FAF5E8]/95 hover:bg-[#FAF5E8] backdrop-blur-md border border-[#D4AF67] text-[#1A1A1A] px-4 py-2.5 rounded-full shadow-[0_4px_16px_rgba(212,175,103,0.25)] text-[10px] sm:text-[11px] font-cinzel font-semibold tracking-wider flex items-center gap-2.5 transition-all duration-300 hover:scale-105 group cursor-pointer"
        title="View Royal Invitation Envelope"
      >
        <span className="w-2 h-2 rounded-full bg-[#D4AF67] animate-ping" />
        <span>Royal Wax Envelope</span>
      </button>

      {/* Main Wedding Website (immediately rendered and visible) */}
      <div className="relative z-10 w-full">
        {/* Sticky Translucent Glass Navbar */}
        <Navbar onOpenEnvelope={() => setShowEnvelopeModal(true)} />

        {/* 1. Cinematic Hero Section */}
        <main>
          <HeroSection />

          {/* 2. Couple Profiles & Our Story */}
          <OurStorySection />

          {/* 3. Countdown to Forever */}
          <CountdownSection />

          {/* 4. Wedding Celebrations & Events */}
          <EventsSection />

          {/* 5. Wedding Day Timeline */}
          <TimelineSection />

          {/* 6. Photo Gallery & Lightbox */}
          <GallerySection />

          {/* 7. Romantic Quote with Shimmer */}
          <QuoteSection />

          {/* 8. Venue & Google Maps Directions */}
          <VenueSection />

          {/* 9. Interactive RSVP Form */}
          <RSVPSection />

          {/* 10. Guest Blessings & Wishes Board */}
          <WishesSection />

          {/* 11. Family Portrait & Blessings */}
          <FamilySection />
        </main>

        {/* Footer */}
        <Footer onReopenInvitation={handleReopenInvitation} />
      </div>
    </div>
  );
}
