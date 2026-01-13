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
    description: 'Assisted in teaching undergraduate biology laboratory courses, facilitating experiments, and grading assignments of 180+ students',
    highlights: [
      'BIO 2137: Introduction to Plant Science [F25] (70+ students)',
      'BIO 1140: Introduction to Cell and Molecular Biology [W26] (110+ students)',
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
      'Mentored students in proper laboratory techniques through acetaminophen synthesis experiments',
      'Helped orient and introduce prospective students to a university laboratory setting',
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
      'Explained electrostatics basics through demonstrations',
      'Represented the Faculty of Science while engaging with prospective students and families',
    ],
    skills: ['Science Communication', 'Public Speaking', 'Demonstration Skills', 'Outreach'],
  },
  uw_athletics: {
    title: 'Biology Tutor',
    org: orgs.UW,
    subOrg: subOrgs.UW_Athletics,
    startDate: new Date('2022-09-01'),
    endDate: new Date('2023-04-30'),
    description: 'Provided one-on-one tutoring in cell biology and human physiology to student athletes',
    highlights: [
      'Provided personalized instruction in university cell biology and human physiology courses',
      'Helped students balance academics and athletics',
    ],
    skills: ['Tutoring', 'Biology Education', 'One-on-One Instruction', 'Mentorship'],
  },
};
