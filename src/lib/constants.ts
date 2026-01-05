// ============================================================================
// Constants and Configuration
// ============================================================================

import type { NavItem } from '@/types';

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
    label: 'Education',
    href: '/education',
    gardenIcon: '🌿', // herb
  },
  {
    label: 'Specializations',
    href: '/specializations',
    gardenIcon: '🍀', // four leaf clover
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
    label: 'Presentations',
    href: '/presentations',
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
