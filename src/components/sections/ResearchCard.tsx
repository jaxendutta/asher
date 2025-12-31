'use client';

// ============================================================================
// Research Card Component
// ============================================================================

import Link from 'next/link';
import { HiCalendar, HiLocationMarker } from 'react-icons/hi';
import { MdArrowForward, MdOutlineArrowOutward } from 'react-icons/md';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDate, calculateDuration } from '@/lib/utils';
import type { Experience, Presentation } from '@/types';
import { talks } from '@/data/talks';


interface ResearchCardProps {
  research: Experience;
  className?: string;
}

export function ResearchCard({ research, className }: ResearchCardProps) {
  const talkData: Record<string, Presentation> = research.talks ? research.talks.reduce((acc, key) => {
    const talk = talks[key];
    if (talk) {
      acc[key] = talk;
    }
    return acc;
  }, {} as Record<string, Presentation>) : {};

  // Sort talks by date descending
  const sortedTalks = Object.entries(talkData).sort((a, b) => b[1].date.getTime() - a[1].date.getTime());

  return (
    <Card hoverable variant="bordered" className={cn('group', className)}>
      <CardHeader>
        <div className="text-lg md:text-xl font-semibold text-[#1A3A2A] group-hover:text-[#2D5F3F] transition-colors">
          {research.title}
        </div>

        <div className="flex flex-wrap w-full items-center gap-2 mt-3">
          {research.org.url ? (
            <Link
              href={research.org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center gap-1 hover:text-[#2D5F3F] transition-colors"
            >
              <Badge className="flex flex-1 items-center gap-2 mt-1">
                <span className="whitespace-nowrap">{research.org.label}</span>
                <MdOutlineArrowOutward className="w-4 h-4 inline flex-shrink-0" />
              </Badge>
            </Link>
          ) : (
            <Badge className="flex flex-1 items-center gap-2 mt-1">{research.org.label}</Badge>
          )}

          {research.subOrg && (
            research.subOrg.url ? (
              <Link
                href={research.subOrg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center gap-1 hover:text-[#2D5F3F] transition-colors"
              >
                <Badge className="flex flex-1 items-center gap-1">
                  <span className="text-sm whitespace-nowrap">{research.subOrg.label}</span>
                  <MdOutlineArrowOutward className="w-4 h-4 inline flex-shrink-0" />
                </Badge>
              </Link>
            ) : (
              <Badge className="flex flex-1 items-center gap-1">
                <span className="text-sm whitespace-nowrap">{research.subOrg.label}</span>
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
            <span>{research.org.city}, {research.org.province || research.org.country}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-[#2C3E2C] mb-3 text-sm md:text-base">{research.description}</p>

        {research.highlights && research.highlights.length > 0 && (
          <ul className="space-y-1">
            {research.highlights.map((highlight, index) => (
              <li key={index} className="flex gap-2 text-xs md:text-sm text-[#5C6B5C]">
                <span>🌱</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>


      <CardFooter className="flex flex-col gap-2">
        {research.subOrg?.lead && (
          <Link
            href={research.subOrg.lead.url!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center gap-1 hover:text-[#2D5F3F] transition-colors"
          >
            <Badge className="flex flex-1 justify-between items-center gap-2 text-xs pl-1 pr-2">
              <span className="whitespace-nowrap bg-white/40 rounded-full px-2">Supervisor</span>
              <span className="whitespace-nowrap">{research.subOrg.lead.label}</span>
              <MdOutlineArrowOutward className="w-4 h-4 inline flex-shrink-0" />
            </Badge>
          </Link>
        )}

        {research.talks && research.talks.length > 0 && (
          <div className="flex flex-wrap w-full gap-2">
            {sortedTalks.map(([id, talk]) => (
              <Link
                href={`/talks#${id}`}
                key={id}
                rel="noopener noreferrer"
                className="flex flex-1 items-center gap-1 hover:text-[#2D5F3F] transition-colors"
              >
                <Badge className="flex flex-1 justify-between items-center gap-2 text-xs pl-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap bg-white/40 rounded-full px-2">{talk.type}</span>
                    <span>{talk.event.shortLabel || talk.event.label}</span>
                  </div>
                  <MdArrowForward className="w-4 h-4 inline flex-shrink-0" />
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {research.skills && research.skills.length > 0 && (<div className="flex flex-wrap gap-2">
          {research.skills.map((skill, index) => (
            <Badge key={index} variant="default" size="sm">
              {skill}
            </Badge>
          ))}
        </div>)}
      </CardFooter>
    </Card>
  );
}
