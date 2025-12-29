// ============================================================================
// Game Utilities
// Helper functions for creating game objects and sprites
// ============================================================================

import * as PIXI from 'pixi.js';
import type { InteractiveObject, NPCData } from '@/types/game';
import { assetLoader } from './assetLoader';

// ============================================================================
// Sprite Creators (Using Loaded Textures)
// ============================================================================

export function createPlayer(): PIXI.Container {
  const container = new PIXI.Container();
  
  // Try to use loaded character sprite
  const mainCharTexture = assetLoader.assets.characters.main;
  
  if (mainCharTexture) {
    // Assuming the sprite sheet has 4 frames (down, up, left, right)
    // Or it might be a single frame - we'll handle both
    const sprite = new PIXI.Sprite(mainCharTexture);
    
    // Scale to appropriate size (adjust based on your sprite size)
    sprite.anchor.set(0.5, 1); // Anchor at bottom center
    sprite.scale.set(2); // Scale up if needed
    
    container.addChild(sprite);
    
    // Store original texture for animation later
    (container as any).baseTexture = mainCharTexture;
  } else {
    // Fallback to geometric player if texture not loaded
    const body = new PIXI.Graphics();
    body.rect(-12, -25, 24, 35);
    body.fill(0x6B8E23);
    
    const head = new PIXI.Graphics();
    head.circle(0, -30, 12);
    head.fill(0xFFB07C);
    
    const leftEye = new PIXI.Graphics();
    leftEye.circle(-4, -32, 2);
    leftEye.fill(0x000000);
    
    const rightEye = new PIXI.Graphics();
    rightEye.circle(4, -32, 2);
    rightEye.fill(0x000000);
    
    container.addChild(body);
    container.addChild(head);
    container.addChild(leftEye);
    container.addChild(rightEye);
  }
  
  return container;
}

export function createCat(color: number = 0xFFB07C): PIXI.Container {
  const container = new PIXI.Container();
  
  // Body
  const body = new PIXI.Graphics();
  body.ellipse(0, 0, 20, 15);
  body.fill(color);
  
  // Head
  const head = new PIXI.Graphics();
  head.circle(0, -15, 12);
  head.fill(color);
  
  // Ears
  const leftEar = new PIXI.Graphics();
  leftEar.moveTo(-8, -22);
  leftEar.lineTo(-12, -28);
  leftEar.lineTo(-6, -24);
  leftEar.fill(color);
  
  const rightEar = new PIXI.Graphics();
  rightEar.moveTo(8, -22);
  rightEar.lineTo(12, -28);
  rightEar.lineTo(6, -24);
  rightEar.fill(color);
  
  // Eyes
  const leftEye = new PIXI.Graphics();
  leftEye.circle(-4, -16, 2);
  leftEye.fill(0x2C3E2C);
  
  const rightEye = new PIXI.Graphics();
  rightEye.circle(4, -16, 2);
  rightEye.fill(0x2C3E2C);
  
  // Tail
  const tail = new PIXI.Graphics();
  tail.moveTo(15, 0);
  tail.bezierCurveTo(20, -5, 25, -8, 28, -2);
  tail.stroke({ width: 4, color });
  
  container.addChild(tail);
  container.addChild(body);
  container.addChild(head);
  container.addChild(leftEar);
  container.addChild(rightEar);
  container.addChild(leftEye);
  container.addChild(rightEye);
  
  return container;
}

export function createSign(text: string = '📋'): PIXI.Container {
  const container = new PIXI.Container();
  
  // Post
  const post = new PIXI.Graphics();
  post.rect(-3, 0, 6, 40);
  post.fill(0x5C4033); // Brown
  
  // Board
  const board = new PIXI.Graphics();
  board.roundRect(-35, -25, 70, 30, 4);
  board.fill(0x8B7355);
  board.stroke({ width: 2, color: 0x5C4033 });
  
  // Icon/Emoji
  const icon = new PIXI.Text({
    text,
    style: {
      fontSize: 24,
      fontFamily: 'Arial',
    }
  });
  icon.anchor.set(0.5);
  icon.y = -10;
  
  container.addChild(post);
  container.addChild(board);
  container.addChild(icon);
  
  return container;
}

export function createPlant(type: 'small' | 'medium' | 'large' = 'medium'): PIXI.Container {
  const container = new PIXI.Container();
  
  const sizes = {
    small: { pot: 15, plant: 20 },
    medium: { pot: 20, plant: 30 },
    large: { pot: 25, plant: 40 },
  };
  
  const size = sizes[type];
  
  // Pot
  const pot = new PIXI.Graphics();
  pot.moveTo(-size.pot, 0);
  pot.lineTo(-size.pot * 0.7, size.pot);
  pot.lineTo(size.pot * 0.7, size.pot);
  pot.lineTo(size.pot, 0);
  pot.fill(0x8B4513); // Terracotta
  
  // Plant (leaves)
  const leaves = new PIXI.Graphics();
  leaves.circle(0, -size.plant * 0.3, size.plant * 0.4);
  leaves.fill(0x6B8E23); // Green
  
  const leaf1 = new PIXI.Graphics();
  leaf1.ellipse(-size.plant * 0.3, -size.plant * 0.5, size.plant * 0.25, size.plant * 0.15);
  leaf1.fill(0x6B8E23);
  
  const leaf2 = new PIXI.Graphics();
  leaf2.ellipse(size.plant * 0.3, -size.plant * 0.5, size.plant * 0.25, size.plant * 0.15);
  leaf2.fill(0x6B8E23);
  
  // Flower (optional)
  const flower = new PIXI.Graphics();
  flower.circle(0, -size.plant * 0.7, size.plant * 0.15);
  flower.fill(0xFFB6C1); // Pink
  
  container.addChild(pot);
  container.addChild(leaves);
  container.addChild(leaf1);
  container.addChild(leaf2);
  container.addChild(flower);
  
  return container;
}

