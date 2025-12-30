// ============================================================================
// Research Experience Data
// ============================================================================

import type { ResearchExperience } from '@/types';
import { orgs, subOrgs } from './orgs';

export const researchExperience: ResearchExperience[] = [
  {
    id: 'uwaterloo-wetland-lab',
    title: 'Research / Lab Assistant',
    org: orgs.UW,
    subOrg: subOrgs.UW_WetlandLab,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-12-01'),
    description: ['Contributed to carbon stock analysis following herbicide treatment of invasive Phragmites australis'],
    highlights: [
      'Processed soil cores and analyzed ~180 samples for carbon stock measurement',
      'Gained hands-on research experience in Dr. Rebecca Rooney\'s lab',
      'Trained by lab technician Megan Jordan',
    ],
    supervisor: {
      label: 'Dr. Rebecca Rooney',
      url: 'https://uwaterloo.ca/biology/profile/rrooney',
    },
    skills: ['Soil Analysis', 'Carbon Stock Measurement', 'Laboratory Techniques', 'Data Collection'],
  },
  {
    id: 'uwaterloo-bird-collision',
    title: 'Bird-Window Collision Monitor',
    org: orgs.UW,
    subOrg: subOrgs.UW_Sustainability,
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-11-01'),
    description: ['Documented bird-window collisions to support funding for bird-safe window designs'],
    highlights: [
      'Conducted surveys of 12 University of Waterloo buildings',
      'Reported collision data for bird-safe architectural funding applications',
      'Contributed to campus sustainability initiatives',
    ],
    skills: ['Field Surveys', 'Data Documentation', 'Wildlife Conservation', 'Sustainability Research'],
  },
];
