// ============================================================================
// Game Types
// ============================================================================

import * as PIXI from 'pixi.js';

export interface GameObject {
    sprite: PIXI.Container;
    x: number;
    y: number;
    width: number;
    height: number;
    interactive?: boolean;
    onInteract?: () => void;
}

export interface NPCData {
    id: string;
    name: string;
    sprite: string;
    x: number;
    y: number;
    dialogues: string[];
    currentDialogue: number;
}

export interface InteractiveObject {
    id: string;
    type: 'sign' | 'plant' | 'book' | 'computer' | 'door';
    x: number;
    y: number;
    title: string;
    content: string;
    action?: () => void;
}

export interface GameArea {
    id: string;
    name: string;
    description: string;
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    backgroundColor: number;
    objects: InteractiveObject[];
    npcs: NPCData[];
}

export interface PlayerState {
    x: number;
    y: number;
    direction: 'up' | 'down' | 'left' | 'right';
    isMoving: boolean;
    currentArea: string;
}
