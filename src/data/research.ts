// ============================================================================
// Research Experience Data
// ============================================================================

import type { ResearchExperience } from '@/types';

export const researchExperience: ResearchExperience[] = [
  {
    id: 'uwaterloo-wetland-lab',
    position: 'Research / Lab Assistant',
    institution: 'University of Waterloo',
    lab: 'Waterloo Wetland Lab',
    labUrl: 'https://uwaterloo.ca/rooney-lab/',
    location: 'Waterloo, ON',
    startDate: 'Feb 2024',
    endDate: 'Dec 2024',
    description: 'Contributed to carbon stock analysis following herbicide treatment of invasive Phragmites australis',
    highlights: [
      'Processed soil cores and analyzed ~180 samples for carbon stock measurement',
      'Gained hands-on research experience in Dr. Rebecca Rooney\'s lab',
      'Trained by lab technician Megan Jordan',
    ],
    supervisor: {
      name: 'Dr. Rebecca Rooney',
      link: 'https://uwaterloo.ca/biology/profile/rrooney',
    },
    skills: ['Soil Analysis', 'Carbon Stock Measurement', 'Laboratory Techniques', 'Data Collection'],
  },
  {
    id: 'uwaterloo-bird-collision',
    position: 'Bird-Window Collision Monitor',
    institution: 'University of Waterloo',
    lab: 'Society for Ecological Restoration',
    labUrl: 'https://uwaterloo.ca/sustainability/programs/student-groups',
    location: 'Waterloo, ON',
    startDate: 'Sep 2024',
    endDate: 'Nov 2024',
    description: 'Documented bird-window collisions to support funding for bird-safe window designs',
    highlights: [
      'Conducted surveys of 12 University of Waterloo buildings',
      'Reported collision data for bird-safe architectural funding applications',
      'Contributed to campus sustainability initiatives',
    ],
    skills: ['Field Surveys', 'Data Documentation', 'Wildlife Conservation', 'Sustainability Research'],
  },
];
