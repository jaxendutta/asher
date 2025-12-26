// ============================================================================
// Education Data
// ============================================================================

import type { Education } from '@/types';

export const education: Education[] = [
  {
    id: 'uottawa-biology',
    institution: 'University of Ottawa',
    degree: 'Master of Science (MSc) in Biology',
    field: 'Honours Biology',
    location: 'Ottawa, ON',
    startDate: 'September 2025',
    endDate: 'April 2027',
    gpa: 'In progress',
    thesis: {
      title:'Investigating regions involved in subcellular localization of an undisclosed protein using a GFP fusion construct',
      supervisor: 'Dr. Marina Cvetkovska',
      supervisorLink: 'https://www.uottawa.ca/faculty-science/professors/marina-cvetkovska',
    },
    awards: [
      'President\'s Scholarship of Distinction',
      'Purdy Crawford Undergraduate Scholarship',
      'Science Memorial Scholarship',
      'Excelling Standing Term Distinctions (8 terms)',
    ],
  },
  {
    id: 'uwaterloo-biology',
    institution: 'University of Waterloo',
    degree: 'Bachelor of Science (BSc) in Biology',
    field: 'Honours Biology',
    location: 'Waterloo, ON',
    startDate: 'September 2021',
    endDate: 'April 2025',
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
      'Excelling Standing Term Distinctions (8 terms)',
    ],
  },
];
