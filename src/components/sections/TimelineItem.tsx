'use client';
import Link from 'next/link';

// ============================================================================
// Timeline Item Component
// ============================================================================

import React from 'react';
import { HiCalendar, HiLocationMarker, HiAcademicCap } from 'react-icons/hi';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDate } from '@/lib/utils';
import type { Education } from '@/types';

interface TimelineItemProps {
  education: Education;
  isLast?: boolean;
  className?: string;
}

export function TimelineItem({ education, isLast = false, className }: TimelineItemProps) {
  return (
    <div className={cn('relative pb-12', isLast && 'pb-0', className)}>
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-[#6B8E23] to-[#B8D4BE]" />
      )}

      <div className="flex gap-6">
        {/* Icon */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#2D5F3F] flex items-center justify-center text-white shadow-lg">
            <HiAcademicCap className="w-6 h-6" />
          </div>
          {/* Decorative plant */}
          <div className="absolute -right-2 -bottom-1 text-xl">🌱</div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-[#B8D4BE] p-6 hover:shadow-lg hover:border-[#6B8E23] transition-all duration-300">
          {/* Header */}
          <div className="mb-4">
            <span className="text-xl md:text-2xl font-semibold text-[#1A3A2A] mb-1">
              {education.degree}
            </span>
            <div className="text-[#2D5F3F] font-semibold mb-2">
              {education.institution}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-[#5C6B5C]">
              <div className="flex items-center gap-1">
                <HiCalendar className="w-4 h-4" />
                <span>
                  {formatDate(education.startDate)} - {formatDate(education.endDate)}
                </span>
              </div>
              <Link href={education.location.mapUrl} className="flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                <HiLocationMarker className="w-4 h-4" />
                <span>{education.location.label}</span>
              </Link>
              {education.gpa && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">GPA: {education.gpa}</span>
                </div>
              )}
            </div>
          </div>

          {/* Thesis */}
          {education.thesis && (
            <div className="mb-4 p-4 bg-[#F4EBD0]/50 rounded-lg border border-[#B8D4BE]">
              <div className="text-sm font-semibold text-[#2D5F3F] mb-1">
                Honours Thesis
              </div>
              <p className="text-sm text-[#2C3E2C] mb-2">{education.thesis.title}</p>
              {education.thesis.supervisor && (
                <div className="text-xs text-[#5C6B5C]">
                  <span className="font-medium">Supervisor: </span>
                  {education.thesis.supervisorLink ? (
                  <Link href={education.thesis.supervisorLink} target="_blank" className="text-[#2D5F3F] hover:underline">
                    {education.thesis.supervisor}
                  </Link>
                  ) : (
                  education.thesis.supervisor
                  )}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {education.description && (
            <p className="text-sm text-[#5C6B5C] mb-4">{education.description}</p>
          )}

          {/* Awards */}
          {education.awards && education.awards.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-[#2D5F3F] mb-2">
                Awards + Honours
              </div>
              <div className="flex flex-wrap gap-2">
                {education.awards.map((award, index) => (
                  <Badge key={index} variant="success" size="sm">
                    {award}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
