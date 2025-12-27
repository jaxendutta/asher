'use client';

// ============================================================================
// Talk Card Component
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { HiCalendar, HiLocationMarker, HiPresentationChartBar, HiVideoCamera } from 'react-icons/hi';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn, formatDate } from '@/lib/utils';
import type { Talk } from '@/types';

interface TalkCardProps {
  talk: Talk;
  className?: string;
}

export function TalkCard({ talk, className }: TalkCardProps) {
  const getTypeIcon = () => {
    switch (talk.type) {
      case 'Presentation':
        return '🎤';
      case 'Poster':
        return '📊';
      case 'Seminar':
        return '💡';
      case 'Workshop':
        return '🔧';
      default:
        return '📢';
    }
  };

  const getTypeColor = () => {
    switch (talk.type) {
      case 'Presentation':
        return 'info';
      case 'Poster':
        return 'success';
      case 'Seminar':
        return 'warning';
      case 'Workshop':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card hoverable variant="bordered" className={cn('group', className)}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="text-3xl flex-shrink-0">{getTypeIcon()}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#1A3A2A] group-hover:text-[#2D5F3F] transition-colors mb-2">
              {talk.title}
            </h3>

            {talk.event.url ? (
              <Link href={talk.event.url} className="text-sm font-medium text-[#2D5F3F] mb-2" target="_blank" rel="noopener noreferrer">
                {talk.event.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-[#2D5F3F] mb-2">
                {talk.event.label}
              </span>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C6B5C]">
              <Badge variant={getTypeColor()} size="sm">
                {talk.type}
              </Badge>
              <div className="flex items-center gap-1">
                <HiCalendar className="w-4 h-4" />
                <span>{formatDate(talk.date)}</span>
              </div>
              <Link href={talk.location.url} className="flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                <HiLocationMarker className="w-4 h-4" />
                <span>{talk.location.label}</span>
              </Link>
            </div>
          </div>
        </div>
      </CardHeader>

      {talk.description && (
        <CardContent>
          <p className="text-sm text-[#2C3E2C] leading-relaxed">
            {talk.description}
          </p>
        </CardContent>
      )}

      {(talk.slides || talk.video) && (
        <CardFooter>
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
        </CardFooter>
      )}
    </Card>
  );
}
