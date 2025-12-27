// ============================================================================
// Talks & Presentations Data
// ============================================================================

import type { Talk } from '@/types';

export const talks: Talk[] = [
  // Add presentations and talks here as they occur
  // Example structure:
  // {
  //   id: 'presentation-id',
  //   title: 'Presentation Title',
  //   event: 'Conference Name',
  //   location: 'Location',
  //   date: 'YYYY-MM',
  //   type: 'presentation',
  //   description: 'Brief description',
  //   slides: 'url-to-slides',
  // },
  {
    id: 'path-2025',
    title: 'Presentation Title',
    event: {
      label: '1st Pursuits in Applied and Theoretical Science (PATH) Symposium',
      url: 'https://uwaterloo.ca/science/events/pursuits-applied-and-theoretical-science-path-symposium'
    },
    location: { 
      label: 'Federation Hall, University of Waterloo, Waterloo, ON',
      url: 'https://maps.app.goo.gl/4WbZj6hH7zwjEBn28',
     },
    date: new Date('2025-04-16'),
    type: 'poster',
    description: 'Brief description',
  },
];
