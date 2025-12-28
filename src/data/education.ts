// ============================================================================
// Education Data
// ============================================================================

import type { Education } from '@/types';

export const education: Education[] = [
  {
    id: 'uottawa-biology',
    institution: 'University of Ottawa',
    degree: 'Master of Science - MSc (Biology)',
    field: 'Honours Biology',
    location: { 
      label: 'Ottawa, ON',
      url: 'https://maps.app.goo.gl/fTPpvkTadhk7SRiJ6',
    },
    startDate: new Date('2025-09-01'),
    endDate: new Date('2027-04-01'),
    gpa: 'In progress',
    thesis: {
      title:'Investigating regions involved in subcellular localization of an undisclosed protein using a GFP fusion construct',
      supervisor: 'Dr. Marina Cvetkovska',
      supervisorLink: 'https://www.uottawa.ca/faculty-science/professors/marina-cvetkovska',
    },
    awards: [
      'President\'s Scholarship of Distinction',
    ],
  },
  {
    id: 'uwaterloo-biology',
    institution: 'University of Waterloo',
    degree: 'Bachelor of Science - BSc (Biology)',
    field: 'Honours Biology',
    location: { 
      label: 'Waterloo, ON',
      url: 'https://maps.app.goo.gl/KMeDQQRfvthmS6cH9',
    },
    startDate: new Date('2021-09-01'),
    endDate: new Date('2025-04-01'),
    gpa: '93/100',
    thesis: {
      title:'Investigating regions involved in subcellular localization of an undisclosed protein using a GFP fusion construct',
      supervisor: 'Dr. Simon Chuong',
      supervisorLink: 'https://uwaterloo.ca/biology/profile/schuong',
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
