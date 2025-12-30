// ============================================================================
// Game World Data
// Defines all areas, NPCs, and interactive objects in the garden
// ============================================================================

import type { GameArea } from '@/types/game';
import { researchExperience } from '@/data/research';
import { publications } from '@/data/publications';

// ============================================================================
// Main Garden (Starting Area)
// ============================================================================

export const mainGarden: GameArea = {
  id: 'main-garden',
  name: 'Garden Entrance',
  description: 'The central hub of the research garden',
  bounds: { x: 0, y: 0, width: 1200, height: 800 },
  backgroundColor: 0x87CEEB, // Sky blue
  
  objects: [
    {
      id: 'welcome-sign',
      type: 'sign',
      x: 200,
      y: 400,
      title: 'Welcome!',
      content: "Welcome to Asher's Research Garden! Explore different areas to learn about research, education, and more. Use WASD or Arrow Keys to move around.",
    },
    {
      id: 'directory-sign',
      type: 'sign',
      x: 600,
      y: 300,
      title: 'Garden Directory',
      content: '🌱 North: Greenhouse (Research Interests)\n🔬 East: Laboratory (Research Experience)\n📚 South: Library (Publications)\n🎤 West: Amphitheatre (Talks)',
    },
  ],
  
  npcs: [
    {
      id: 'guide-cat',
      name: 'Professor Whiskers',
      sprite: 'cat',
      x: 400,
      y: 450,
      dialogues: [
        "Meow! I'm Professor Whiskers, your guide through this garden!",
        "Asher is studying plant biology at the University of Waterloo.",
        "Walk around and interact with objects to learn more about the research!",
        "Don't forget to visit all areas of the garden!",
      ],
      currentDialogue: 0,
    },
  ],
};

// ============================================================================
// Greenhouse (Research Interests / About)
// ============================================================================

export const greenhouse: GameArea = {
  id: 'greenhouse',
  name: 'Research Greenhouse',
  description: 'Where research interests bloom',
  bounds: { x: 0, y: 0, width: 1200, height: 800 },
  backgroundColor: 0x9DB8A1, // Sage green
  
  objects: [
    {
      id: 'research-plant-1',
      type: 'plant',
      x: 200,
      y: 400,
      title: 'Abiotic Stress Studies',
      content: 'Research focus: Plant physiological, metabolic, and genetic responses to abiotic stress. Understanding how plants adapt to environmental challenges.',
    },
    {
      id: 'research-plant-2',
      type: 'plant',
      x: 400,
      y: 350,
      title: 'Plant-Microbe Interactions',
      content: 'Investigating beneficial plant-microbe interactions and their role in plant health and resilience.',
    },
    {
      id: 'research-plant-3',
      type: 'plant',
      x: 600,
      y: 400,
      title: 'Protein Transport',
      content: 'Studying molecular mechanisms of protein subcellular transport in plant cells using GFP fusion constructs.',
    },
  ],
  
  npcs: [
    {
      id: 'research-cat',
      name: 'Dr. Mittens',
      sprite: 'cat',
      x: 500,
      y: 500,
      dialogues: [
        "Welcome to the greenhouse! This is where Asher's research interests grow.",
        "Did you know? Asher has a 93% GPA and has won multiple scholarships!",
        "The research here focuses on understanding plant biology at the molecular level.",
        "Check out the plants around here - each one represents a different research area!",
      ],
      currentDialogue: 0,
    },
  ],
};

// ============================================================================
// Laboratory (Research Experience)
// ============================================================================

export const laboratory: GameArea = {
  id: 'laboratory',
  name: 'Research Laboratory',
  description: 'Hands-on research happens here',
  bounds: { x: 0, y: 0, width: 1200, height: 800 },
  backgroundColor: 0xE8F5E9, // Light green
  
  objects: researchExperience.map((research, index) => ({
    id: `research-${research.id}`,
    type: 'computer' as const,
    x: 200 + (index * 250),
    y: 350,
    title: research.title,
    content: `${research.org} - ${research.subOrg}\n\n${research.description}\n\n${research.highlights?.join('\n• ') || ''}`,
  })),
  
  npcs: [
    {
      id: 'lab-cat',
      name: 'Lab Cat Luna',
      sprite: 'cat',
      x: 600,
      y: 500,
      dialogues: [
        "Meow! This is where Asher conducts research.",
        "Asher has worked on wetland ecology and bird conservation projects!",
        "Check out the computers to learn about specific research experiences.",
        "Science is all about curiosity and careful observation - just like cats!",
      ],
      currentDialogue: 0,
    },
  ],
};

// ============================================================================
// Library (Publications)
// ============================================================================

export const library: GameArea = {
  id: 'library',
  name: 'Garden Library',
  description: 'Knowledge preserved in written form',
  bounds: { x: 0, y: 0, width: 1200, height: 800 },
  backgroundColor: 0xFFF8E1, // Cream
  
  objects: publications.map((pub, index) => ({
    id: `pub-${pub.id}`,
    type: 'book' as const,
    x: 300 + (index * 200),
    y: 350,
    title: pub.title,
    content: `${pub.authors.join(', ')}\n\n${pub.abstract || pub.medium || ''}\n\nType: ${pub.type}\nDate: ${pub.date}`,
  })),
  
  npcs: [
    {
      id: 'library-cat',
      name: 'Librarian Patches',
      sprite: 'cat',
      x: 400,
      y: 550,
      dialogues: [
        "Shhh... Welcome to the library! 📚",
        "Asher's thesis investigates protein subcellular localization using GFP fusion constructs.",
        "Check out the books on the shelves to read about publications!",
        "More publications will appear here as research continues!",
      ],
      currentDialogue: 0,
    },
  ],
};

// ============================================================================
// All Areas Export
// ============================================================================

export const gameAreas: GameArea[] = [
  mainGarden,
  greenhouse,
  laboratory,
  library,
];

export const getAreaById = (id: string): GameArea | undefined => {
  return gameAreas.find(area => area.id === id);
};
