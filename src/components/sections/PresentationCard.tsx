'use client';

// ============================================================================
// Presentation Card Component
// ============================================================================

import Link from 'next/link';
import { HiCalendar, HiLocationMarker } from 'react-icons/hi';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { Presentation } from '@/types';
import { VscGlobe, VscFilePdf } from 'react-icons/vsc';
import { RxVideo } from 'react-icons/rx';
import { newsreader } from '@/lib/fonts';

interface PresentationCardProps {
  talk: Presentation;
  className?: string;
}

export function PresentationCard({ talk, className }: PresentationCardProps) {
  const getTypeColor = () => {
    switch (talk.type) {
      case 'Video':
        return 'text-blue-600 bg-blue-100 border-blue-400';
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
      <CardContent className="pb-2">
        <div className="flex flex-col flex-1">
          <div className="flex flex-row">
            <span className="text-lg md:text-xl font-semibold text-[#1A3A2A] group-hover:text-[#2D5F3F] transition-colors mb-2">
              {talk.event.label}
            </span>
            <div className="ml-auto flex flex-row flex-shrink-0 justify-center">
              {talk.event.url && <Link href={talk.event.url} className="flex-shrink-0 p-1 text-[#5C6B5C] hover:text-[#2D5F3F] transition-colors" target="_blank" rel="noopener noreferrer" aria-label="View event">
                <VscGlobe className="w-6 h-6" />
              </Link>}
              {talk.poster?.url && <Link href={talk.poster.url} className="flex-shrink-0 p-1 text-[#5C6B5C] hover:text-[#2D5F3F] transition-colors" target="_blank" rel="noopener noreferrer" aria-label="View event">
                <VscFilePdf className="w-5.5 h-5.5" />
              </Link>}
              {talk.video?.[0]?.url && <Link href={talk.video[0].url} className="flex-shrink-0 p-1 text-[#5C6B5C] hover:text-[#2D5F3F] transition-colors" target="_blank" rel="noopener noreferrer" aria-label="View event">
                <RxVideo className="w-6 h-6" />
              </Link>}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-t border-[#5C6B5C]/20 mb-2.5" />

          {/* Talk Title and Description */}
          <div className="flex flex-col gap-2">
            <div className={`font-semibold text-[#1A3A2A]/80 group-hover:text-[#2D5F3F] transition-colors italic ${newsreader.className}`} dangerouslySetInnerHTML={{ __html: talk.title }} />
            {talk.description && (<p className="text-sm text-[#2C3E2C] leading-relaxed">
              {talk.description}
            </p>)}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6B5C]">
          {/* Type */}
          <Badge variant="outline" className={getTypeColor()} size="sm">
            {talk.type}
          </Badge>

          {/* Host */}
          {talk.host && (<Link href={talk.host.url} className="flex items-center gap-1" target="_blank" rel="noopener noreferrer">
            <Badge variant="outline" size="sm" className="flex items-center justify-center gap-1.5">
              <HiLocationMarker />
              <span>{talk.host.label}</span>
            </Badge>
          </Link>)}

          {/* Date */}
          <Badge variant="outline" size="sm" className="flex items-center justify-center gap-1.5">
            <HiCalendar />
            <span>{(talk.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}</span>
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
