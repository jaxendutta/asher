// ============================================================================
// Button Component
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#2D5F3F] text-white hover:bg-[#1A3A2A] focus:ring-[#2D5F3F]',
    secondary: 'bg-[#9DB8A1] text-[#1A3A2A] hover:bg-[#6B8F71] focus:ring-[#9DB8A1]',
    outline: 'border-2 border-[#2D5F3F] text-[#2D5F3F] hover:bg-[#2D5F3F] hover:text-white focus:ring-[#2D5F3F]',
    ghost: 'text-[#2D5F3F] hover:bg-[#F4EBD0] focus:ring-[#9DB8A1]',
  };
  
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
