// ============================================================================
// Animation Utilities
// ============================================================================

import { ANIMATION } from './constants';

/**
 * Get bloom animation CSS properties
 */
export function getBloomAnimation(delay: number = 0): React.CSSProperties {
  return {
    animationName: 'bloom',
    animationDuration: `${ANIMATION.bloomDuration}ms`,
    animationDelay: `${delay}ms`,
    animationFillMode: 'both',
    animationTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  };
}

/**
 * Get growth animation CSS properties
 */
export function getGrowthAnimation(duration: number = ANIMATION.growthDuration): React.CSSProperties {
  return {
    animationName: 'grow',
    animationDuration: `${duration}ms`,
    animationFillMode: 'both',
    animationTimingFunction: 'ease-out',
  };
}

/**
 * Get fade-in animation CSS properties
 */
export function getFadeInAnimation(delay: number = 0, duration: number = ANIMATION.normal): React.CSSProperties {
  return {
    animationName: 'fadeIn',
    animationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
    animationFillMode: 'both',
    animationTimingFunction: 'ease-in',
  };
}

/**
 * Get slide-up animation CSS properties
 */
export function getSlideUpAnimation(delay: number = 0): React.CSSProperties {
  return {
    animationName: 'slideUp',
    animationDuration: `${ANIMATION.slow}ms`,
    animationDelay: `${delay}ms`,
    animationFillMode: 'both',
    animationTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  };
}

/**
 * Calculate staggered delay for items in a list
 */
export function getStaggerDelay(index: number, baseDelay: number = ANIMATION.bloomDelay): number {
  return index * baseDelay;
}

/**
 * Spring animation configuration
 */
export const springConfig = {
  stiff: {
    tension: 300,
    friction: 20,
  },
  gentle: {
    tension: 120,
    friction: 14,
  },
  wobbly: {
    tension: 180,
    friction: 12,
  },
  slow: {
    tension: 280,
    friction: 60,
  },
};

/**
 * Easing functions
 */
export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
  easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

/**
 * Create keyframe animation
 */
export function createKeyframeAnimation(name: string, keyframes: string): string {
  return `
    @keyframes ${name} {
      ${keyframes}
    }
  `;
}

/**
 * Predefined keyframes
 */
export const keyframes = {
  bloom: `
    from {
      opacity: 0;
      transform: scale(0.8) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  `,
  grow: `
    from {
      transform: scaleY(0);
      transform-origin: bottom;
    }
    to {
      transform: scaleY(1);
      transform-origin: bottom;
    }
  `,
  fadeIn: `
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `,
  slideUp: `
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,
  shimmer: `
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  `,
  float: `
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  `,
  sway: `
    0%, 100% {
      transform: rotate(-2deg);
    }
    50% {
      transform: rotate(2deg);
    }
  `,
  pulse: `
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  `,
};

/**
 * Generate transition CSS
 */
export function generateTransition(
  properties: string[] = ['all'],
  duration: number = ANIMATION.normal,
  easing: string = easings.easeInOut
): string {
  return properties
    .map(prop => `${prop} ${duration}ms ${easing}`)
    .join(', ');
}
