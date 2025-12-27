'use client';

// ============================================================================
// Publication Card Component
// ============================================================================

import React from 'react';
import { HiExternalLink } from 'react-icons/hi';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDate } from '@/lib/utils';
import type { Publication } from '@/types';
import Link from 'next/link';
import { VscFilePdf } from 'react-icons/vsc';

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
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-[#1A3A2A] group-hover:text-[#2D5F3F] transition-colors leading-tight">
                {publication.title}
              </h3>
              {publication.url && (
                publication.url.startsWith('http') ? (
                  <Link
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-1 text-[#5C6B5C] hover:text-[#2D5F3F] transition-colors"
                    aria-label="View publication"
                  >
                    <HiExternalLink className="w-6 h-6" />
                  </Link>
                ): (
                <Link
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-1 text-[#5C6B5C] hover:text-[#2D5F3F] transition-colors"
                  aria-label="View publication"
                >               
                  <VscFilePdf className="w-6 h-6" />
                </Link>
              ))}
            </div>

            <div className="text-sm text-[#5C6B5C]">
              {publication.authors.join(', ')}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6B5C]">
              <Badge variant="outline" className={getTypeColor()} size="sm">
                {publication.type}
              </Badge>
              {publication.medium && (<Badge variant="outline" size="sm">
                {publication.medium || 'N/A'}
              </Badge>)}
              <Badge variant="outline" size="sm">
                {publication.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
