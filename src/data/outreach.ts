// ============================================================================
// Outreach & Teaching Experience Data
// ============================================================================

import type { ResearchExperience } from '@/types';

export const outreachExperience: ResearchExperience[] = [
  {
    id: 'chemistry-lab-assistant',
    title: 'Chemistry Lab Assistant',
    org: {
      label: 'University of Waterloo',
      url: 'https://uwaterloo.ca/',
    },
    lab: {
      label: 'Chemistry Community Outreach',
      url: 'https://uwaterloo.ca/chemistry/community-outreach',
    },
    location: 'Waterloo, ON',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-04-30'),
    description: [
      'Facilitated chemistry experiments for high school students and maintained laboratory equipment',
    ],
    highlights: [
      'Led synthesis of acetaminophen experiments for high school students',
      'Prepared and maintained laboratory equipment and workspaces',
      'Mentored students in proper laboratory techniques',
    ],
    skills: ['Teaching', 'Science Communication', 'Laboratory Management', 'Mentorship'],
  },
  {
    id: 'earth-sciences-museum',
    title: 'Earth Sciences Museum Assistant',
    org: {
      label: 'University of Waterloo',
      url: 'https://uwaterloo.ca/',
    },
    lab: {
      label: 'Earth Sciences Museum',
      url: 'https://uwaterloo.ca/earth-sciences-museum/',
    },
    location: 'Waterloo, ON',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-28'),
    description: ['Educated museum visitors about environmental issues including microplastics'],
    highlights: [
      'Delivered interactive science activities for children',
      'Focused on recycling and microplastics education',
      'Engaged with visitors of all ages',
    ],
    skills: ['Public Engagement', 'Science Education', 'Environmental Outreach', 'Communication'],
  },
  {
    id: 'science-open-house',
    title: 'Science Open-House Assistant',
    org: {
      label: 'University of Waterloo',
      url: 'https://uwaterloo.ca/',
    },
    lab: {
      label: 'Science Community Outreach',
      url: 'https://uwaterloo.ca/science/outreach',
    },
    location: 'Waterloo, ON',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-10-31'),
    description: ['Presented interactive physics demonstrations at the Science Open House'],
    highlights: [
      'Explained key physics concepts through demonstrations',
      'Engaged with prospective students and families',
      'Represented the Faculty of Science',
    ],
    skills: ['Science Communication', 'Public Speaking', 'Demonstration Skills', 'Outreach'],
  },
  {
    id: 'biology-mentor',
    title: 'Biology Mentor',
    org: {
      label: 'University of Waterloo',
      url: 'https://uwaterloo.ca/',
    },
    lab: {
      label: 'Department of Athletics',
      url: 'https://athletics.uwaterloo.ca/',
    },
    location: 'Waterloo, ON',
    startDate: new Date('2022-09-01'),
    endDate: new Date('2023-04-30'),
    description: ['Provided one-on-one tutoring in cell biology and human physiology to student athletes'],
    highlights: [
      'Tutored student athletes in cell biology',
      'Provided personalized instruction in human physiology',
      'Helped students balance academics and athletics',
    ],
    skills: ['Tutoring', 'Biology Education', 'One-on-One Instruction', 'Mentorship'],
  },
];
