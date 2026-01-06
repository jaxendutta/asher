"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { tiny5 } from '@/lib/fonts';

// --- Interfaces ---
interface Position {
    x: number;
    y: number;
}

interface ToyData {
    w: number;
    h: number;
}

interface Toy extends Position {
    id: number;
    type: string;
    w: number;
    h: number;
    z: number;
    angle: number;
    index: number;
    grabbed?: boolean;
    falling?: boolean;
    transformOrigin: string;
    clawPos?: Position;
}

const ClawMachine: React.FC = () => {
    // --- Constants ---
    const M = 2;
    const MACHINE_WIDTH = 160 * M;
    const MACHINE_HEIGHT = 180 * M;
    const MACHINE_TOP_HEIGHT = 70 * M;
    const MACHINE_BOTTOM_HEIGHT = 70 * M;
    const CORNER_BUFFER = 16;
    const MACHINE_BUFFER = { x: 36, y: 16 };
    const MAX_ARM_LENGTH = MACHINE_HEIGHT - MACHINE_TOP_HEIGHT - MACHINE_BUFFER.y * 2;

    // --- State (UI Rendering Only) ---
    const [isOpen, setIsOpen] = useState(false);
    const [collectedToys, setCollectedToys] = useState<string[]>([]);

    // We use a separate state to trigger re-renders for toys, 
    // but the 'truth' of positions is kept in Refs for the game loop.
    const [renderToys, setRenderToys] = useState<Toy[]>([]);
    const [clawClass, setClawClass] = useState(''); // 'open', 'missed', etc.
    const [showOverlay, setShowOverlay] = useState(false);
    const [showCollectionArrow, setShowCollectionArrow] = useState(false);
    const [horiBtnActive, setHoriBtnActive] = useState(false);
    const [vertBtnActive, setVertBtnActive] = useState(false);

    // --- Game Engine Refs (Mutable "Truth") ---
    const armPos = useRef({ x: 0, y: 0 });
    const railPos = useRef({ x: 0 });
    const armHeight = useRef(28 * M);
    const toysRef = useRef<Toy[]>([]);
    const targetToyRef = useRef<Toy | null>(null);
    const logicState = useRef({
        isLocked: false,
        horiPressed: false,
        vertPressed: false,
        mode: 'IDLE' // IDLE, HORI, VERT, GRABBING, RESETTING
    });
    const loopRef = useRef<NodeJS.Timeout | null>(null);

    // --- DOM Refs ---
    const machineRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const armJointRef = useRef<HTMLDivElement>(null);
    const armRef = useRef<HTMLDivElement>(null);
    const railVertRef = useRef<HTMLDivElement>(null);
    const railHoriRef = useRef<HTMLDivElement>(null);
    const toyElementsRef = useRef<Map<number, HTMLDivElement>>(new Map());

    // --- Helpers ---
    const radToDeg = (rad: number) => Math.round(rad * (180 / Math.PI));
    const randomN = (min: number, max: number) => Math.round(min - 0.5 + Math.random() * (max - min + 1));
    const adjustAngle = (angle: number) => {
        const adjusted = angle % 360;
        return adjusted < 0 ? adjusted + 360 : adjusted;
    };

    const TOY_TYPES: Record<string, ToyData> = {
        bear: { w: 20 * M, h: 27 * M },
        bunny: { w: 20 * M, h: 29 * M },
        golem: { w: 20 * M, h: 27 * M },
        cucumber: { w: 16 * M, h: 28 * M },
        penguin: { w: 24 * M, h: 22 * M },
        robot: { w: 20 * M, h: 30 * M },
    };

    // --- Core Update Loop (Syncs Refs to DOM) ---
    const updateDOM = () => {
        if (!isOpen) return;

        // 1. Update Arm & Rails
        if (armJointRef.current) {
            armJointRef.current.style.left = `${armPos.current.x}px`;
            armJointRef.current.style.top = `${armPos.current.y}px`;
            const shadowScale = 0.5 + armHeight.current / MAX_ARM_LENGTH / 2;
            armJointRef.current.style.setProperty('--shadow-scale', shadowScale.toString());
        }
        if (railVertRef.current) {
            railVertRef.current.style.left = `${railPos.current.x}px`;
        }
        if (armRef.current) {
            armRef.current.style.height = `${armHeight.current}px`;
        }

        // 2. Update Toys (Only grabbed ones need frequent updates from loop)
        const target = targetToyRef.current;
        if (target && target.grabbed && target.clawPos) {
            const el = toyElementsRef.current.get(target.id);
            if (el) {
                const offsetX = target.x - target.clawPos.x;
                const offsetY = target.y - target.clawPos.y;
                const currentClawX = armPos.current.x + 5;
                const currentClawY = armPos.current.y + armHeight.current;

                el.style.left = `${currentClawX + offsetX}px`;
                el.style.top = `${currentClawY + offsetY}px`;
                el.style.zIndex = '50';
                el.style.transform = `rotate(${target.angle}deg)`;
            }
        }
    };

    // --- Logic Sequences ---

    const initGame = useCallback(() => {
        // Reset Logic
        armPos.current = { x: 0, y: 0 };
        railPos.current = { x: 0 };
        armHeight.current = 28 * M;
        targetToyRef.current = null;
        logicState.current = { isLocked: false, horiPressed: false, vertPressed: false, mode: 'IDLE' };
        setCollectedToys([]);
        setHoriBtnActive(false);
        setVertBtnActive(false);
        setClawClass('');

        // Generate Toys
        const allTypes = [...Object.keys(TOY_TYPES), ...Object.keys(TOY_TYPES)].sort(() => 0.5 - Math.random());
        const newToys: Toy[] = allTypes.filter((_, i) => i !== 8).map((type, index) => {
            const actualIndex = index >= 8 ? index + 1 : index;
            const size = TOY_TYPES[type];
            return {
                id: index,
                type,
                // Grid Logic
                x: CORNER_BUFFER + (actualIndex % 4) * ((MACHINE_WIDTH - CORNER_BUFFER * 3) / 4) + size.w / 2 + randomN(-6, 6),
                y: MACHINE_HEIGHT - MACHINE_BOTTOM_HEIGHT + CORNER_BUFFER + Math.floor(actualIndex / 4) * ((MACHINE_BOTTOM_HEIGHT - CORNER_BUFFER * 2) / 3) - size.h / 2 + randomN(-2, 2),
                w: size.w,
                h: size.h,
                z: 5,
                angle: 0,
                index: actualIndex,
                transformOrigin: 'center'
            };
        });

        toysRef.current = newToys;
        setRenderToys(newToys);

        // Start Animation
        setTimeout(() => moveArmToStart(), 500);
    }, []);

    const moveArmToStart = () => {
        const targetY = MACHINE_TOP_HEIGHT - MACHINE_BUFFER.y;
        const targetX = MACHINE_BUFFER.x;

        const interval = setInterval(() => {
            let moved = false;
            // Move Y
            if (Math.abs(armPos.current.y - targetY) > 2) {
                armPos.current.y += (armPos.current.y > targetY ? -4 : 4);
                moved = true;
            } else {
                armPos.current.y = targetY;
            }
            // Move X
            if (Math.abs(railPos.current.x - targetX) > 2) {
                railPos.current.x += (railPos.current.x > targetX ? -4 : 4);
                armPos.current.x = railPos.current.x;
                moved = true;
            } else {
                railPos.current.x = targetX;
                armPos.current.x = targetX;
            }

            updateDOM();

            if (!moved) {
                clearInterval(interval);
                setHoriBtnActive(true);
                logicState.current.mode = 'HORI';
            }
        }, 20);
    };

    // --- Button Handlers ---

    const handleHoriPress = () => {
        if (!horiBtnActive) return;
        logicState.current.horiPressed = true;
        setClawClass(''); // Reset missed state

        if (loopRef.current) clearInterval(loopRef.current);
        const targetX = MACHINE_WIDTH - 10 - MACHINE_BUFFER.x;

        loopRef.current = setInterval(() => {
            if (railPos.current.x < targetX) {
                railPos.current.x += 4;
                armPos.current.x = railPos.current.x;
                updateDOM();
            } else {
                handleHoriRelease();
            }
        }, 20);
    };

    const handleHoriRelease = () => {
        if (loopRef.current) clearInterval(loopRef.current);
        logicState.current.horiPressed = false;
        setHoriBtnActive(false);
        setVertBtnActive(true);
        logicState.current.mode = 'VERT';
    };

    const handleVertPress = () => {
        if (!vertBtnActive) return;
        logicState.current.vertPressed = true;

        if (loopRef.current) clearInterval(loopRef.current);
        const targetY = MACHINE_BUFFER.y; // Top of area

        loopRef.current = setInterval(() => {
            // Move UP/Back visually
            if (armPos.current.y > targetY) {
                armPos.current.y -= 4;
                updateDOM();
            } else {
                handleVertRelease();
            }
        }, 20);
    };

    const handleVertRelease = () => {
        if (loopRef.current) clearInterval(loopRef.current);
        logicState.current.vertPressed = false;
        setVertBtnActive(false);
        attemptGrab();
    };

    // --- Grab Physics ---

    const attemptGrab = () => {
        logicState.current.mode = 'GRABBING';

        // 1. Calculate Hit
        const clawX = armPos.current.x + 5;
        const clawY = armPos.current.y + MAX_ARM_LENGTH;

        // Find overlapping toy (Strict)
        const hitToy = toysRef.current
            .filter(t => !t.falling) // Ignore already collected
            .sort((a, b) => b.index - a.index) // Front-most first
            .find(t => {
                return (
                    clawX > t.x && clawX < t.x + t.w &&
                    clawY > t.y && clawY < t.y + t.h
                );
            });

        targetToyRef.current = hitToy || null;

        // 2. Drop Sequence
        setClawClass('open');

        let currentH = 28 * M;
        const dropInterval = setInterval(() => {
            currentH += 8;
            if (currentH >= MAX_ARM_LENGTH) {
                currentH = MAX_ARM_LENGTH;
                clearInterval(dropInterval);
                armHeight.current = currentH;
                updateDOM();

                // GRAB ACTION
                setTimeout(() => {
                    setClawClass(''); // Close

                    if (targetToyRef.current) {
                        const t = targetToyRef.current;
                        t.grabbed = true;
                        t.clawPos = { x: clawX, y: clawY };

                        // Calc Angle
                        const angle = radToDeg(Math.atan2(t.y + t.h / 2 - clawY, t.x + t.w / 2 - clawX)) - 90;
                        const adj = adjustAngle(angle);
                        t.angle = adj < 180 ? -adj : 360 - adj;
                    } else {
                        setClawClass('missed');
                    }

                    // RETRACT
                    setTimeout(() => {
                        const retractInterval = setInterval(() => {
                            currentH -= 8;
                            armHeight.current = currentH;
                            updateDOM();

                            if (currentH <= 28 * M) {
                                clearInterval(retractInterval);
                                returnToChute();
                            }
                        }, 20);
                    }, 500);

                }, 500);
            }
            armHeight.current = currentH;
            updateDOM();
        }, 20);
    };

    const returnToChute = () => {
        logicState.current.mode = 'RESETTING';
        const targetX = MACHINE_BUFFER.x;
        const targetY = MACHINE_TOP_HEIGHT - MACHINE_BUFFER.y;

        const interval = setInterval(() => {
            let moved = false;
            // X Back
            if (Math.abs(railPos.current.x - targetX) > 2) {
                railPos.current.x += (railPos.current.x > targetX ? -4 : 4);
                armPos.current.x = railPos.current.x;
                moved = true;
            }
            // Y Reset (Only if we missed, otherwise stay high)
            if (!targetToyRef.current && Math.abs(armPos.current.y - targetY) > 2) {
                armPos.current.y += (armPos.current.y > targetY ? -4 : 4);
                moved = true;
            }

            updateDOM();

            if (!moved) {
                clearInterval(interval);

                if (targetToyRef.current) {
                    // We have a toy, perform drop sequence
                    moveArmToDrop();
                } else {
                    // Missed, reset immediately
                    setClawClass('');
                    setHoriBtnActive(true);
                    logicState.current.mode = 'HORI';
                }
            }
        }, 20);
    };

    const moveArmToDrop = () => {
        // Move arm joint down to drop height
        const targetY = MACHINE_TOP_HEIGHT - MACHINE_BUFFER.y;

        const interval = setInterval(() => {
            if (Math.abs(armPos.current.y - targetY) > 2) {
                armPos.current.y += (armPos.current.y < targetY ? 4 : -4);
                updateDOM();
            } else {
                clearInterval(interval);
                dropToy();
            }
        }, 20);
    };

    const dropToy = () => {
        setClawClass('open');

        const toy = targetToyRef.current;
        if (toy) {
            // Unlink physics
            toy.grabbed = false;
            toy.falling = true; // Logic flag

            // DOM Animation
            const el = toyElementsRef.current.get(toy.id);
            if (el) {
                // Remove from claw flow
                el.style.transition = 'top 0.5s ease-in, transform 0.3s';
                el.style.transform = 'rotate(0deg)';
                el.style.top = `${MACHINE_HEIGHT + 100}px`; // Drop through floor
                el.style.zIndex = '5';
            }

            setTimeout(() => {
                collectToy(toy);
            }, 600);
        }

        setTimeout(() => {
            setClawClass('');
            targetToyRef.current = null;
            // Full Reset
            moveArmToStart();
        }, 1000);
    };

    const collectToy = (toy: Toy) => {
        setCollectedToys(prev => [...prev, toy.type]);
        setShowOverlay(true);
        setShowCollectionArrow(true);

        // Remove from ref array so it can't be picked again
        toysRef.current = toysRef.current.filter(t => t.id !== toy.id);

        // Update render state to remove from DOM
        setRenderToys(prev => prev.filter(t => t.id !== toy.id));

        setTimeout(() => {
            setShowOverlay(false);
            setTimeout(() => setShowCollectionArrow(false), 2000);
        }, 1000);
    };

    useEffect(() => {
        if (isOpen) {
            initGame();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen, initGame]);

    // Keyboard support
    useEffect(() => {
        if (!isOpen) return;
        const handleDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleHoriPress();
            if (e.key === "ArrowDown") handleVertPress();
        };
        const handleUp = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleHoriRelease();
            if (e.key === "ArrowDown") handleVertRelease();
        };
        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
        };
    }, [isOpen, horiBtnActive, vertBtnActive]);

    return (
        <>
            <style jsx>{`
                * { box-sizing: border-box; }
                .pix, .pix::before, .pix::after { image-rendering: pixelated; }
                .pix::before, .pix::after { position: absolute; content: ''; }

                .claw-wrapper {
                    position: fixed; bottom: 15px; left: 15px; z-index: 99999; pointer-events: auto;
                }
                .claw-toggle {
                    width: 60px; height: 60px; border-radius: 50%; border: 3px solid #fff;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    background-color: #84dfe2; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    transition: transform 0.2s; pointer-events: auto;
                }
                .claw-toggle:hover { transform: scale(1.05); }

                .claw-modal {
                    position: fixed; inset: 0; background-color: rgba(132, 223, 226, 0.95);
                    display: flex; justify-content: center; align-items: center; z-index: 100000;
                    animation: fadeIn 0.3s forwards;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                .close-btn {
                    position: absolute; top: -50px; right: -50px; background: none; border: none; cursor: pointer;
                    z-index: 200; pointer-events: auto;
                }

                /* Inventory */
                .collection-box {
                    width: ${MACHINE_WIDTH}px; height: 64px; margin: -74px 0 24px; display: flex; align-items: end; justify-content: start;
                }
                .collection-box .toy-wrapper {
                    position: relative; width: calc(100% / 6); display: flex; align-items: end; justify-content: center;
                }
                .toy-wrapper.squeeze-in { width: 0; animation: squeeze-in forwards 0.4s 1.4s; }
                @keyframes squeeze-in { 0% { width: 0; } 100% { width: calc(100% / 6); } }
                .toy-wrapper .toy { opacity: 0; transform: translateY(-100vh); animation: show-toy-2 0.8s 1s forwards; }
                @keyframes show-toy-2 { 0% { opacity: 0; transform: translateY(-100vh); } 100% { opacity: 1; transform: translateY(0); } }

                /* Machine */
                .claw-machine {
                    display: flex; flex-direction: column; border: 2px solid #57280f; overflow: hidden;
                    position: relative; background-color: #84dfe2; transform: scale(1);
                }
                .claw-machine.show-overlay::after {
                    content: ''; position: absolute; inset: 0; background-color: #32c2db; opacity: 0.6;
                    z-index: 30; pointer-events: none;
                }

                .box {
                    position: relative; background-color: #7fcfed; width: ${MACHINE_WIDTH}px; height: ${MACHINE_HEIGHT}px;
                }
                /* Brown Bar */
                .box::before {
                    background-color: #57280f; top: ${MACHINE_TOP_HEIGHT}px; width: 100%; height: 16px; z-index: 25;
                }
                /* Right Bar */
                .box::after {
                    background-color: #32c2db; top: ${MACHINE_TOP_HEIGHT}px; right: 0; width: 16px; height: 340px; z-index: 15;
                }

                .machine-top {
                    position: absolute; width: 100%; height: ${MACHINE_TOP_HEIGHT}px; top: 0;
                    display: flex; align-items: center; z-index: 10; pointer-events: none;
                }
                .machine-top::after {
                    content: ''; position: absolute; inset: 0; background-color: rgba(112, 247, 243, 0.45); z-index: -1;
                }
                .machine-bottom {
                    position: absolute; width: 100%; height: ${MACHINE_BOTTOM_HEIGHT}px; bottom: 0; background-color: #def7f6; z-index: 1;
                }
                
                /* Rails */
                .rail { position: absolute; border: solid #33a5da; background-color: #fff; z-index: 10; }
                .rail.hori { height: 10px; width: 100%; border-width: 2px 0; position: relative; } /* Centered by flex */
                .rail.vert { top: 0; height: ${MACHINE_TOP_HEIGHT}px; width: 10px; border-width: 0 2px; }

                /* Arm */
                .arm-joint { position: absolute; width: 10px; height: 10px; z-index: 11; }
                .arm-joint::after {
                    position: absolute; border: solid #33a5da 2px; background-color: #fff; width: 20px; height: 20px; top: -5px; left: -5px;
                }
                .arm-joint::before {
                    width: 40px; height: 32px; margin-left: -30px; margin-top: ${MAX_ARM_LENGTH}px;
                    transform: scale(var(--shadow-scale, 0.5));
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAF5JREFUOE9jZMABrKZs/49LDiR+LMeTEZs8iiAhQ3BZgGw43EByDYNZAjMUbCClhiEbSn0DqeU6mCsZRw3El5aJkqN+GA7+dAgLGEqTD0rWo9RQrIUDehQScjGu4gsAxKQ3Ke4v44gAAAAASUVORK5CYII=);
                    background-size: 40px 32px; z-index: -1; opacity: 0.5;
                }
                .arm {
                    position: absolute; width: 14px; background-color: #fff; box-shadow: 0 0 0 2px #33a5da;
                    margin-top: -2px; margin-left: -2px; transform-origin: top center;
                }
                .arm::after {
                    position: absolute; width: 26px; height: 14px; bottom: -2px; left: -6px;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAHCAYAAADTcMcaAAAAAXNSR0IArs4c6QAAAElJREFUKFNjZGBgYDBeeus/iCYGnI1WY2QEaTgTpUqMerAak2W3GVA0RWgKMKy4/gHDAGRx6miCWQEyGQbQbcawiRiPgTWRE3oA5mIzfZr3jVYAAAAASUVORK5CYII=);
                    background-size: 26px 14px;
                }
                .arm.missed::after {
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAHCAYAAADTcMcaAAAAAXNSR0IArs4c6QAAAENJREFUKFNjZGBgYDBeeus/iCYGnI1WY2QEaTgTpUqMerAak2W3GSjTFKEpADZpxfUPGLYiy+G0CaYImyHkO4+c0AMAWBctfQPWfVQAAAAASUVORK5CYII=);
                }
                .claws { position: absolute; width: 6px; height: 20px; bottom: -10px; left: 5px; }
                .claws::before, .claws::after { top: 0; width: 20px; height: 32px; transition: 0.2s; background-size: 20px 32px; }
                .claws::before {
                    left: -20px; transform-origin: top right;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAAAXNSR0IArs4c6QAAAGRJREFUKFNjZMADwjX4/6+88ZERpARMYAMgRSuuf2CI0BRgACnGqhCmCGYASDGGQmyKMEzEpQjFjfgUwRUSUgRWSIwi0hSCVBNjKjx4CClGCUeiggcWC0QFOD7FlCUKZJNhyQwAi8VlK14hrsQAAAAASUVORK5CYII=);
                }
                .claws::after {
                    left: 5px; transform-origin: top left;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAAAXNSR0IArs4c6QAAAFxJREFUKFNjZICCcA3+/ytvfGSE8dFpsARI0YrrHxgiNAUYcClmhCmCmYBLMYqJ+BTD3UTIZBTH41OM4UtcirEGBzbF5CskymqiPENU8BBSBIoI8qIQb6IgNpkBAEPjZSuK8jVuAAAAAElFTkSuQmCC);
                }
                .arm.open .claws::before { rotate: 45deg; }
                .arm.open .claws::after { rotate: -45deg; }

                /* Collection Point */
                .collection-point {
                    position: absolute; bottom: 0; left: 0;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAMCAYAAABm+U3GAAAAAXNSR0IArs4c6QAAADBJREFUOE9jtJqy/T8DFcGxHE9GkHGM1DYYZCjIcJoYTDMXjxqMkrZGIw8eHEMvKADnSiE1EAXSagAAAABJRU5ErkJggg==);
                    width: 88px; height: 48px; background-size: 88px 48px; z-index: 2;
                }

                /* Controls */
                .control {
                    position: relative; height: 120px; width: 100%;
                    background-color: #3a94b7; text-align: right;
                }
                .control .collection-point { filter: brightness(0.8); bottom: 16px; }
                .cover { position: absolute; background-color: #32c2db; z-index: 22; }
                .cover.top { top: 0; width: 100%; height: 32px; }
                .cover.bottom { bottom: 0; width: 100%; height: 16px; background-color: #57280f; }
                .cover.left { bottom: 0; left: 0; height: 340px; width: 16px; }
                .cover.right { top: 0; right: 0; height: 100%; width: 232px; }

                .collection-arrow {
                    position: absolute; left: 42px; top: 18px; width: 16px; height: 8px;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAYAAACzzX7wAAAAAXNSR0IArs4c6QAAAClJREFUGFdjDDn86T8DHsAIksOlaI0tHyNYATZFIEmQOFwBsiKYJEgMAPTvDw1xBcM+AAAAAElFTkSuQmCC);
                    background-size: 16px 8px; filter: sepia(1) brightness(0.5);
                    z-index: 25;
                }
                .collection-arrow.active {
                    animation: pulse infinite 1s;
                    pointer-events: auto;
                }

                .instruction {
                    position: absolute; width: 102px; height: 24px;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAMCAYAAADPjYVSAAAAAXNSR0IArs4c6QAAAPRJREFUSEvdVkESwkAIs0d9hv9/k8/Qow4d6aSZBKjjRfdSdltYIBC63B735+m9rufLkvuQ4/joHnVCRjsp531hG89w7+S0r3xdnc8X1RONOGfynL/lO1A/A8akOZ/4Xk7GhoQy6pBx2fwkmKOJZMQQ/Q0ZFzVHP0VIlUlVVlw+GKR6p/wYBTNFzSGjLu6SMk3iDhl04NfllbH+ZZUEUDWbqn9XjkgkWBaqlJh0eHQopkwwLDU7eu0a1fWHs9eRQqeHNF4OSYfMNFvVkHSzZ0oMqP9VZBytcy9O6JptTZGJ72SZqdrvJjT3Au6VgxVds+70t+cFkvdjifIP/BkAAAAASUVORK5CYII=);
                    background-size: 102px 24px; top: 68px; right: 22px; z-index: 25;
                }

                /* Force Z-Index High for Buttons */
                claw-button.pix {
                    position: absolute;
                    z-index: 5000000000 !important; 
                    width: 48px; height: 48px; margin: 12px 24px 0 0;
                    border: 0; background-color: transparent;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAFRJREFUKFNjZICC/////4exsdGMjIyMIHEwQUgxzACQJkZsikOPfAarWW3Di2EZhgaYYphKdE0oGtAVY9ME14BLMbomypwEMo0kP9BGA8kRR2rSAACHREftd0fKPgAAAABJRU5ErkJggg==);
                    background-size: 48px 48px; filter: sepia(1) brightness(0.4);
                    pointer-events: none; cursor: pointer; display: inline-block;
                }
                claw-button.hori-btn { transform: rotate(90deg); }
                claw-button.active { animation: pulse infinite 1s; pointer-events: auto; filter: none; cursor: pointer; }
                @keyframes pulse { 0%, 100% { filter: sepia(0); } 50% { filter: sepia(1); } }

                .toy { position: absolute; pointer-events: none; transition: transform 1s; }
                .toy::after { content: ''; position: absolute; image-rendering: pixelated; background-repeat: no-repeat; }
                
                /* Sprites */
                .toy.bear::after {
                    width: 48px; height: 60px;
                    top: -4px; left: -4px;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAAAXNSR0IArs4c6QAAATNJREFUSEvtVssNwjAMbcUZwQLcYQfWQLAAU7FAEWuwA9xZAMQZgRzpRY7rOEkbTtALtLHfc54/ctuwZ7ucvfF6vD5afpb6H/P1IGTwOtw8zmS/aHJJLF9HoBmkItbOtQADAoqanu5yH4Lf7FZz50dEUCCQaCiwjIaIIK+/QS1wkIHk+wSU4NrR81u0GgGSlUscs6fvP0awOT+dvKf1NKjMYokGdZni5HKAUWEllAzlufaNcxT3AWQASKrCAoKcW5TI1hsVcK7RdByccH0OMAXpF1O1JGrNnwaeazQ+x0tBLXsK1CRAvaP+JVjqPEmgNZUkiZFD6iyJZOeCxAL3BChRnqSxeUCRuCRzsBoJl9vIn6CXrlESIXlWY5oEqCgNgDvGikFbN9UFly+y0EDuqTk25PsBag8IsJphwl4AAAAASUVORK5CYII=); 
                    background-size: 48px 60px;
                }
                .toy.bear.grabbed::after {
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAAAXNSR0IArs4c6QAAAUNJREFUSEvllr0NAjEMhe9EjWABetiBNRAswFQsAGINdoCeBUDUCORIL3KM48RHqLiGn8T+bD87l75jz3o+eeHn4XLv+Vrpe842OqENz901+hltZ10txLINAG1DKWJtXQswAVDU9OzPtyH+u81iGuwIhAokJRrqWEZDIJQ3ZtDKOWCA/B5AAreOnmfRawBKzwvVbOg/FUAReCC5vSagFmIF4s5gdXqE8h6X46Qz3Rl4ysMFlbqFDHBUWKLmBCzZ0LBVAaAHr0upy5JBq8nCczh9HBUwbjF03Dn5jSXCKUifOFU9UWv2QQP5LvA6tfZToCYA/Y7+l85K60WANlQSkoOj1FUlkpMLiOU8AtCiXKRvdUCTxEHjbcpf3ENA8jaS3H1adNSfAyCepZNZInSU5oAb5rTSrpvqBZdfZNFJ8p5as4ds30LPDrDvwGtOAAAAAElFTkSuQmCC);
                }
                
                .toy.bunny::after { width: 48px; height: 64px; top: -4px; left: -4px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAAN1JREFUSEvtVtsNgzAMTCYoY9CJ2hHpRDBGO0Grq2TkOg4+KlAfSv4wjs+cH1xO5pz6w93aLtMtWxueGd+Xi7gwjNci1vnYJQvC+s4AtQuCpkHW+DYAr/ZJ09ko2o4iRAK3ON6saKSiBlFfu2kGRgHJewTXw/kZAJZrnalXG8Rxv6ABrC4yKLO979ls51Zr4LW41EXeRcMmg/lcdnvMwjxoktGWIH+8KpjOiBafjlF00W8CWIXG9PcSTXpeINYoZRfxXvubwf5dAMwatzq2UM2MqGV8hLa3ZTkj3QHyACJNPMzl3sUuAAAAAElFTkSuQmCC);
                background-size: 48px 64px;
                }
                
                .toy.bunny.grabbed::after { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAAOxJREFUSEvtVsENwjAMTCaAMWAiGBEmgjFgAqpDcmUcp76UVAWpfbVR7LMv5/RyMs/psHvZtev9me0avpm9H4EIuNweRa7zcZ8sCLt3BKgFCJoGadm7AXhnnzSdG0X9KEImcIvHmxWNVJxBpGu3zGBRQPISyfVwrgPAch1RhzxuB60Atf1dAJBEVKXfRXVdOqhRVe3ABtjKpDpmHmgVCc8CHiUfKZJfHxMQqcabZvo2nZMcMW+AJaZ5navCU0sLNVZdhUz/E8A6tG/lqucFZo1ydi3nYF3gbwEw1/hkB1NDx3hTzyTPtuWMdUfBA5gROcxJDOyoAAAAAElFTkSuQmCC); }

                .toy.golem::after { width: 52px; height: 60px; top: -2px; left: -6px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAYAAAAy2w7YAAAAAXNSR0IArs4c6QAAAQpJREFUSEtjZEAC4Rr8/5H5K298ZKSWPNwgkCVFtRXI5jL0NXcwwCyjVB7FooXbVqFYFO8VhmIRJfJgi0CuRTcEZiPIMhCgRB4UKoz4LEHxHgUckGNHiEWE4gVXKOLShzPoRi0ilBUGZ6qDxRt6QsCVkZHV0ddHhIogCgoEsFZYeYm3UKWWJSBzMOob9KqCXMuQqxi4RbAKj5iIJcViWAIiWHpfPH4ObK6+pRHcfGLFSEp1xBqKTd3gtIiU+MCnFpxhYfkIX3VNroUoiQG9OUWtlIfcsMGaj0aeRcTWvhQFHaEGJXreQW5So5R1sBSIq7wj1ESGWYRezmEkBphC9MY+TJxQox+XOpA4AFO+HuQ4QuSjAAAAAElFTkSuQmCC); background-size: 52px 60px; }
                
                .toy.golem.grabbed::after { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAYAAAAy2w7YAAAAAXNSR0IArs4c6QAAARhJREFUSEtjZEAC4Rr8/5H5K298ZKSWPNwgkCVFtRXI5jL0NXcwwCyjVB7FooXbVqFYFO8VhmIRJfJgi0CuRTcEZiPIMhCgRB4UKoz4LEHxHgUckGNHgEWwOIGFFK64QQ9JfPqwBt2oRejZAFuQk5zqKAlWkpL30LCIUBFEQYEA1gorL/EWqtSyBGQORn2DXlWQaxlyFQO3CFbhEVsKEGs5LPEQLL0vHj8HNlPf0ghuNrFiyI4hmI+INRSbusFpEbFxQUgdOOhg+QhfdU3IIFzyKIkBWRE1q3Xkhg3WfEStJD50LCLU/EKun5BbuhhFEL6gI9SgRM87OC2CpUBc5R2hJjLMIvRyDiMxwBSiN/Zh4oQa/bjUgcQBMesk5BS8p3gAAAAASUVORK5CYII=); }
                
                .toy.cucumber::after { width: 32px; height: 60px; top: 2px; left: 0; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAYAAAAl+Z4RAAAAAXNSR0IArs4c6QAAAIVJREFUSEtjZEAD4Rr8/9HFkPkrb3xkRObDOTCNzFvP4NPP8NfbBCwPMwhsAEgzIY3opoIMAhnCSI5mmGEgQ1AMgDkPl2vQ5QehAXiDH4skhheQ1cD8CxPDFi54DSDGNaMGMIDzBXWTMjEhjx7Voy4YjYXhkhIprlhgmYOiqg05h5FauQIAKIamV0t/KUgAAAAASUVORK5CYII=); background-size: 32px 60px; }

                .toy.cucumber.grabbed::after { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAYAAAAl+Z4RAAAAAXNSR0IArs4c6QAAAIdJREFUSEtjZEAD4Rr8/9HFkPkrb3xkRObDOTCNzFvP4NPP8NfbBCwPMwhsAEgzIY3opoIMAhnCSI5mmGEgQ1AMgDkPl2vQ5QehAbiCH+RUbN7C8AKyATD/gsTwhQl1YwFvCsIiidcLxBg2agADOGeORuNoGAyXdEBxxQIrOCiq2pBLH1IrVwA8halXrQxpsQAAAABJRU5ErkJggg==); }

                .toy.penguin::after { width: 52px; height: 48px; top: -2px; left: -2px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAAXNSR0IArs4c6QAAAPBJREFUSEtjZMACwjX4/2MTJ1Zs5Y2PjOhqUQRgFvyd/ZhYM7GqY06VBYsjWwi3CGQJpRag2wqyEGYZ2CJaWAKzFGYZIy0tQbYMq0WwMCY1KHHpA4mPYItgwYKespCDl+Sgw5ZMF25bhTXPxHuFMRCKS5xxNGAWgSwmJuhwFScEfbTahpekoij0yGecRRJK8kZ29YrrH0iyBKY4QlMArg8Wd3h9BJIk1TKQJdgSxqhFBOOM6KCja2IgNUnj8iZyUgcnBmwVH6WWoVsCqmXpV8PCvA6qaXEVnDA1oAIU1gYgVT3WVhCucEdvRhFqliGrBwDOBdzprDO9jAAAAABJRU5ErkJggg==); background-size: 52px 48px; }
                .toy.penguin.grabbed::after { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAAXNSR0IArs4c6QAAAP9JREFUSEtjZMACwjX4/2MTJ1Zs5Y2PjOhqUQRgFvyd/ZhYM7GqY06VBYsjWwi3CGQJpRag2wqyEGYZ2CJaWAKzFGYZIy0tQbZsYC2CRSapcYZLH0gcw0cgQZgFyGxCyRCfPqwW4TIQ5lp0eWJ8TbRFIIULt63C6oZ4rzB4COBzJFGJgW4WgVxK06BbbcNLKA2gyIce+YyzSEIJOmRXr7j+gSRLYIojNAXg+pBTL844AllKqmUgS7ClQrypbtQiUMQQHXR0TQykJmlcSRM5qYMTA7aKj1LL0C0B1bL0q2FhXgfVtLgKTpgaUAEKawOQqh5rKwhXuKM3owg1y5DVAwDi4Nbp/c5ePwAAAABJRU5ErkJggg==); }
                .toy.robot::after { width: 48px; height: 64px; top: -2px; left: -4px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAAO5JREFUSEtjZMADwjX4/+OTh8mtvPGREZc6nBIgw1dc/0CM+QwRmgIMuCwBW0CsS4myDUkRyFJGkOFFtRWk6iVKfV9zB8OoBXiDamCCCGQrCJAa8dj0YfXBqAXIQTswkYye7mBxgis94ksMg8MHRBU6OBSBfUDz0hRmOTVLVZDLYfUDvMKhqQWwCgeWIsyiyKsfTi2DFDOwlAevcEBVI6jao6YFMDPBFc6oBbCUiBwH8CBCzgfUjAOQueBIHh75ABZMpFaTuMop+udk5HigpPTE1hjGaPziavQiN3CJUQOzDGvrGltjGL31TIwakCUAkfj3fsmx0PsAAAAASUVORK5CYII=); background-size: 48px 64px; }
                .toy.robot.grabbed::after { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAAPtJREFUSEtjZMADwjX4/+OTh8mtvPGREZc6nBIgw1dc/0CM+QwRmgIMuCwBW0CsS4myDUkRyFJGkOFFtRWk6iVKfV9zB8OoBXiDahgGEchLyIDY1IVLH0YQ0dwCohI3CYqIimSQIlxBhU8O5A6iLIApxOZwQnFEtAUkhAqKUvpYQPPSFOYnapaqoKCB1Q/wCoemFsAqHFiqMIsir344tQxSEsAyLLzCAVWNoGqPmhbAzARXOKMWwFIichzAgwg5H1AzDkDmgiN5eOQDWDARKh2JLfTon5OR44FYV+JTh9xOxWj84mr0IjdwiVEDcwDW1jW2xjB665kYNSBLAOSw8X4zbpm3AAAAAElFTkSuQmCC); }
            `}</style>

            {/* Launch Button */}
            {!isOpen && (
                <div className="claw-wrapper">
                    <button className="claw-toggle" onClick={() => setIsOpen(true)}>
                        <div style={{
                            width: '32px', height: '32px',
                            backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAAAXNSR0IArs4c6QAAAGRJREFUKFNjZMADwjX4/6+88ZERpARMYAMgRSuuf2CI0BRgACnGqhCmCGYASDGGQmyKMEzEpQjFjfgUwRUSUgRWSIwi0hSCVBNjKjx4CClGCUeiggcWC0QFOD7FlCUKZJNhyQwAi8VlK14hrsQAAAAASUVORK5CYII=)`,
                            backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
                            transform: 'rotate(-45deg)'
                        }} />
                    </button>
                </div>
            )}

            {/* Modal */}
            {isOpen && (
                <div className="claw-modal" onClick={() => setIsOpen(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>

                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <Image src="/images/icons/cross.svg" alt="Close" width={48} height={48} />
                        </button>

                        <div className="collection-box pix">
                            {collectedToys.map((type, i) => (
                                <div key={i} className={`toy-wrapper ${i >= 6 ? 'squeeze-in' : ''}`}>
                                    <div className={`toy pix ${type}`}></div>
                                </div>
                            ))}
                        </div>

                        <div className={`claw-machine ${showOverlay ? 'show-overlay' : ''}`} ref={machineRef}>
                            <div className="box pix" ref={boxRef}>
                                <div className="machine-top pix">
                                    <div
                                        className="arm-joint pix"
                                        ref={armJointRef}
                                    >
                                        <div
                                            className={`arm pix ${clawClass}`}
                                            ref={armRef}
                                        >
                                            <div className="claws pix"></div>
                                        </div>
                                    </div>
                                    <div className="rail vert pix" ref={railVertRef}></div>
                                    <div className="rail hori pix" ref={railHoriRef}></div>
                                </div>
                                <div className="machine-bottom pix">
                                    <div className="collection-point pix"></div>
                                </div>

                                {/* Toys */}
                                {renderToys.map((toy) => (
                                    <div
                                        key={toy.id}
                                        ref={el => { if (el) toyElementsRef.current.set(toy.id, el); }}
                                        className={`toy pix ${toy.type}`}
                                        style={{
                                            left: `${toy.x}px`,
                                            top: `${toy.y}px`,
                                            width: `${toy.w}px`,
                                            height: `${toy.h}px`,
                                            zIndex: toy.z
                                        }}
                                    ></div>
                                ))}
                            </div>

                            <div className="control pix">
                                <div className="cover left"></div>
                                <div className="cover right">
                                    <div className="instruction pix"></div>
                                </div>

                                <button
                                    className={`claw-button hori-btn pix ${horiBtnActive ? 'active' : ''}`}
                                    onMouseDown={handleHoriPress}
                                    onMouseUp={handleHoriRelease}
                                    onTouchStart={handleHoriPress}
                                    onTouchEnd={handleHoriRelease}
                                ></button>
                                <button
                                    className={`claw-button vert-btn pix ${vertBtnActive ? 'active' : ''}`}
                                    onMouseDown={handleVertPress}
                                    onMouseUp={handleVertRelease}
                                    onTouchStart={handleVertPress}
                                    onTouchEnd={handleVertRelease}
                                ></button>

                                <div className="cover bottom"></div>
                                <div className="cover top">
                                    <div className={`collection-arrow pix ${showCollectionArrow ? 'active' : ''}`}></div>
                                </div>
                                <div className="collection-point pix"></div>
                            </div>
                        </div>
                        <div className={`pix ${tiny5.className}`} style={{ color: 'navy', marginTop: '16px' }}>
                            CLICK + HOLD ARROW KEYS OR MACHINE BUTTONS
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClawMachine;
