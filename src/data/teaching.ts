// ============================================================================
// Outreach & Teaching Experience Data
// ============================================================================

import type { Experience } from '@/types';
import { orgs, subOrgs } from './orgs';

export const teaching: Record<string, Experience> = {
  uO_ta: {
    title: 'Teaching Assistant',
    org: orgs.uO,
    subOrg: subOrgs.uO_Bio,
    startDate: new Date('2025-09-01'),
    description: 'Assisted in teaching undergraduate biology laboratory courses, facilitating experiments, and grading assignments of 200+ students',
    highlights: [
      'BIO 2137: Introduction to Plant Science [F25] (80+ students)',
      'BIO 1140: Introduction to Cell and Molecular Biology [W26] (120+ students)',
    ],
    skills: ['Teaching', 'Science Communication', 'Laboratory Management', 'Mentorship'],
  },
  uw_chem_LA: {
    title: 'Chemistry Lab Assistant',
    org: orgs.UW,
    subOrg: subOrgs.UW_ChemOutreach,
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-04-30'),
    description: 'Facilitated chemistry experiments for high school students and maintained laboratory equipment',
    highlights: [
      'Led synthesis of acetaminophen experiments for high school students',
      'Prepared and maintained laboratory equipment and workspaces',
      'Mentored students in proper laboratory techniques',
    ],
    skills: ['Teaching', 'Science Communication', 'Laboratory Management', 'Mentorship'],
  },
  uw_es_museum: {
    title: 'Earth Sciences Museum Assistant',
    org: orgs.UW,
    subOrg: subOrgs.UW_ESMuseum,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-28'),
    description: 'Educated museum visitors about environmental issues including microplastics',
    highlights: [
      'Delivered interactive science activities for children',
      'Focused on recycling and microplastics education',
      'Engaged with visitors of all ages',
    ],
    skills: ['Public Engagement', 'Science Education', 'Environmental Outreach', 'Communication'],
  },
  uw_sci_open_house: {
    title: 'Science Open-House Assistant',
    org: orgs.UW,
    subOrg: subOrgs.UW_SciOutreach,
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-10-31'),
    description: 'Presented interactive physics demonstrations at the Science Open House',
    highlights: [
      'Explained key physics concepts through demonstrations',
      'Engaged with prospective students and families',
      'Represented the Faculty of Science',
    ],
    skills: ['Science Communication', 'Public Speaking', 'Demonstration Skills', 'Outreach'],
  },
  uw_athletics: {
    title: 'Biology Mentor',
    org: orgs.UW,
    subOrg: subOrgs.UW_Athletics,
    startDate: new Date('2022-09-01'),
    endDate: new Date('2023-04-30'),
    description: 'Provided one-on-one tutoring in cell biology and human physiology to 20+ student athletes',
    highlights: [
      'Tutored student athletes in cell biology',
      'Provided personalized instruction in human physiology',
      'Helped students balance academics and athletics',
    ],
    skills: ['Tutoring', 'Biology Education', 'One-on-One Instruction', 'Mentorship'],
  },
};
