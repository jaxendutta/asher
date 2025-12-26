'use client';

// ============================================================================
// Publication Card Component
// ============================================================================

import React from 'react';
import { HiExternalLink, HiDocumentText } from 'react-icons/hi';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDate } from '@/lib/utils';
import type { Publication } from '@/types';

interface PublicationCardProps {
  publication: Publication;
  className?: string;
}

export function PublicationCard({ publication, className }: PublicationCardProps) {
  const getTypeIcon = () => {
    switch (publication.type) {
      case 'paper':
        return '📄';
      case 'thesis':
        return '🎓';
      case 'essay':
        return '✍️';
      case 'article':
        return '📰';
      default:
        return '📝';
    }
  };

  const getTypeColor = () => {
    switch (publication.type) {
      case 'paper':
        return 'info';
      case 'thesis':
        return 'success';
      case 'essay':
        return 'default';
      case 'article':
        return 'warning';
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
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-bold text-[#1A3A2A] group-hover:text-[#2D5F3F] transition-colors leading-tight">
                {publication.title}
              </h3>
              {publication.url && (
                <a
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-1 text-[#5C6B5C] hover:text-[#2D5F3F] transition-colors"
                  aria-label="View publication"
                >
                  <HiExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>

            <div className="text-sm text-[#5C6B5C] mb-1">
              {publication.authors.join(', ')}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6B5C]">
              <Badge variant={getTypeColor()} size="sm">
                {publication.type}
              </Badge>
              {publication.venue && (
                <>
                  <span>•</span>
                  <span className="italic">{publication.venue}</span>
                </>
              )}
              <span>•</span>
              <span>{formatDate(publication.date)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {publication.abstract && (
        <CardContent>
          <p className="text-sm text-[#2C3E2C] leading-relaxed">
            {publication.abstract}
          </p>
        </CardContent>
      )}

      {publication.tags && publication.tags.length > 0 && (
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {publication.tags.map((tag, index) => (
              <Badge key={index} variant="outline" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
