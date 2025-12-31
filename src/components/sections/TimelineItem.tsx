'use client';
import Link from 'next/link';

// ============================================================================
// Timeline Item Component
// ============================================================================

import { Card } from '@/components/ui/Card';
import { HiCalendar, HiLocationMarker, HiAcademicCap } from 'react-icons/hi';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDate } from '@/lib/utils';
import type { Education } from '@/types';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { GiHolyWater } from 'react-icons/gi';

interface TimelineItemProps {
  education: Education;
  isLast?: boolean;
  className?: string;
}

export function TimelineItem({ education, className }: TimelineItemProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-6 top-10 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-[#B8D4BE]" />
      
      <div className="flex gap-2 md:gap-4">
        {/* Icon */}
        <div className="relative flex-shrink-0">
          <GiHolyWater className="flex w-12 h-12 text-slate-600 pr-3 flex-shrink-0" />
          {/* Decorative plant */}
          <div className="absolute bottom-0 text-4xl">🌱</div>
        </div>

        {/* Content */}
        <Card hoverable variant="bordered" className="flex-1 p-4 md:p-6">
          {/* Header */}
          <div className="mb-4">
            <span className="text-xl md:text-2xl font-semibold text-[#1A3A2A] mb-1">
              {education.degree} - {education.field}
            </span>
            <div className="text-[#2D5F3F] font-semibold mb-2">
              {education.institution}
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-[#5C6B5C]">
              <Badge className="flex items-center gap-1 text-xs">
                <HiCalendar className="w-4 h-4" />
                <span>
                  {formatDate(education.startDate)} - {formatDate(education.endDate)}
                </span>
              </Badge>
              <Link href={education.location.mapUrl} target="_blank" rel="noopener noreferrer">
                <Badge className="flex items-center gap-1 text-xs">
                  <HiLocationMarker className="w-4 h-4" />
                  <span>{education.location.label}</span>
                </Badge>
              </Link>
              {education.gpa && (
                <Badge className="flex items-center gap-1 text-xs">
                  <span className="font-medium">GPA: {education.gpa}</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Thesis */}
          {education.thesis && (
            <div className="mb-4 p-3 bg-[#F4EBD0]/50 rounded-3xl border border-[#B8D4BE]">
              <div className="text-sm font-semibold text-[#2D5F3F] mb-1">
                Honours Thesis
              </div>
              <p className="text-sm text-[#2C3E2C] mb-2 italic">{education.thesis.title}</p>
              {education.thesis.supervisor && (
                <div className="text-xs text-[#5C6B5C]">
                  <Link href={education.thesis.supervisor.url} target="_blank" className="text-[#2D5F3F]">
                    <Badge className="flex justify-between items-center gap-1 text-xs pl-1 pr-2">
                      <span className="bg-white/40 px-1.5 rounded-full">Supervisor</span>
                      <span>{education.thesis.supervisor.label}</span>
                      <MdOutlineArrowOutward className="w-4 h-4 inline flex-shrink-0" />
                    </Badge>
                  </Link>
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
        </Card>
      </div>
    </div>
  );
}