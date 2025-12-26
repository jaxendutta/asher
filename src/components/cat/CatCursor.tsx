'use client';

// ============================================================================
// Cat Paw Cursor Component
// ============================================================================

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function CatCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999] transition-transform duration-100"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isClicking ? 0.9 : 1})`,
      }}
    >
      {/* Cat Paw SVG */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'drop-shadow-md transition-transform',
          isClicking && 'scale-90'
        )}
      >
        {/* Main pad */}
        <ellipse
          cx="16"
          cy="20"
          rx="8"
          ry="6"
          fill="#FFB07C"
          stroke="#F4A460"
          strokeWidth="1"
        />
        {/* Toe beans */}
        <circle cx="11" cy="12" r="3" fill="#FFB07C" stroke="#F4A460" strokeWidth="0.5" />
        <circle cx="16" cy="10" r="3" fill="#FFB07C" stroke="#F4A460" strokeWidth="0.5" />
        <circle cx="21" cy="12" r="3" fill="#FFB07C" stroke="#F4A460" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
