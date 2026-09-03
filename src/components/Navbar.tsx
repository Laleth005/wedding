import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu, X, Heart, Sparkles, MailOpen } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  onOpenEnvelope?: () => void;
}

const DESKTOP_NAV_ITEMS: NavItem[] = [
  { label: 'Story', href: '#story' },
  { label: 'Events', href: '#events' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Venue', href: '#venue' },
  { label: 'Blessings', href: '#wishes' },
  { label: 'Family', href: '#family' },
];

const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Our Story', href: '#story' },
  { label: 'Countdown', href: '#countdown' },
  { label: 'Events', href: '#events' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Venue', href: '#venue' },
  { label: 'Blessings', href: '#wishes' },
  { label: 'Family', href: '#family' },
  { label: 'RSVP', href: '#rsvp' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEnvelope,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Background change threshold
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scroll progress calculation
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // Active section tracking
      const sections = MOBILE_NAV_ITEMS.map((item) => item.href.substring(1));
      for (const sectionId of sections.reverse()) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId);
    if (target) {
      const navOffset = window.innerWidth < 640 ? 80 : 96;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Floating Royal Capsule Header */}
      <header className="fixed top-3 sm:top-4 md:top-5 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pointer-events-none">
        <div
          className={`pointer-events-auto max-w-7xl mx-auto transition-all duration-300 rounded-full bg-[#FFFDF7]/95 backdrop-blur-xl border border-[#D4AF67]/60 shadow-[0_12px_36px_-6px_rgba(142,103,29,0.16),0_2px_14px_rgba(212,175,103,0.2)] relative ${
            isScrolled
              ? 'py-2 sm:py-2.5 px-3.5 sm:px-5 shadow-[0_16px_40px_-6px_rgba(142,103,29,0.2)]'
              : 'py-2.5 sm:py-3 px-3.5 sm:px-6'
          }`}
        >
          {/* Subtle Integrated Bottom Gold Scroll Progress Line */}
          <div className="absolute -bottom-[1px] left-8 right-8 h-[2px] bg-transparent overflow-hidden rounded-full pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF67] via-[#F5DFB3] to-[#C6A15B] transition-all duration-150 rounded-full"
              style={{ width: `${scrollProgress}%` }}
              aria-hidden="true"
            />
          </div>

          <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
            {/* Left: Royal Monogram & Couple Crest */}
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero');
              }}
              className="flex items-center gap-2 sm:gap-3 group focus:outline-none shrink-0 min-w-0"
            >
              {/* Royal Medallion */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-[#D4AF67] p-0.5 shadow-xs bg-gradient-to-br from-[#FFFDF7] via-[#FAF5E8] to-[#F3E5C8] flex items-center justify-center group-hover:scale-105 group-hover:border-[#C6A15B] transition-all duration-200 shrink-0">
                <div className="w-full h-full rounded-full border border-dashed border-[#C6A15B]/60 flex items-center justify-center">
                  <span className="font-cinzel text-[11px] sm:text-xs md:text-sm font-bold text-[#A68037] tracking-wider">
                    BK
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center min-w-0 truncate">
                <span className="font-cinzel text-xs sm:text-sm md:text-[14px] xl:text-[15px] tracking-[0.12em] sm:tracking-[0.16em] uppercase font-bold text-[#1A1A1A] group-hover:text-[#C6A15B] transition-colors leading-tight truncate flex items-center gap-1 sm:gap-1.5">
                  <span className="truncate">Balachandran</span>
                  <span className="text-[#C6A15B] font-serif font-normal shrink-0">&bull;</span>
                  <span className="truncate">Karunya</span>
                </span>
                <span className="font-sans text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.22em] text-[#C6A15B] font-semibold leading-tight mt-0.5 whitespace-nowrap hidden md:block truncate">
                  October 15, 2026 &bull; Chennai
                </span>
              </div>
            </a>

            {/* Center: Desktop Navigation Links (Shown on XL screens where ample space is guaranteed) */}
            <nav className="hidden xl:flex items-center gap-1 2xl:gap-2 justify-center flex-1 mx-2">
              {DESKTOP_NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavClick(item.href)}
                    className={`relative py-1 px-2.5 font-cinzel text-xs tracking-[0.14em] uppercase font-semibold transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive ? 'text-[#1A1A1A]' : 'text-[#5A5A40] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute -bottom-1 left-1.5 right-1.5 h-[2px] bg-gradient-to-r from-[#D4AF67] via-[#F5DFB3] to-[#C6A15B] rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Unified Action Controls (Never overlaps, shrink-0, robust responsive layout) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Royal Keepsake Envelope / Invite Pill (shown when screen >= sm) */}
              {onOpenEnvelope && (
                <button
                  type="button"
                  onClick={onOpenEnvelope}
                  className="hidden sm:inline-flex items-center gap-1.5 h-8 sm:h-8.5 px-3 rounded-full bg-[#FAF5E8] hover:bg-[#F3E5C8] text-[#1A1A1A] border border-[#D4AF67] text-[10px] sm:text-[10.5px] tracking-[0.14em] uppercase font-cinzel font-semibold transition-all duration-200 shadow-xs hover:scale-105 cursor-pointer shrink-0 whitespace-nowrap"
                  title="Open Royal Invitation Envelope"
                >
                  <MailOpen className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span className="hidden md:inline">Invite</span>
                </button>
              )}

              {/* Dedicated RSVP Button - Perfectly sized, never clipped, never overlaps */}
              <button
                type="button"
                onClick={() => handleNavClick('#rsvp')}
                className="h-8 sm:h-8.5 px-3.5 sm:px-4.5 rounded-full bg-gradient-to-r from-[#D4AF67] via-[#C6A15B] to-[#B5914A] hover:from-[#C6A15B] hover:to-[#A37E36] text-white text-[10px] sm:text-[10.5px] tracking-[0.18em] uppercase font-cinzel font-bold shadow-xs hover:shadow transition-all duration-200 flex items-center gap-1.5 cursor-pointer hover:scale-105 shrink-0 whitespace-nowrap"
              >
                <span>RSVP</span>
                <Heart className="w-3 h-3 fill-current text-white/95 shrink-0" />
              </button>

              {/* Menu Toggle for mobile & tablet (screens < xl) */}
              <button
                type="button"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="xl:hidden w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border border-[#D4AF67] bg-[#FAF5E8] text-[#5A5A40] hover:text-[#1A1A1A] flex items-center justify-center transition-colors focus:outline-none cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
              >
                {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-[#5A5A40]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Floating Dropdown Card */}
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="pointer-events-auto max-w-md mx-auto mt-2.5 px-4.5 py-4.5 rounded-2xl bg-[#FFFDF7]/98 backdrop-blur-2xl border border-[#D4AF67]/50 shadow-2xl"
          >
            <div className="flex flex-col gap-1.5">
              {MOBILE_NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavClick(item.href)}
                    className={`text-left px-4 py-2.5 rounded-xl font-cinzel text-xs sm:text-[13px] tracking-wider uppercase transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-[#FAF5E8] text-[#1A1A1A] font-bold border border-[#D4AF67]/80'
                        : 'text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#FAF5E8]/60'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <Sparkles className="w-4 h-4 text-[#C6A15B]" />}
                  </button>
                );
              })}

              {onOpenEnvelope && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileOpen(false);
                    onOpenEnvelope();
                  }}
                  className="mt-1 text-left px-4 py-2.5 rounded-xl font-cinzel text-xs sm:text-[13px] tracking-wider uppercase transition-colors flex items-center justify-between bg-[#FAF5E8] text-[#1A1A1A] border border-[#D4AF67]"
                >
                  <span>Open Royal Envelope</span>
                  <MailOpen className="w-4 h-4 text-[#C6A15B]" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
};
