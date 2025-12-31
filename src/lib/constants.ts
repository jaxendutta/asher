// ============================================================================
// Constants and Configuration
// ============================================================================

import type { NavItem } from '@/types';
import { BsEnvelopeHeart, BsLinkedin, BsFileEarmarkText } from 'react-icons/bs';

// ---------- Color Palette ----------
// Inspired by natural garden colors with cat-friendly accents

export const COLORS = {
  // Primary greens (plant/garden theme)
  sage: '#9DB8A1',
  forest: '#2D5F3F',
  moss: '#6B8F71',
  mint: '#B8D4BE',
  
  // Earth tones
  soil: '#5C4033',
  sand: '#C2B280',
  stone: '#8B8680',
  
  // Accent colors (flowers & cats)
  lavender: '#967BB6',
  peach: '#FFB07C',
  cream: '#F4EBD0',
  catGray: '#9CA3AF',
  
  // Neutrals
  white: '#FFFFFF',
  offWhite: '#FAFAF9',
  darkGreen: '#1A3A2A',
  charcoal: '#2C2C2C',
  
  // Functional
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

// ---------- Breakpoints ----------

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ---------- Navigation Items ----------

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'About',
    href: '/about',
    gardenIcon: '🌱', // seedling
  },
  {
    label: 'Education',
    href: '/education',
    gardenIcon: '🌿', // herb
  },
  {
    label: 'Research',
    href: '/research',
    gardenIcon: '🌳', // tree
  },
  {
    label: 'Publications',
    href: '/publications',
    gardenIcon: '🌸', // cherry blossom
  },
  {
    label: 'Talks',
    href: '/talks',
    gardenIcon: '🌺', // hibiscus
  },
  {
    label: 'Teaching + Outreach',
    href: '/teaching',
    gardenIcon: '🌻', // sunflower
  },
  {
    label: 'Contact',
    href: '/contact',
    gardenIcon: '🍃', // leaves
  },
];

// ---------- Layout Sizes ----------

export const LAYOUT = {
  maxWidth: '1280px',
  headerHeight: '80px',
  footerHeight: '120px',
  sidebarWidth: '280px',
  containerPadding: {
    sm: '1rem',
    md: '2rem',
    lg: '3rem',
  },
} as const;

// ---------- Social Links ----------

export const SOCIAL_LINKS = {
  email: {
    label: 'Email',
    url: 'mailto:rkim070@uottawa.ca',
    id: 'rkim070@uottawa.ca',
    icon: BsEnvelopeHeart,
  },
  linkedin: {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/kimasher',
    id: 'kimasher',
    icon: BsLinkedin,
  },
  resume: {
    label: 'Résumé',
    url: 'https://docs.google.com/viewer?url=https://docs.google.com/document/d/1Mq_v4v8Nd1nbFrKElQU8YtIwzPFQUonz4XdLpT_5vQ0/export?format=pdf',
    icon: BsFileEarmarkText,
  }
 } as const;

// ---------- Research Interests ----------

export const RESEARCH_INTERESTS = [
  'Plant physiological, metabolic, and genetic responses to abiotic stress',
  'Beneficial plant-microbe interactions',
  'Molecular mechanisms of protein subcellular transport in plant cells',
] as const;
