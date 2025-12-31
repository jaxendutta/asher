'use client';

// ============================================================================
// Hero Component
// ============================================================================

import Link from 'next/link';
import { SITECONFIG } from '@/data/siteConfig';
import { fleur_de_leah } from '@/lib/fonts';
import { HiArrowRight } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-16 lg:px-24 text-center space-y-4 bg-gradient-to-r from-[#F4EBD0]/70 to-[#B8D4BE]/60 rounded-3xl p-8 border-2 border-[#B8D4BE]">
      {/* Main heading with animation */}
      <div className="animate-fadeIn text-[#1A3A2A] flex flex-col gap-2">
        <span className="text-lg sm:text-xl md:text-2xl">WELCOME TO</span>
        <span className={`${fleur_de_leah.className} block text-[#2D5F3F] my-2 text-6xl sm:text-7xl md:text-8xl`}>{SITECONFIG.siteName}</span>
      </div>

      {/* Subtitle */}
      <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <p className="text-xs sm:text-sm md:text-base text-[#2C3E2C] max-w-3xl mx-auto leading-relaxed uppercase">
          {SITECONFIG.role} at {SITECONFIG.org}
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap justify-center gap-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
        <Link href="/research">
          <Button variant="primary" size="sm" className="flex flex-row gap-1.5">
            Explore My Research
            <HiArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <Link href="/about">
          <Button variant="outline" size="sm" className="flex flex-row gap-1.5">
            About Me
            <HiArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
