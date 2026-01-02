// ============================================================================
// Card Component
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  variant?: 'default' | 'bordered' | 'elevated';
  children: React.ReactNode;
}

export function Card({
  hoverable = false,
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  const baseStyles = 'p-2 rounded-3xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white/80 backdrop-blur-sm',
    bordered: 'bg-white/80 backdrop-blur-sm border-2 border-[#B8D4BE]',
    elevated: 'bg-white shadow-md',
  };
  
  const hoverStyles = hoverable
    ? 'hover:shadow-lg hover:scale-[1.01] hover:bg-white'
    : '';
  
  return (
    <div
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Card sub-components for better composition
export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-4 pb-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-4 md:px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-2 md:p-4', className)} {...props}>
      {children}
    </div>
  );
}
