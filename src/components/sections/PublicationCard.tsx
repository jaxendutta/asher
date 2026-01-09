'use client';

// ============================================================================
// Publication Card Component
// ============================================================================

import { HiExternalLink } from 'react-icons/hi';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { Publication } from '@/types';
import Link from 'next/link';
import { VscFilePdf } from 'react-icons/vsc';
import { jersey_25 } from '@/lib/fonts';
import { formatDateLong } from '@/lib/utils';

interface PublicationCardProps {
  publication: Publication;
  className?: string;
}

export function PublicationCard({ publication, className }: PublicationCardProps) {
  const getTypeColor = () => {
    switch (publication.type) {
      case 'Article':
        return 'text-blue-500 bg-blue-100 border-blue-200';
      case 'Thesis':
        return 'border-green-800/40 text-[#2D5F3F] bg-green-100';
      case 'Essay':
        return 'border-yellow-800/40 text-[#92400E] bg-yellow-100';
      default:
        return 'default';
    }
  };

  return (
    <Card hoverable variant="bordered" className={cn('group', className)}>
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-4">
              <span className={`text-xl md:text-2xl font-semibold text-slate-700 group-hover:text-[#2D5F3F] transition-colors leading-5.5 ${jersey_25.className}`} dangerouslySetInnerHTML={{ __html: publication.title }} />
              {publication.url && (
                <Link
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-1 text-[#5C6B5C] hover:text-[#2D5F3F] transition-colors"
                  aria-label="View publication"
                >
                  {publication.url.startsWith('http') ? (<HiExternalLink className="w-6 h-6" />) : (<VscFilePdf className="w-6 h-6" />)}
                </Link>
              )
              }
            </div>

            <div className="text-sm text-[#5C6B5C]">
              {publication.authors.join(', ')}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6B5C] mt-1.5">
              <Badge variant="outline" className={getTypeColor()} size="sm">
                {publication.type}
              </Badge>
              {publication.medium && (<Badge variant="outline" size="sm">
                {publication.medium || 'N/A'}
              </Badge>)}
              <Badge variant="outline" size="sm">
                {formatDateLong(publication.date)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
