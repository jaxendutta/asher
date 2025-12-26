'use client';

// ============================================================================
// Talk Card Component
// ============================================================================

import React from 'react';
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
      case 'presentation':
        return '🎤';
      case 'poster':
        return '📊';
      case 'seminar':
        return '💡';
      case 'workshop':
        return '🔧';
      default:
        return '📢';
    }
  };

  const getTypeColor = () => {
    switch (talk.type) {
      case 'presentation':
        return 'info';
      case 'poster':
        return 'success';
      case 'seminar':
        return 'warning';
      case 'workshop':
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

            <div className="text-sm font-medium text-[#2D5F3F] mb-2">
              {talk.event}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C6B5C]">
              <Badge variant={getTypeColor()} size="sm">
                {talk.type}
              </Badge>
              <div className="flex items-center gap-1">
                <HiCalendar className="w-4 h-4" />
                <span>{formatDate(talk.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <HiLocationMarker className="w-4 h-4" />
                <span>{talk.location}</span>
              </div>
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
            {talk.slides && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(talk.slides, '_blank')}
              >
                <HiPresentationChartBar className="w-4 h-4 mr-1.5" />
                View Slides
              </Button>
            )}
            {talk.video && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(talk.video, '_blank')}
              >
                <HiVideoCamera className="w-4 h-4 mr-1.5" />
                Watch Recording
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
