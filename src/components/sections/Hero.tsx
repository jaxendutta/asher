'use client';

// ============================================================================
// Hero Component
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { SITECONFIG } from '@/data/siteConfig';
import { fleur_de_leah } from '@/lib/fonts';
import { HiArrowRight } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import { Plant } from '@/components/garden/Plant';

export function Hero() {
  return (
    <div className="h-full flex items-center justify-center overflow-hidden">
      {/* Decorative plants */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Plant type="tree" size="lg" className="absolute top-10 left-10 opacity-30" />
        <Plant type="flower" size="md" className="absolute top-20 right-20 opacity-40" />
        <Plant type="sprout" size="sm" className="absolute bottom-32 left-1/4 opacity-30" />
        <Plant type="leaf" size="md" className="absolute bottom-20 right-1/3 opacity-35" />
        <Plant type="flower" size="sm" className="absolute top-1/3 right-10 opacity-30" />
        <Plant type="leaf" size="lg" className="absolute bottom-40 right-10 opacity-25" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        {/* Main heading with animation */}
        <div className="animate-fadeIn text-[#1A3A2A] flex flex-col gap-2">
          <span className="text-lg sm:text-xl md:text-2xl">WELCOME TO</span>
          <span className={`${fleur_de_leah.className} block text-[#2D5F3F] mt-2 mb-6 text-6xl sm:text-7xl md:text-8xl`}>{SITECONFIG.siteName}</span>
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
    </div>
  );
}
