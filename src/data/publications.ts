// ============================================================================
// Publications Data
// ============================================================================

import type { Publication } from '@/types';

export const publications: Publication[] = [
  // Thesis
  {
    id: 'honours-thesis-2025',
    title: 'Investigating regions involved in subcellular localization of an undisclosed protein using a GFP fusion construct',
    authors: ['Asher Kim'],
    medium: 'Honours Thesis, University of Waterloo',
    date: new Date('2025-04-15'),
    type: 'Thesis',
    abstract: 'Research conducted under the supervision of Dr. Simon Chuong investigating protein subcellular localization mechanisms.',
    url: '/docs/asher-kim-thesis-honours-2025.pdf',
    tags: ['Protein Localization', 'GFP', 'Plant Biology', 'Molecular Biology'],
  },
  // Add future publications here
];
