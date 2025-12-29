'use client';

// ============================================================================
// Garden Game Component
// Pokemon-style exploration game for portfolio
// ============================================================================

import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Button } from '@/components/ui/Button';
import { HiX, HiInformationCircle } from 'react-icons/hi';
import { mainGarden, greenhouse, laboratory, library } from '@/data/gameWorld';
import { GameArea } from '@/types/game';
import {
    createPlayer,
    createNPC,
    createInteractiveObject,
    distanceBetween,
} from '@/lib/gameUtils';
import { assetLoader } from '@/lib/assetLoader';
import { createOutdoorScene } from '@/lib/tilemaprenderer';

export function GardenGame() {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<PIXI.Application | null>(null);
    const playerRef = useRef<PIXI.Container | null>(null);
    const currentAreaRef = useRef<GameArea>(mainGarden);

    const [isLoading, setIsLoading] = useState(true);
    const [showInstructions, setShowInstructions] = useState(true);
    const [currentDialog, setCurrentDialog] = useState<{ title: string; content: string } | null>(null);
    const [nearbyObject, setNearbyObject] = useState<string | null>(null);

    useEffect(() => {
        if (!gameContainerRef.current) return;

        const initGame = async () => {
            const app = new PIXI.Application();

            await app.init({
                width: Math.min(window.innerWidth, 1200),
                height: Math.min(window.innerHeight, 800),
                backgroundColor: mainGarden.backgroundColor,
                antialias: true,
            });

            if (gameContainerRef.current) {
                gameContainerRef.current.appendChild(app.canvas);
                appRef.current = app;
            }

            // Load assets FIRST
            try {
                await assetLoader.loadAssets();
                setIsLoading(false);
                await setupGame(app);
            } catch (error) {
                console.error('Failed to load game assets:', error);
                // Continue anyway with fallback graphics
                setIsLoading(false);
                await setupGame(app);
            }
        };

        initGame();

        return () => {
            if (appRef.current) {
                appRef.current.destroy(true, { children: true, texture: true });
            }
        };
    }, []);

    const setupGame = async (app: PIXI.Application) => {
        const { stage } = app;

        // Create tilemap background using loaded sprites
        const tilemapBackground = createOutdoorScene(app.screen.width, app.screen.height, 16);
        stage.addChild(tilemapBackground);

        // Create interactive objects from game world
        const objects: PIXI.Container[] = [];
        currentAreaRef.current.objects.forEach((obj: any, index: number) => {
            const sprite: PIXI.Container = createInteractiveObject(obj as any, index);
            sprite.on('pointerdown', () => {
                setCurrentDialog({
                    title: obj.title,
                    content: obj.content
                });
            });
            stage.addChild(sprite);
            objects.push(sprite);
        });

        // Create NPCs
        const npcs: PIXI.Container[] = [];
        currentAreaRef.current.npcs.forEach((npcData) => {
            const npc: PIXI.Container = createNPC({
                id: npcData.id,
                sprite: npcData.sprite,
                x: npcData.x,
                y: npcData.y,
                name: npcData.name,
                currentDialogue: 0, // Set to the index of the first dialogue
                dialogues: npcData.dialogues
            });
            let dialogueIndex: number = 0;

            npc.on('pointerdown', () => {
                setCurrentDialog({
                    title: npcData.name,
                    content: npcData.dialogues[dialogueIndex]
                });
                dialogueIndex = (dialogueIndex + 1) % npcData.dialogues.length;
            });

            stage.addChild(npc);
            npcs.push(npc);
        });

        // Create player
        const player = createPlayer();
        player.x = app.screen.width / 2;
        player.y = app.screen.height - 200;
        playerRef.current = player;
        stage.addChild(player);

        // Setup controls and game loop
        setupControls(player, app, objects, npcs);

        // Add area portals
        addAreaPortals(app, stage);
    };

    const addAreaPortals = (app: PIXI.Application, stage: PIXI.Container) => {
        // North portal - to Greenhouse
        const northPortal = new PIXI.Graphics();
        northPortal.rect(app.screen.width / 2 - 40, 20, 80, 40);
        northPortal.fill(0x967BB6, 0.5);
        const northText = new PIXI.Text({
            text: '🌱 Greenhouse',
            style: { fontSize: 14, fill: 0xFFFFFF }
        });
        northText.x = app.screen.width / 2 - 50;
        northText.y = 30;
        northPortal.eventMode = 'static';
        northPortal.cursor = 'pointer';
        northPortal.on('pointerdown', () => changeArea(greenhouse, app));
        stage.addChild(northPortal);
        stage.addChild(northText);

        // East portal - to Laboratory
        const eastPortal = new PIXI.Graphics();
        eastPortal.rect(app.screen.width - 60, app.screen.height / 2 - 30, 40, 60);
        eastPortal.fill(0x967BB6, 0.5);
        const eastText = new PIXI.Text({
            text: '🔬\nLab',
            style: { fontSize: 14, fill: 0xFFFFFF, align: 'center' }
        });
        eastText.x = app.screen.width - 50;
        eastText.y = app.screen.height / 2 - 20;
        eastPortal.eventMode = 'static';
        eastPortal.cursor = 'pointer';
        eastPortal.on('pointerdown', () => changeArea(laboratory, app));
        stage.addChild(eastPortal);
        stage.addChild(eastText);

        // South portal - to Library
        const southPortal = new PIXI.Graphics();
        southPortal.rect(app.screen.width / 2 - 40, app.screen.height - 60, 80, 40);
        southPortal.fill(0x967BB6, 0.5);
        const southText = new PIXI.Text({
            text: '📚 Library',
            style: { fontSize: 14, fill: 0xFFFFFF }
        });
        southText.x = app.screen.width / 2 - 42;
        southText.y = app.screen.height - 50;
        southPortal.eventMode = 'static';
        southPortal.cursor = 'pointer';
        southPortal.on('pointerdown', () => changeArea(library, app));
        stage.addChild(southPortal);
        stage.addChild(southText);
    };

    const changeArea = (newArea: GameArea, app: PIXI.Application) => {
        currentAreaRef.current = newArea;
        // Reload the entire game with new area
        if (appRef.current) {
            appRef.current.stage.removeChildren();
            setupGame(app);
        }
    };

    const setupControls = (
        player: PIXI.Container,
        app: PIXI.Application,
        objects: PIXI.Container[],
        npcs: PIXI.Container[]
    ) => {
        const keys: { [key: string]: boolean } = {};
        const speed = 4;

        window.addEventListener('keydown', (e) => {
            keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener('keyup', (e) => {
            keys[e.key.toLowerCase()] = false;
        });

        // Game loop
        app.ticker.add(() => {
            let moved = false;

            if (keys['w'] || keys['arrowup']) {
                player.y = Math.max(100, player.y - speed);
                moved = true;
            }
            if (keys['s'] || keys['arrowdown']) {
                player.y = Math.min(app.screen.height - 100, player.y + speed);
                moved = true;
            }
            if (keys['a'] || keys['arrowleft']) {
                player.x = Math.max(50, player.x - speed);
                player.scale.x = -1; // Flip sprite
                moved = true;
            }
            if (keys['d'] || keys['arrowright']) {
                player.x = Math.min(app.screen.width - 50, player.x + speed);
                player.scale.x = 1; // Normal direction
                moved = true;
            }

            // Check for nearby interactive objects
            let nearestObject: string | null = null;
            let minDistance = Infinity;

            [...objects, ...npcs].forEach((obj, index) => {
                const distance = distanceBetween(player.x, player.y, obj.x, obj.y);
                if (distance < 80 && distance < minDistance) {
                    minDistance = distance;
                    nearestObject = `object-${index}`;
                }
            });

            setNearbyObject(nearestObject);

            // Animate NPCs
            npcs.forEach(npc => {
                if ((npc as any).animate) {
                    (npc as any).animate();
                }
            });
        });

        // Space bar to interact
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' && nearbyObject) {
                e.preventDefault();
                // Find and trigger the nearest object
                const allObjects = [...objects, ...npcs];
                allObjects.forEach((obj, index) => {
                    const distance = distanceBetween(player.x, player.y, obj.x, obj.y);
                    if (distance < 80) {
                        obj.emit('pointerdown');
                    }
                });
            }
        });
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* Game Canvas Container */}
            <div ref={gameContainerRef} className="w-full h-full flex items-center justify-center" />

            {/* Loading Screen */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#2D5F3F] z-50">
                    <div className="text-center">
                        <div className="text-6xl mb-4 animate-bounce">🌱</div>
                        <p className="text-white text-xl font-semibold">Growing the Garden...</p>
                        <p className="text-white/70 text-sm mt-2">This might take a moment</p>
                    </div>
                </div>
            )}

            {/* Instructions Overlay */}
            {showInstructions && !isLoading && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-md shadow-2xl z-40 border-2 border-[#2D5F3F]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <HiInformationCircle className="w-6 h-6 text-[#2D5F3F]" />
                            <h3 className="text-lg font-bold text-[#1A3A2A]">Welcome to the Garden!</h3>
                        </div>
                        <button
                            onClick={() => setShowInstructions(false)}
                            className="text-[#5C6B5C] hover:text-[#2D5F3F] transition-colors"
                        >
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-3 text-sm text-[#2C3E2C]">
                        <p className="flex items-center gap-2">
                            <kbd className="font-mono bg-[#F4EBD0] px-2 py-1 rounded border border-[#6B8E23]">WASD</kbd>
                            or
                            <kbd className="font-mono bg-[#F4EBD0] px-2 py-1 rounded border border-[#6B8E23]">↑←↓→</kbd>
                            Move around
                        </p>
                        <p className="flex items-center gap-2">
                            <kbd className="font-mono bg-[#F4EBD0] px-2 py-1 rounded border border-[#6B8E23]">Click</kbd>
                            or
                            <kbd className="font-mono bg-[#F4EBD0] px-2 py-1 rounded border border-[#6B8E23]">Space</kbd>
                            Interact with objects
                        </p>
                        <p>🌱 Explore different areas through colored portals</p>
                        <p>🐱 Talk to cats to learn about Asher's research!</p>
                    </div>

                    <Button
                        onClick={() => setShowInstructions(false)}
                        variant="primary"
                        className="w-full mt-4"
                    >
                        Start Exploring! 🌿
                    </Button>
                </div>
            )}

            {/* Dialog Box */}
            {currentDialog && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-40">
                    <div className="bg-white/98 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-4 border-[#2D5F3F]">
                        <h4 className="text-xl font-bold text-[#1A3A2A] mb-3">
                            {currentDialog.title}
                        </h4>
                        <p className="text-[#2C3E2C] leading-relaxed mb-4 whitespace-pre-line">
                            {currentDialog.content}
                        </p>
                        <Button
                            onClick={() => setCurrentDialog(null)}
                            variant="primary"
                            size="sm"
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            )}

            {/* Current Area Display */}
            {!isLoading && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border-2 border-[#2D5F3F] z-30">
                    <p className="text-[#2D5F3F] font-semibold text-sm">
                        📍 {currentAreaRef.current.name}
                    </p>
                </div>
            )}

            {/* Interaction Hint */}
            {nearbyObject && !currentDialog && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-[#6B8E23] animate-pulse z-30">
                    <p className="text-[#2D5F3F] font-medium text-sm">
                        Press <kbd className="font-mono bg-[#F4EBD0] px-2 py-0.5 rounded text-xs">Space</kbd> to interact
                    </p>
                </div>
            )}

            {/* Help Button */}
            {!showInstructions && !isLoading && (
                <button
                    onClick={() => setShowInstructions(true)}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform z-30 border-2 border-[#2D5F3F]"
                    aria-label="Show instructions"
                >
                    <HiInformationCircle className="w-6 h-6 text-[#2D5F3F]" />
                </button>
            )}

            {/* Exit Button */}
            <a
                href="/"
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg hover:scale-105 transition-transform z-30 text-[#2D5F3F] font-semibold border-2 border-[#2D5F3F]"
            >
                ← Back to Portfolio
            </a>
        </div>
    );
}
