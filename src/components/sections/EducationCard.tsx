'use client';
import Link from 'next/link';

// ============================================================================
// Education Card Component
// ============================================================================

import { Card } from '@/components/ui/Card';
import { HiCalendar, HiLocationMarker } from 'react-icons/hi';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { Education } from '@/types';
import { MdGrade, MdOutlineArrowOutward } from 'react-icons/md';
import { jersey_25 } from '@/lib/fonts';

interface EducationCardProps {
  education: Education;
  isLast?: boolean;
  className?: string;
}

export function EducationCard({ education, className }: EducationCardProps) {
  return (
    <Card hoverable variant="bordered" className="flex-1 p-4.5 md:p-6">
      {/* Header */}
      <div className="mb-4">
        <span className={`text-2xl text-[#1A3A2A] leading-5.5 ${jersey_25.className}`}>
          {education.degree} [{education.degree_abbr}] - {education.field}
        </span>
        <div className={`text-lg text-[#2D5F3F] mb-2 ${jersey_25.className}`}>
          {education.institution}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-[#5C6B5C]">
          <Badge className="flex items-center gap-1 text-xs">
            <HiCalendar />
            <span>
              {formatDate(education.startDate)} - {formatDate(education.endDate)}
            </span>
          </Badge>
          <Link href={education.location.mapUrl} target="_blank" rel="noopener noreferrer">
            <Badge className="flex items-center gap-1 text-xs">
              <HiLocationMarker />
              <span>{education.location.label}</span>
            </Badge>
          </Link>
          {education.gpa && (
            <Badge className="flex items-center gap-1 text-xs">
              <MdGrade />
              <span className="font-medium">GPA: {education.gpa}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Thesis */}
      {education.thesis && (
        <div className="mb-4 p-3 bg-[#F4EBD0]/50 rounded-2xl border border-[#B8D4BE]">
          <div className="text-sm font-semibold text-[#2D5F3F] mb-1">
            Thesis
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
            {education.awards.sort().reverse().map((award, index) => (
              <Badge key={index} variant="success" size="sm">
                {award}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
