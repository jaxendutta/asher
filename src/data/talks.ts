// ============================================================================
// Talks & Presentations Data
// ============================================================================
/* Add presentations and talks here as they occur
Example structure:
{
  id: 'presentation-id',
  title: 'Presentation Title',
  event: 'Conference Name',
  location: 'Location',
  date: 'YYYY-MM',
  type: 'presentation',
  description: 'Brief description',
  slides: 'url-to-slides',
},*/

import type { Presentation } from '@/types';
import { orgs } from './orgs';

export const talks: Record<string, Presentation> = {
  uogradflix_2025_26: {
  title: 'Alleviating Waterlogging Stress in Barley by Applying Plant Growth-Promoting Microbes (PGPMs)',
    event: {
      label: 'uOGRADflix 2025-2026',
      url: 'https://www.uottawa.ca/study/graduate-studies/uogradflix-competition',
    },
    host: orgs.uOttawa,
    date: new Date('2025-11-12'),
    type: 'Video',
    video: [{
      label: 'YouTube Video',
      url: 'https://youtu.be/Wrqo4ujlwKw',
    }],
  },
  path_2025: {
    title: 'Investigating Subcellular Localization of <i>Arabidopsis thaliana</i> Hydroperoxide Lyase I (At4g15440)',
    event: {
      label: '1st Pursuits in Applied and Theoretical Science (PATH) Symposium',
      shortLabel: '1st PATH Symposium',
      url: 'https://uwaterloo.ca/science/events/pursuits-applied-and-theoretical-science-path-symposium'
    },
    host: orgs.UW,
    date: new Date('2025-04-16'),
    type: 'Poster',
    poster: {
      label: 'Poster[PDF]',
      url: '/docs/asher-kim-poster-2025.pdf',
    },
  },
  uw_showcase_2025: {
    title: 'Investigating Subcellular Localization of <i>Arabidopsis thaliana</i> Hydroperoxide Lyase I (At4g15440)',
    event: {
      label: 'Senior Honours Thesis Showcase',
      url: 'https://uwaterloo.ca/biology/undergraduate-studies/biol-499-senior-honours-project'
    },
    host: orgs.UW,
    date: new Date('2025-04-04'),
    type: 'Poster',
    poster: {
      label: 'Poster[PDF]',
      url: '/docs/asher-kim-poster-2025.pdf',
    },
  },
};
