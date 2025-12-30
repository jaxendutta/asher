'use client';

// ============================================================================
// Research Card Component
// ============================================================================

import Link from 'next/link';
import { HiCalendar, HiLocationMarker } from 'react-icons/hi';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDate, calculateDuration } from '@/lib/utils';
import type { ResearchExperience } from '@/types';

interface ResearchCardProps {
  research: ResearchExperience;
  className?: string;
}

export function ResearchCard({ research, className }: ResearchCardProps) {
  const duration = calculateDuration(research.startDate, research.endDate || new Date());

  return (
    <Card hoverable variant="bordered" className={cn('group', className)}>
      <CardHeader>
        <div className="text-lg md:text-xl font-semibold text-[#1A3A2A] group-hover:text-[#2D5F3F] transition-colors">
          {research.title}
        </div>

        <div className="flex w-full items-center gap-3 mt-3">
          {research.org.url ? (
            <Link
              href={research.org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center gap-1 hover:text-[#2D5F3F] transition-colors"
            >
              <Badge className="flex flex-1 items-center gap-2 mt-1">
                <span className="font-medium">{research.org.label} 🡥</span>
              </Badge>
            </Link>
          ) : (
            <Badge className="flex flex-1 items-center gap-2 mt-1">{research.org.label}</Badge>
          )}

          {research.lab && (
            research.lab.url ? (
              <Link
                href={research.lab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center gap-1 hover:text-[#2D5F3F] transition-colors"
              >
                <Badge className="flex flex-1 items-center gap-2 mt-1">
                  <span className="text-sm">{research.lab.label} 🡥</span>
                </Badge>
              </Link>
            ) : (
              <Badge className="flex flex-1 items-center gap-2 mt-1">
                <span className="text-sm">{research.lab.label}</span>
              </Badge>
            ))}
        </div>

        <div className="flex w-full items-center gap-3 mt-3">
          <Badge className="flex items-center gap-2 text-xs flex-1">
            <HiCalendar />
            <span>
              {formatDate(research.startDate)} - {formatDate(research.endDate || 'present')}
            </span>
          </Badge>
          <Badge className="flex items-center gap-1 text-xs flex-shrink-0">
            <HiLocationMarker />
            <span>{research.location.label}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-[#2C3E2C] mb-3">{research.description}</p>

        {research.highlights && research.highlights.length > 0 && (
          <ul className="space-y-1 mb-4">
            {research.highlights.map((highlight, index) => (
              <li key={index} className="flex gap-2 text-sm text-[#5C6B5C]">
                <span>🌱</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {research.supervisor && (
          <div className="text-sm text-[#5C6B5C] mt-3">
            <span className="font-medium">Supervisor: </span>
            {research.supervisor.url ? (
              <Link
                href={research.supervisor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2D5F3F] hover:underline"
              >
                {research.supervisor.label}
              </Link>
            ) : (
              <span>{research.supervisor.label}</span>
            )}
          </div>
        )}
      </CardContent>

      {research.skills && research.skills.length > 0 && (
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {research.skills.map((skill, index) => (
              <Badge key={index} variant="default" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
