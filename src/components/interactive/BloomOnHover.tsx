'use client';

// ============================================================================
// Bloom On Hover Component
// Wraps content with a bloom animation on hover
// ============================================================================

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface BloomOnHoverProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function BloomOnHover({ children, delay = 0, className }: BloomOnHoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn('group', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <style jsx>{`
        @keyframes bloom {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bloomHover {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1.02);
          }
        }

        .bloom-in {
          animation: bloom 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
          opacity: 0;
        }

        .bloom-hover {
          animation: bloomHover 0.3s ease-out forwards;
        }
      `}</style>

      <div className={cn('bloom-in', isHovered && 'bloom-hover')}>
        {children}
      </div>
    </div>
  );
}
