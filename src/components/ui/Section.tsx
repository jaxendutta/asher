// ============================================================================
// Section Component
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  centered?: boolean;
  children: React.ReactNode;
}

export function Section({
  title,
  subtitle,
  centered = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className={cn('mb-12', centered && 'text-center')}>
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A3A2A] mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-[#5C6B5C] max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
