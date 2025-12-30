// ============================================================================
// Section Component
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';
import { fleur_de_leah } from '@/lib/fonts';

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
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className={cn('mb-12', centered && 'text-center bg-gradient-to-r from-[#F4EBD0]/70 to-[#B8D4BE]/60 rounded-3xl p-8 border-2 border-[#B8D4BE]')}>
            {title && (
              <span className={`${fleur_de_leah.className} text-5xl md:text-6xl font-bold text-[#1A3A2A] mb-4`}>
                {title}
              </span>
            )}
            {subtitle && (
              <p className="text-sm md:text-lg text-[#5C6B5C] max-w-2xl mx-auto">
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
