export interface PlantConfig {
  type: 'flower' | 'shrub' | 'tree' | 'vine';
  growthSpeed: number; // milliseconds
  bloomDelay?: number;
  color: string;
  size: 'small' | 'medium' | 'large';
}

export interface GardenSection {
  id: string;
  name: string;
  path: string;
  plantType: PlantConfig['type'];
  description: string;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface CatState {
  position: { x: number; y: number };
  mood: 'sleeping' | 'walking' | 'playing' | 'watching';
  direction: 'left' | 'right';
}
