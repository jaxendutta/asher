'use client';

// ============================================================================
// Cat Companion Component
// A friendly cat that appears on the side of pages
// ============================================================================

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CatCompanionProps {
  position?: 'left' | 'right';
  className?: string;
}

export function CatCompanion({ position = 'right', className }: CatCompanionProps) {
  const [mood, setMood] = useState<'sleeping' | 'sitting' | 'looking'>('sitting');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show cat after a short delay
    const showTimer = setTimeout(() => setIsVisible(true), 1000);

    // Random mood changes
    const moodInterval = setInterval(() => {
      const moods: Array<'sleeping' | 'sitting' | 'looking'> = ['sleeping', 'sitting', 'looking'];
      setMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(moodInterval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-8 z-40 transition-all duration-700',
        position === 'right' ? 'right-8' : 'left-8',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
    >
      <div className="relative group">
        {/* Thought bubble (appears on hover) */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white rounded-lg px-3 py-2 shadow-lg text-sm whitespace-nowrap">
            {mood === 'sleeping' && '💤 Zzz...'}
            {mood === 'sitting' && '🌱 Nice research!'}
            {mood === 'looking' && '👀 Watching...'}
          </div>
        </div>

        {/* Cat */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className={cn(
            'transition-transform hover:scale-110',
            mood === 'sleeping' && 'animate-pulse'
          )}
        >
          {/* Shadow */}
          <ellipse
            cx="40"
            cy="72"
            rx="20"
            ry="4"
            fill="#00000020"
          />

          {/* Tail */}
          <path
            d="M 25 55 Q 15 60 12 70"
            stroke="#F4A460"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            className={cn(
              'transition-transform origin-top',
              mood === 'looking' && 'animate-bounce'
            )}
          />

          {/* Body */}
          <ellipse
            cx="40"
            cy="55"
            rx="22"
            ry="18"
            fill="#FFB07C"
            stroke="#F4A460"
            strokeWidth="2"
          />

          {/* Head */}
          <circle
            cx="40"
            cy="35"
            r="16"
            fill="#FFB07C"
            stroke="#F4A460"
            strokeWidth="2"
          />

          {/* Ears */}
          <path
            d="M 30 25 L 25 15 L 32 22 Z"
            fill="#FFB07C"
            stroke="#F4A460"
            strokeWidth="2"
          />
          <path
            d="M 50 25 L 55 15 L 48 22 Z"
            fill="#FFB07C"
            stroke="#F4A460"
            strokeWidth="2"
          />

          {/* Ear details */}
          <path
            d="M 28 22 L 27 17"
            stroke="#F4A460"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 52 22 L 53 17"
            stroke="#F4A460"
            strokeWidth="1"
            fill="none"
          />

          {/* Eyes */}
          {mood === 'sleeping' ? (
            <>
              <line x1="34" y1="33" x2="38" y2="33" stroke="#2C3E2C" strokeWidth="2" strokeLinecap="round" />
              <line x1="42" y1="33" x2="46" y2="33" stroke="#2C3E2C" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="35" cy="33" r="2.5" fill="#2C3E2C" />
              <circle cx="45" cy="33" r="2.5" fill="#2C3E2C" />
              <circle cx="36" cy="32" r="1" fill="white" />
              <circle cx="46" cy="32" r="1" fill="white" />
            </>
          )}

          {/* Nose */}
          <circle cx="40" cy="38" r="1.5" fill="#F4A460" />

          {/* Mouth */}
          <path
            d="M 40 38 Q 37 40 35 39"
            stroke="#F4A460"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 40 38 Q 43 40 45 39"
            stroke="#F4A460"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Whiskers */}
          <line x1="25" y1="36" x2="32" y2="36" stroke="#F4A460" strokeWidth="0.5" />
          <line x1="25" y1="38" x2="32" y2="37" stroke="#F4A460" strokeWidth="0.5" />
          <line x1="55" y1="36" x2="48" y2="36" stroke="#F4A460" strokeWidth="0.5" />
          <line x1="55" y1="38" x2="48" y2="37" stroke="#F4A460" strokeWidth="0.5" />

          {/* Paws */}
          <ellipse cx="32" cy="68" rx="6" ry="4" fill="#FFB07C" />
          <ellipse cx="48" cy="68" rx="6" ry="4" fill="#FFB07C" />
        </svg>
      </div>
    </div>
  );
}
