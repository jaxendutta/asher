'use client';

// ============================================================================
// Plant Component
// Decorative plant element for the garden theme
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

interface PlantProps {
  type?: 'flower' | 'leaf' | 'sprout' | 'tree';
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export function Plant({
  type = 'leaf',
  color = '#6B8E23',
  size = 'md',
  className,
  animated = true,
}: PlantProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const getPlantSVG = () => {
    switch (type) {
      case 'flower':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Stem */}
            <line
              x1="50"
              y1="70"
              x2="50"
              y2="40"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Petals */}
            <circle cx="50" cy="30" r="8" fill="#FFB6C1" opacity="0.8" />
            <circle cx="42" cy="35" r="8" fill="#DDA0DD" opacity="0.8" />
            <circle cx="58" cy="35" r="8" fill="#FFD700" opacity="0.8" />
            <circle cx="45" cy="25" r="8" fill="#FFA07A" opacity="0.8" />
            <circle cx="55" cy="25" r="8" fill="#FFB6C1" opacity="0.8" />
            {/* Center */}
            <circle cx="50" cy="30" r="5" fill="#FFD700" />
          </svg>
        );

      case 'leaf':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50 70 Q 30 50 50 20 Q 70 50 50 70 Z"
              fill={color}
              stroke={color}
              strokeWidth="2"
              opacity="0.9"
            />
            <line
              x1="50"
              y1="70"
              x2="50"
              y2="20"
              stroke={color}
              strokeWidth="2"
              opacity="0.6"
            />
          </svg>
        );

      case 'sprout':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Stem */}
            <line
              x1="50"
              y1="80"
              x2="50"
              y2="50"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Leaves */}
            <path
              d="M 50 50 Q 35 45 30 35"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              cx="28"
              cy="32"
              rx="8"
              ry="12"
              fill={color}
              opacity="0.8"
              transform="rotate(-30 28 32)"
            />
            <path
              d="M 50 50 Q 65 45 70 35"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              cx="72"
              cy="32"
              rx="8"
              ry="12"
              fill={color}
              opacity="0.8"
              transform="rotate(30 72 32)"
            />
          </svg>
        );

      case 'tree':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Trunk */}
            <rect
              x="45"
              y="60"
              width="10"
              height="30"
              fill="#5C4033"
              rx="2"
            />
            {/* Foliage layers */}
            <ellipse cx="50" cy="50" rx="25" ry="20" fill={color} opacity="0.9" />
            <ellipse cx="50" cy="40" rx="20" ry="15" fill={color} opacity="0.8" />
            <ellipse cx="50" cy="32" rx="15" ry="12" fill={color} opacity="0.7" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        sizes[size],
        animated && 'animate-sway',
        className
      )}
    >
      <style jsx>{`
        @keyframes sway {
          0%, 100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        .animate-sway {
          animation: sway 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
      `}</style>
      {getPlantSVG()}
    </div>
  );
}
