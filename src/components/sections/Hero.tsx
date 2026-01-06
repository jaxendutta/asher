'use client';

// ============================================================================
// Hero Component
// ============================================================================

import Link from 'next/link';
import { SITECONFIG } from '@/data/siteConfig';
import { jacquard_24, jersey_10, jersey_25 } from '@/lib/fonts';
import { HiArrowRight } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <div className={`${jersey_10.className} z-10 max-w-5xl mx-auto px-4 sm:px-16 lg:px-24 text-center bg-gradient-to-r from-[#F4EBD0]/70 to-[#B8D4BE]/60 rounded-3xl p-8 border-2 border-[#B8D4BE] flex flex-col gap-4`}>
      {/* Main heading with animation */}
      <div className={`animate-fadeIn text-[#1A3A2A] flex flex-col animate-fadeIn ${jersey_10.className}`} style={{ animationDelay: '0.2s' }}>
        <span className="text-lg sm:text-xl md:text-2xl">WELCOME TO</span>
        <span className={`block text-[#2D5F3F] text-6xl sm:text-7xl md:text-8xl tracking-tight ${jacquard_24.className}`}>{SITECONFIG.siteName}</span>
        <span className="md:text-xl">{SITECONFIG.role} at {SITECONFIG.org}</span>
      </div>

      {/* CTA Buttons */}
      <div className={`${jersey_25.className} flex flex-wrap justify-center gap-2 animate-fadeIn`} style={{ animationDelay: '0.6s' }}>
        <Link href="/research">
          <Button variant="primary" size="sm" className="flex flex-row gap-1.5 text-base md:text-lg py-1.5">
            Explore My Research
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" size="sm" className="flex flex-row gap-1.5 text-base md:text-lg py-1">
            Connect
          </Button>
        </Link>
      </div>
    </div>
  );
}
