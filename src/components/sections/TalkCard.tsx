'use client';

// ============================================================================
// Talk Card Component
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { HiCalendar, HiLocationMarker, HiPresentationChartBar, HiVideoCamera } from 'react-icons/hi';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Talk } from '@/types';
import { VscGlobe, VscFilePdf } from 'react-icons/vsc';

interface TalkCardProps {
  talk: Talk;
  className?: string;
}

export function TalkCard({ talk, className }: TalkCardProps) {
  const getTypeColor = () => {
    switch (talk.type) {
      case 'Presentation':
        return 'text-blue-500 bg-blue-100 border-blue-200';
      case 'Poster':
        return 'border-green-800/40 text-[#2D5F3F] bg-green-100';
      case 'Seminar':
        return 'border-yellow-800/40 text-[#92400E] bg-yellow-100';
      case 'Workshop':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card hoverable variant="bordered" className={cn('group', className)}>
      <CardContent className="space-y-4">
        <div className="flex-1 space-y-1">
          <div className="flex flex-row">
            <h3 className="text-lg font-bold text-[#1A3A2A] group-hover:text-[#2D5F3F] transition-colors mb-2">
              {talk.event.label}
            </h3>
            <div className="ml-auto flex flex-row flex-shrink-0 justify-center">
              {talk.event.url && <Link href={talk.event.url} className="flex-shrink-0 p-1 text-[#5C6B5C] hover:text-[#2D5F3F] transition-colors" target="_blank" rel="noopener noreferrer" aria-label="View event">
                <VscGlobe className="w-6 h-6" />
              </Link>}
              {talk.poster?.url && <Link href={talk.poster.url} className="flex-shrink-0 p-1 text-[#5C6B5C] hover:text-[#2D5F3F] transition-colors" target="_blank" rel="noopener noreferrer" aria-label="View event">
                <VscFilePdf className="w-5.5 h-5.5" />
              </Link>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6B5C]">
            <Badge variant="outline" className={getTypeColor()} size="sm">
              {talk.type}
            </Badge>
            <Badge variant="outline" size="sm" className="flex items-center justify-center gap-1.5">
              <HiCalendar />
              <span>{(talk.date.toLocaleDateString())}</span>
            </Badge>
            <Link href={talk.location.url} className="flex items-center gap-1" target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" size="sm" className="flex items-center justify-center gap-1.5">
                <HiLocationMarker />
                <span>{talk.location.label}</span>
              </Badge>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="italic font-semibold text-[#1A3A2A]/80 group-hover:text-[#2D5F3F] transition-colors">
            {talk.title}
          </div>
          {talk.description && (<p className="text-sm text-[#2C3E2C] leading-relaxed">
            {talk.description}
          </p>)}
        </div>

        {(talk.slides || talk.video) && (
          <div className="flex flex-wrap gap-2">
            {talk.slides && (talk.slides.map(slide => (
              <Button
                key={slide.url}
                variant="outline"
                size="sm"
                onClick={() => window.open(slide.url, '_blank')}
              >
                <HiPresentationChartBar className="w-4 h-4 mr-1.5" />
                View {slide.label || 'Slides'}
              </Button>
            )))}
            {talk.video && (talk.video.map(video => (
              <Button
                key={video.url}
                variant="outline"
                size="sm"
                onClick={() => window.open(video.url, '_blank')}
              >
                <HiVideoCamera className="w-4 h-4 mr-1.5" />
                Watch {video.label || 'Video'}
              </Button>
            )))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