export function createBook(bookNumber: number = 1): PIXI.Container {
  const container = new PIXI.Container();
  
  // Try to use loaded book sprite
  const bookKey = `book${Math.min(bookNumber, 3)}` as keyof typeof assetLoader.assets.objects;
  const bookTexture = assetLoader.assets.objects[bookKey];
  
  if (bookTexture) {
    const sprite = new PIXI.Sprite(bookTexture);
    sprite.anchor.set(0.5);
    sprite.scale.set(2); // Adjust scale as needed
    container.addChild(sprite);
  } else {
    // Fallback to geometric book
    const book = new PIXI.Graphics();
    book.roundRect(-15, -20, 30, 40, 2);
    book.fill(0x8B4513);
    book.stroke({ width: 1, color: 0x5C4033 });
    
    const pages = new PIXI.Graphics();
    pages.rect(-13, -18, 26, 36);
    pages.fill(0xFFF8DC);
    
    const icon = new PIXI.Text({
      text: '📖',
      style: { fontSize: 20 }
    });
    icon.anchor.set(0.5);
    icon.y = 0;
    
    container.addChild(book);
    container.addChild(pages);
    container.addChild(icon);
  }
  
  return container;
}

export function createComputer(): PIXI.Container {
  const container = new PIXI.Container();
  
  // Monitor
  const monitor = new PIXI.Graphics();
  monitor.roundRect(-25, -30, 50, 40, 4);
  monitor.fill(0x2C3E2C); // Dark green
  
  // Screen
  const screen = new PIXI.Graphics();
  screen.rect(-22, -27, 44, 32);
  screen.fill(0x87CEEB); // Light blue (screen)
  
  // Base
  const base = new PIXI.Graphics();
  base.rect(-15, 12, 30, 4);
  base.fill(0x2C3E2C);
  
  // Stand
  const stand = new PIXI.Graphics();
  stand.rect(-3, 10, 6, 8);
  stand.fill(0x2C3E2C);
  
  // Icon on screen
  const icon = new PIXI.Text({
    text: '💻',
    style: { fontSize: 18 }
  });
  icon.anchor.set(0.5);
  icon.y = -10;
  
  container.addChild(base);
  container.addChild(stand);
  container.addChild(monitor);
  container.addChild(screen);
  container.addChild(icon);
  
  return container;
}

export function createDoor(): PIXI.Container {
  const container = new PIXI.Container();
  
  // Door frame
  const frame = new PIXI.Graphics();
  frame.rect(-30, -60, 60, 80);
  frame.fill(0x5C4033); // Brown
  
  // Door
  const door = new PIXI.Graphics();
  door.rect(-25, -55, 50, 70);
  door.fill(0x8B4513);
  door.stroke({ width: 2, color: 0x5C4033 });
  
  // Doorknob
  const knob = new PIXI.Graphics();
  knob.circle(15, 0, 3);
  knob.fill(0xFFD700); // Gold
  
  // Sign above
  const sign = new PIXI.Text({
    text: '🚪',
    style: { fontSize: 24 }
  });
  sign.anchor.set(0.5);
  sign.y = -40;
  
  container.addChild(frame);
  container.addChild(door);
  container.addChild(knob);
  container.addChild(sign);
  
  return container;
}

// ============================================================================
// Object Factory
// ============================================================================

export function createInteractiveObject(obj: InteractiveObject, index: number = 0): PIXI.Container {
  let sprite: PIXI.Container;
  
  switch (obj.type) {
    case 'sign':
      sprite = createSign('📋');
      break;
    case 'plant':
      sprite = createPlant('medium');
      break;
    case 'book':
      // Cycle through book sprites (1, 2, 3)
      sprite = createBook((index % 3) + 1);
      break;
    case 'computer':
      sprite = createComputer();
      break;
    case 'door':
      sprite = createDoor();
      break;
    default:
      sprite = createSign('❓');
  }
  
  sprite.x = obj.x;
  sprite.y = obj.y;
  sprite.eventMode = 'static';
  sprite.cursor = 'pointer';
  
  // Add glow effect on hover
  sprite.on('pointerover', () => {
    sprite.scale.set(sprite.scale.x * 1.1, sprite.scale.y * 1.1);
  });
  
  sprite.on('pointerout', () => {
    sprite.scale.set(sprite.scale.x / 1.1, sprite.scale.y / 1.1);
  });
  
  return sprite;
}

export function createNPC(npc: NPCData): PIXI.Container {
  const sprite = createCat(0xF4A460); // Orange cat
  sprite.x = npc.x;
  sprite.y = npc.y;
  sprite.eventMode = 'static';
  sprite.cursor = 'pointer';
  
  // Add name label
  const nameLabel = new PIXI.Text({
    text: npc.name,
    style: {
      fontSize: 12,
      fill: 0xFFFFFF,
      fontWeight: 'bold',
      stroke: { color: 0x000000, width: 3 },
    }
  });
  nameLabel.anchor.set(0.5);
  nameLabel.y = -50;
  sprite.addChild(nameLabel);
  
  // Idle animation (simple bob)
  let time = 0;
  const animate = () => {
    time += 0.05;
    sprite.y = npc.y + Math.sin(time) * 3;
  };
  
  // Store animation function
  (sprite as any).animate = animate;
  
  return sprite;
}

// ============================================================================
// Helper Functions
// ============================================================================

export function checkCollision(
  obj1: { x: number; y: number; width: number; height: number },
  obj2: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

export function distanceBetween(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
