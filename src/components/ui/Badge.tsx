// ============================================================================
// Badge Component
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors';
  
  const variants = {
    default: 'bg-[#B8D4BE] text-[#1A3A2A]',
    success: 'bg-[#10B981]/20 text-[#065F46]',
    warning: 'bg-[#F59E0B]/20 text-[#92400E]',
    info: 'bg-[#967BB6]/20 text-[#5B21B6]',
    outline: 'border-2 border-[#9DB8A1] text-[#2D5F3F]',
  };
  
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };
  
  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
