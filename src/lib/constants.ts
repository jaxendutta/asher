// ============================================================================
// Constants and Configuration
// ============================================================================

import type { GardenTheme, NavItem } from '@/types';

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

// ---------- Garden Theme ----------

export const GARDEN_THEME: GardenTheme = {
  colors: {
    primary: COLORS.forest,
    secondary: COLORS.sage,
    accent: COLORS.lavender,
    background: COLORS.offWhite,
    foreground: COLORS.charcoal,
    muted: COLORS.stone,
    border: COLORS.mint,
  },
  fonts: {
    heading: 'var(--font-geist-sans)',
    body: 'var(--font-geist-sans)',
    mono: 'var(--font-geist-mono)',
  },
  animations: {
    bloomDuration: 800,
    growthDuration: 1200,
    transitionDuration: 300,
  },
};

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
    label: 'Outreach',
    href: '/outreach',
    gardenIcon: '🌻', // sunflower
  },
  {
    label: 'Contact',
    href: '/contact',
    gardenIcon: '🍃', // leaves
  },
];

// ---------- Animation Durations ----------

export const ANIMATION = {
  // Durations in ms
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
  
  // Bloom animations
  bloomDelay: 100, // stagger delay between items
  bloomDuration: 600,
  
  // Growth animations
  growthDuration: 1000,
  
  // Cat animations
  catWalkSpeed: 2000,
  catIdleDuration: 3000,
  
  // Page transitions
  pageTransition: 400,
} as const;

// ---------- Z-Index Layers ----------

export const Z_INDEX = {
  base: 0,
  garden: 1,
  content: 10,
  navigation: 50,
  catCompanion: 60,
  modal: 100,
  cursor: 9999,
} as const;

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

// ---------- Cat Easter Egg Config ----------

export const CAT_CONFIG = {
  showProbability: 0.3, // 30% chance to show cat on page
  walkInterval: 15000, // cat walks across every 15 seconds
  hideAfterWalk: true,
  easterEggKey: 'KeyC', // press 'C' to summon cat
} as const;

// ---------- Social Links ----------

export const SOCIAL_LINKS = [
  {
    label: 'Email',
    url: 'mailto:rkim070@uottawa.ca',
    icon: 'mail',
    type: 'social' as const,
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/kimasher',
    icon: 'linkedin',
    type: 'social' as const,
  },
  {
    label: 'GitHub',
    url: '#', // To be added if Asher has one
    icon: 'github',
    type: 'social' as const,
  },
] as const;

// ---------- Research Interests ----------

export const RESEARCH_INTERESTS = [
  'Plant physiological, metabolic, and genetic responses to abiotic stress',
  'Beneficial plant-microbe interactions',
  'Molecular mechanisms of protein subcellular transport in plant cells',
] as const;
