// ============================================================================
// Research Experience Data
// ============================================================================

import type { Experience } from '@/types';
import { orgs, subOrgs } from './orgs';
import { talks } from './talks';

export const researchExperience: Record<string, Experience> = {
  uO_thesis: {
    title: 'Graduate Researcher Student ',
    org: orgs.uO,
    subOrg: subOrgs.uO_CvetkovskaLab,
    startDate: new Date('2025-09-01'),
    description: 'Alleviating Waterlogging Stress in Barley by Applying Plant Growth-Promoting Microbes (PGPMs)',
    highlights: [
      'Designing experiments to assess plant stress responses',
      'Utilizing molecular biology techniques to analyze gene expression',
      'Collaborating with lab members on data collection and analysis',
    ],
    skills: ['Plant Physiology', 'Molecular Biology', 'Data Analysis'],
    talks: [talks.uogradflix_2025_26]
  },
  uw_thesis: {
    title: 'Honours Thesis Researcher Student',
    org: orgs.UW,
    subOrg: subOrgs.UW_ChuongLab,
    startDate: new Date('2024-09-01'),
    endDate: new Date('2025-04-30'),
    description: 'Investigated subcellular localization of Hydroperoxide Lyase I in Arabidopsis thaliana using GFP tagging and confocal microscopy.',
    highlights: [
      'Designed experiments to determine protein localization patterns',
      'Utilized confocal microscopy for cellular imaging',
      'Analyzed data on protein function in plant stress responses',
    ],
    skills: ['Molecular Cloning', 'Plant Transformation', 'Confocal Microscopy'],
    talks: [talks.uw_showcase_2025, talks.path_2025],
  },
  uw_wetland_lab: {
    title: 'Research / Lab Assistant',
    org: orgs.UW,
    subOrg: subOrgs.UW_WetlandLab,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-12-01'),
    description: 'Contributed to carbon stock analysis following herbicide treatment of invasive Phragmites australis.',
    highlights: [
      'Processed and analyzed ~180 soil samples for carbon stock measurement',
      'Trained by lab technician Megan Jordan',
    ],
    skills: ['Soil Analysis', 'Carbon Stock Measurement', 'Lab Techniques'],
  },
  uw_bird_collision: {
    title: 'Bird-Window Collision Monitor',
    org: orgs.UW,
    subOrg: subOrgs.UW_SER,
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-11-01'),
    description: 'Documented bird-window collisions to support funding for bird-safe window designs.',
    highlights: [
      'Surveyed 12+ University of Waterloo buildings',
      'Reported collision data for bird-safe architectural funding',
    ],
    skills: ['Field Surveys', 'Data Documentation', 'Wildlife Conservation'],
  },
};
