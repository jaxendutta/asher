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
    id: 'uogradflix-2025-26',
    title: 'Exploring the Subcellular Localization of Hydroperoxide Lyase I (At4g15440) in <i>Arabidopsis thaliana</i>',
    event: {
      label: 'uOGRADflix 2025-2026',
      url: 'https://www.uottawa.ca/study/graduate-studies/uogradflix-competition',
    },
    location: {
      label: 'University of Ottawa',
      url: 'https://www.uottawa.ca/en',
    },
    date: new Date('2025-11-12'),
    type: 'Presentation',
    video: [{
      label: 'YouTube Video',
      url: 'https://youtu.be/Wrqo4ujlwKw',
    }],
  },
  {
    id: 'path-2025',
    title: 'Investigating Subcellular Localization of <i>Arabidopsis thaliana</i> Hydroperoxide Lyase I (At4g15440)',
    event: {
      label: '1st Pursuits in Applied and Theoretical Science (PATH) Symposium',
      url: 'https://uwaterloo.ca/science/events/pursuits-applied-and-theoretical-science-path-symposium'
    },
    location: {
      label: 'Federation Hall, University of Waterloo',
      url: 'https://maps.app.goo.gl/4WbZj6hH7zwjEBn28',
    },
    date: new Date('2025-04-16'),
    type: 'Poster',
    poster: {
      label: 'Poster[PDF]',
      url: '/docs/asher-kim-poster-2025.pdf',
    },
  },
  {
    id: 'uw-showcase-2025',
    title: 'Investigating Subcellular Localization of <i>Arabidopsis thaliana</i> Hydroperoxide Lyase I (At4g15440)',
    event: {
      label: 'Biology Senior Honours Thesis: Poster Showcase',
    },
    location: {
      label: 'Science Teaching Complex, University of Waterloo',
      url: 'https://maps.app.goo.gl/XCzJ63TDJ7dPrNxk8',
    },
    date: new Date('2025-04-04'),
    type: 'Poster',
    poster: {
      label: 'Poster[PDF]',
      url: '/docs/asher-kim-poster-2025.pdf',
    },
  },
];
