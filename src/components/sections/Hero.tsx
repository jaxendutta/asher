'use client';

// ============================================================================
// Hero Component
// ============================================================================

import React from 'react';
import Link from 'next/link';
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
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main heading with animation */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#1A3A2A] mb-4">
            Welcome to the
            <span className="block text-[#2D5F3F] mt-2">Research Garden</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl mb-6">
            <span>🌱</span>
            <p className="text-[#5C6B5C] font-medium">Asher Kim</p>
            <span>🌱</span>
          </div>
        </div>

        {/* Subtitle */}
        <div className="mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <p className="text-xl sm:text-2xl text-[#2C3E2C] max-w-3xl mx-auto leading-relaxed">
            Biology student at the University of Waterloo exploring{' '}
            <span className="text-[#2D5F3F] font-semibold">plant biology</span>,{' '}
            <span className="text-[#2D5F3F] font-semibold">protein localization</span>, and{' '}
            <span className="text-[#2D5F3F] font-semibold">molecular mechanisms</span>
          </p>
        </div>

        {/* Research interests pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border-2 border-[#B8D4BE] text-sm font-medium text-[#2D5F3F]">
            🧬 Abiotic Stress Responses
          </div>
          <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border-2 border-[#B8D4BE] text-sm font-medium text-[#2D5F3F]">
            🦠 Plant-Microbe Interactions
          </div>
          <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border-2 border-[#B8D4BE] text-sm font-medium text-[#2D5F3F]">
            🔬 Protein Subcellular Transport
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <Link href="/research">
            <Button variant="primary" size="lg" className="flex flex-row gap-1.5">
              Explore My Research
              <HiArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg" className="flex flex-row gap-1.5">
              About Me
              <HiArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
