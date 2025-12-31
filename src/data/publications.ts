// ============================================================================
// Publications Data
// ============================================================================

import type { Publication } from '@/types';

export const publications: Record<string, Publication> = {
  honours_thesis_2025:
  {
    id: 'honours-thesis-2025',
    title: 'Investigating Subcellular Localization of <i>Arabidopsis thaliana</i> Hydroperoxide Lyase I (At4g15440)',
    authors: ['Asher Kim'],
    medium: 'University of Waterloo',
    date: new Date('2025-04-15'),
    type: 'Thesis',
    abstract: 'Research conducted under the supervision of Dr. Simon Chuong investigating protein subcellular localization mechanisms.',
    url: '/docs/asher-kim-thesis-honours-2025.pdf',
    tags: ['Protein Localization', 'GFP', 'Plant Biology', 'Molecular Biology'],
  },
};
