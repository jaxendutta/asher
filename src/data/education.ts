// ============================================================================
// Education Data
// ============================================================================

import type { Education } from '@/types';
import { people } from './orgs';

export const education: Education[] = [
  {
    id: 'uottawa-biology',
    institution: 'University of Ottawa',
    degree: 'Master of Science',
    degree_abbr: 'MSc',
    field: 'Biology',
    location: { 
      label: 'Ottawa, ON',
      mapUrl: 'https://maps.app.goo.gl/fTPpvkTadhk7SRiJ6',
    },
    startDate: new Date('2025-09-01'),
    endDate: new Date('2027-04-01'),
    thesis: {
      title:'Investigating regions involved in subcellular localization of an undisclosed protein using a GFP fusion construct',
      supervisor: people.marinaCvetkovska,
    },
    awards: [
      'President\'s Scholarship of Distinction',
    ],
  },
  {
    id: 'uw_biology',
    institution: 'University of Waterloo',
    degree: 'Bachelor of Science',
    degree_abbr: 'BSc',
    field: 'Honours Biology',
    location: { 
      label: 'Waterloo, ON',
      mapUrl: 'https://maps.app.goo.gl/KMeDQQRfvthmS6cH9',
    },
    startDate: new Date('2021-09-01'),
    endDate: new Date('2025-04-01'),
    gpa: '93/100',
    thesis: {
      title:'Investigating regions involved in subcellular localization of an undisclosed protein using a GFP fusion construct',
      supervisor: people.simonChuong,
    },
    awards: [
      'President\'s Scholarship of Distinction',
      'Purdy Crawford Undergraduate Scholarship',
      'Science Memorial Scholarship',
      'Excellent Standing Term Distinctions (8 terms)',
      'IDEAL Scholar Recipient',
    ],
  },
];
