'use client';

// ============================================================================
// Research Card Component
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { HiExternalLink, HiCalendar, HiLocationMarker } from 'react-icons/hi';
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="text-lg md:text-xl font-semibold text-[#1A3A2A] group-hover:text-[#2D5F3F] transition-colors">
              {research.title}
            </span>
            <div className="flex items-center gap-2 mt-1 text-[#5C6B5C]">
              {research.lab?.url ? (
                <a
                  href={research.org?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#2D5F3F] transition-colors"
                >
                  <span className="font-medium">{research.org?.label}</span>
                  <HiExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="font-medium">{research.org?.label}</span>
              )}
              {research.lab && (
                <>
                  <span>•</span>
                  <span className="text-sm">{research.lab?.label}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-[#5C6B5C]">
          <div className="flex items-center gap-1">
            <HiCalendar className="w-4 h-4" />
            <span>
              {formatDate(research.startDate)} - {formatDate(research.endDate || 'present')}
            </span>
            {duration && <span className="text-xs ml-1">({duration})</span>}
          </div>
          <Link href={research.location.url} className="flex items-center gap-1" target="_blank" rel="noopener noreferrer">
            <HiLocationMarker className="w-4 h-4" />
            <span>{research.location.label}</span>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-[#2C3E2C] mb-3">{research.description}</p>

        {research.highlights && research.highlights.length > 0 && (
          <ul className="space-y-2 mb-4">
            {research.highlights.map((highlight, index) => (
              <li key={index} className="flex gap-2 text-sm text-[#5C6B5C]">
                <span className="text-[#6B8E23] mt-1">🌱</span>
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
