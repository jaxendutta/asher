'use client';

// ============================================================================
// Cat Loader Component
// Inspired by: https://codepen.io/jkantner/pen/jOONyoO
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

interface CatLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CatLoader({ className, size = 'md' }: CatLoaderProps) {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('relative', sizes[size])}>
        <style jsx>{`
          @keyframes catWalk {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          
          @keyframes tailSway {
            0%, 100% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
          }
          
          @keyframes earWiggle {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-5deg); }
          }

          .cat-body {
            animation: catWalk 1s ease-in-out infinite;
          }

          .cat-tail {
            animation: tailSway 1.5s ease-in-out infinite;
            transform-origin: left center;
          }

          .cat-ear {
            animation: earWiggle 2s ease-in-out infinite;
            transform-origin: bottom center;
          }
        `}</style>

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tail */}
          <path
            d="M 15 60 Q 5 55 2 45"
            stroke="#F4A460"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="cat-tail"
          />

          {/* Body */}
          <g className="cat-body">
            {/* Main body */}
            <ellipse
              cx="50"
              cy="60"
              rx="25"
              ry="20"
              fill="#FFB07C"
              stroke="#F4A460"
              strokeWidth="2"
            />

            {/* Head */}
            <circle
              cx="50"
              cy="35"
              r="18"
              fill="#FFB07C"
              stroke="#F4A460"
              strokeWidth="2"
            />

            {/* Ears */}
            <path
              d="M 40 25 L 35 15 L 42 22 Z"
              fill="#FFB07C"
              stroke="#F4A460"
              strokeWidth="2"
              className="cat-ear"
            />
            <path
              d="M 60 25 L 65 15 L 58 22 Z"
              fill="#FFB07C"
              stroke="#F4A460"
              strokeWidth="2"
              className="cat-ear"
            />

            {/* Eyes */}
            <circle cx="44" cy="33" r="2" fill="#2C3E2C" />
            <circle cx="56" cy="33" r="2" fill="#2C3E2C" />

            {/* Nose */}
            <circle cx="50" cy="38" r="1.5" fill="#F4A460" />

            {/* Mouth */}
            <path
              d="M 50 38 Q 47 40 45 39"
              stroke="#F4A460"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M 50 38 Q 53 40 55 39"
              stroke="#F4A460"
              strokeWidth="1"
              fill="none"
            />

            {/* Legs */}
            <rect x="38" y="75" width="4" height="10" rx="2" fill="#FFB07C" />
            <rect x="58" y="75" width="4" height="10" rx="2" fill="#FFB07C" />
          </g>
        </svg>
      </div>
    </div>
  );
}
