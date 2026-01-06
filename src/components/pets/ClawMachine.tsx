"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { tiny5 } from '@/lib/fonts';

interface Position {
    x: number;
    y: number;
}

interface ToyData {
    w: number;
    h: number;
}

interface Toy extends Position {
    id: number; // Unique ID for keying
    type: string;
    w: number;
    h: number;
    z: number;
    angle: number;
    index: number;
    grabbed?: boolean;
    selected?: boolean;
    falling?: boolean; // New state for drop animation
    transformOrigin: string;
    clawPos?: Position;
}

const ClawMachine: React.FC = () => {
    // --- Constants ---
    const m = 2;
    const machineWidth = 160 * m;
    const machineHeight = 180 * m;
    const machineTopHeight = 70 * m;
    const machineBottomHeight = 70 * m;
    const cornerBuffer = 16;
    const machineBuffer = { x: 36, y: 16 };
    const maxArmLength = machineHeight - machineTopHeight - machineBuffer.y * 2;

    // --- State ---
    const [isOpen, setIsOpen] = useState(false);
    const [armPosition, setArmPosition] = useState({ x: 0, y: 0 });
    const [armHeight, setArmHeight] = useState(28 * m);
    const [shadowScale, setShadowScale] = useState(0.5);
    const [railPosition, setRailPosition] = useState({ x: 0 });
    const [toys, setToys] = useState<Toy[]>([]);
    const [collectedToys, setCollectedToys] = useState<string[]>([]);
    const [targetToyId, setTargetToyId] = useState<number | null>(null);

    const [horiActive, setHoriActive] = useState(false);
    const [vertActive, setVertActive] = useState(false);
    const [clawOpen, setClawOpen] = useState(false);
    const [clawMissed, setClawMissed] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showCollectionArrow, setShowCollectionArrow] = useState(false);

    // --- Refs ---
    const machineRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const horiIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const vertIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isHoriPressedRef = useRef(false);
    const isVertPressedRef = useRef(false);

    const toyTypes: Record<string, ToyData> = {
        bear: { w: 20 * m, h: 27 * m },
        bunny: { w: 20 * m, h: 29 * m },
        golem: { w: 20 * m, h: 27 * m },
        cucumber: { w: 16 * m, h: 28 * m },
        penguin: { w: 24 * m, h: 22 * m },
        robot: { w: 20 * m, h: 30 * m },
    };

    // --- Helpers ---
    const radToDeg = (rad: number) => Math.round(rad * (180 / Math.PI));
    const randomN = (min: number, max: number) => Math.round(min - 0.5 + Math.random() * (max - min + 1));
    const calcX = (i: number, n: number) => i % n;
    const calcY = (i: number, n: number) => Math.floor(i / n);
    const adjustAngle = (angle: number) => {
        const adjustedAngle = angle % 360;
        return adjustedAngle < 0 ? adjustedAngle + 360 : adjustedAngle;
    };

    // --- Initialization ---
    useEffect(() => {
        if (isOpen) {
            // Reset Game State on Open
            setCollectedToys([]);
            setArmPosition({ x: 0, y: 0 });
            setRailPosition({ x: 0 });
            setArmHeight(28 * m);
            setHoriActive(false);
            setVertActive(false);
            setClawMissed(false);
            setClawOpen(false);

            const allToys = [...Object.keys(toyTypes), ...Object.keys(toyTypes)].sort(() => 0.5 - Math.random());
            const initialToys: Toy[] = allToys
                .filter((_, i) => i !== 8)
                .map((toyType, index) => {
                    const actualIndex = index >= 8 ? index + 1 : index;
                    const size = toyTypes[toyType];
                    return {
                        id: index,
                        type: toyType,
                        x: cornerBuffer + calcX(actualIndex, 4) * ((machineWidth - cornerBuffer * 3) / 4) + size.w / 2 + randomN(-6, 6),
                        y: machineHeight - machineBottomHeight + cornerBuffer + calcY(actualIndex, 4) * ((machineBottomHeight - cornerBuffer * 2) / 3) - size.h / 2 + randomN(-2, 2),
                        z: 0,
                        angle: 0,
                        index: actualIndex,
                        transformOrigin: 'center',
                        ...size,
                    };
                });
            setToys(initialToys);

            // Initial Animation Sequence
            setTimeout(async () => {
                await moveArmDown();
                await moveRailRight();
                setHoriActive(true);
            }, 500);

            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    // Keyboard Listeners
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && horiActive && !isHoriPressedRef.current) {
                handleHoriPress();
            } else if (e.key === 'ArrowUp' && vertActive && !isVertPressedRef.current) {
                handleVertPress();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && isHoriPressedRef.current) {
                handleHoriRelease();
            } else if (e.key === 'ArrowUp' && isVertPressedRef.current) {
                handleVertRelease();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isOpen, horiActive, vertActive]);

    // Shadow Scale
    useEffect(() => {
        setShadowScale(0.5 + armHeight / maxArmLength / 2);
    }, [armHeight]);


    // --- Game Logic Functions ---

    const moveArmDown = () => new Promise<void>((resolve) => {
        const target = machineTopHeight - machineBuffer.y;
        const interval = setInterval(() => {
            setArmPosition((prev) => {
                const distance = Math.abs(prev.y - target);
                const step = distance < 10 ? distance : 10;
                if (distance < 1) {
                    clearInterval(interval);
                    resolve();
                    return { ...prev, y: target };
                }
                return { ...prev, y: prev.y + (prev.y > target ? -step : step) };
            });
        }, 20);
    });

    const moveRailRight = () => new Promise<void>((resolve) => {
        const target = machineBuffer.x;
        const interval = setInterval(() => {
            setRailPosition((prev) => {
                const distance = Math.abs(prev.x - target);
                const step = distance < 10 ? distance : 10;
                if (distance < 1) {
                    clearInterval(interval);
                    setArmPosition((arm) => ({ ...arm, x: target }));
                    resolve();
                    return { x: target };
                }
                const nextX = prev.x + (prev.x > target ? -step : step);
                setArmPosition((arm) => ({ ...arm, x: nextX }));
                return { x: nextX };
            });
        }, 20);
    });

    // Horizontal Movement (User Controlled)
    const handleHoriPress = () => {
        if (!horiActive) return;
        isHoriPressedRef.current = true;
        setClawMissed(false);

        const target = machineWidth - 10 - machineBuffer.x;
        horiIntervalRef.current = setInterval(() => {
            setRailPosition((prev) => {
                const step = 4;
                if (prev.x >= target) {
                    handleHoriRelease();
                    return prev;
                }
                const nextX = prev.x + step;
                setArmPosition((arm) => ({ ...arm, x: nextX }));
                return { x: nextX };
            });
        }, 20);
    };

    const handleHoriRelease = () => {
        if (horiIntervalRef.current) {
            clearInterval(horiIntervalRef.current);
            horiIntervalRef.current = null;
        }
        if (isHoriPressedRef.current) {
            isHoriPressedRef.current = false;
            setHoriActive(false);
            setVertActive(true);
        }
    };

    // Vertical Movement (User Controlled)
    const handleVertPress = () => {
        if (!vertActive) return;
        isVertPressedRef.current = true;

        const target = machineBuffer.y; // Move visually "up" / back
        vertIntervalRef.current = setInterval(() => {
            setArmPosition((prev) => {
                const step = 4;
                if (prev.y <= target) {
                    handleVertRelease();
                    return prev;
                }
                return { ...prev, y: prev.y - step };
            });
        }, 20);
    };

    const handleVertRelease = () => {
        if (vertIntervalRef.current) {
            clearInterval(vertIntervalRef.current);
            vertIntervalRef.current = null;
        }
        if (isVertPressedRef.current) {
            isVertPressedRef.current = false;
            setVertActive(false);
            startGrabSequence();
        }
    };

    // Grabbing Logic
    const startGrabSequence = () => {
        const toyId = getClosestToy();
        setTargetToyId(toyId);

        setTimeout(() => {
            setClawOpen(true);
            // Lower arm
            const lowerArm = setInterval(() => {
                setArmHeight((prev) => {
                    if (prev >= maxArmLength) {
                        clearInterval(lowerArm);

                        // Grab action
                        setTimeout(() => {
                            setClawOpen(false);

                            if (toyId !== null) {
                                // Update toy to grabbed state
                                setToys(prevToys => prevToys.map(t => {
                                    if (t.id === toyId) {
                                        const clawPos = { x: armPosition.x + 5, y: armPosition.y + maxArmLength };
                                        const angle = radToDeg(Math.atan2(t.y + t.h / 2 - clawPos.y, t.x + t.w / 2 - clawPos.x)) - 90;
                                        const adjusted = adjustAngle(angle);
                                        const finalAngle = adjusted < 180 ? adjusted * -1 : 360 - adjusted;

                                        return {
                                            ...t,
                                            grabbed: true,
                                            z: 10,
                                            angle: finalAngle,
                                            transformOrigin: `${clawPos.x - t.x}px ${clawPos.y - t.y}px`,
                                            clawPos
                                        };
                                    }
                                    return t;
                                }));
                            } else {
                                setClawMissed(true);
                            }

                            // Retract
                            setTimeout(() => raiseArmBack(), 500);
                        }, 500);
                        return prev;
                    }
                    return prev + 8; // Drop speed
                });
            }, 20);
        }, 500);
    };

    const getClosestToy = () => {
        const shadowCenterX = armPosition.x + 5;
        const shadowCenterY = armPosition.y + maxArmLength;
        const clawRect = { x: shadowCenterX - 20, y: shadowCenterY - 16, w: 40, h: 32 };

        const overlapped = toys
            .filter(t => !t.selected &&
                clawRect.x < t.x + t.w && clawRect.x + clawRect.w > t.x &&
                clawRect.y < t.y + t.h && clawRect.y + clawRect.h > t.y
            )
            .sort((a, b) => b.index - a.index); // Sort by index (simulated depth)

        return overlapped.length > 0 ? overlapped[0].id : null;
    };

    const raiseArmBack = () => {
        const raise = setInterval(() => {
            setArmHeight(prev => {
                if (prev <= 28 * m) {
                    clearInterval(raise);
                    moveRailBack();
                    return 28 * m;
                }
                return prev - 8;
            });
        }, 20);
    };

    const moveRailBack = () => {
        const targetX = machineBuffer.x;
        const move = setInterval(() => {
            setRailPosition(prev => {
                if (Math.abs(prev.x - targetX) < 4) {
                    clearInterval(move);
                    setArmPosition(a => ({ ...a, x: targetX }));
                    moveArmDownFinal();
                    return { x: targetX };
                }
                const nextX = prev.x + (prev.x > targetX ? -4 : 4);
                setArmPosition(a => ({ ...a, x: nextX }));
                return { x: nextX };
            });
        }, 20);
    };

    const moveArmDownFinal = () => {
        const targetY = machineTopHeight - machineBuffer.y;
        const move = setInterval(() => {
            setArmPosition(prev => {
                if (Math.abs(prev.y - targetY) < 4) {
                    clearInterval(move);
                    dropToy();
                    return { ...prev, y: targetY };
                }
                return { ...prev, y: prev.y + (prev.y < targetY ? 4 : -4) };
            });
        }, 20);
    };

    const dropToy = () => {
        setClawOpen(true);

        if (targetToyId !== null) {
            // Calculate final drop position and set "Falling" state
            setToys(prev => prev.map(t => {
                if (t.id === targetToyId && t.clawPos) {
                    const offsetX = t.x - t.clawPos.x;
                    const offsetY = t.y - t.clawPos.y;
                    const currentClawX = armPosition.x + 5;
                    const currentClawY = armPosition.y + armHeight;

                    return {
                        ...t,
                        x: currentClawX + offsetX,
                        y: currentClawY + offsetY,
                        grabbed: false,
                        falling: true, // Trigger CSS fall
                        angle: 0,
                        transformOrigin: 'center'
                    };
                }
                return t;
            }));

            // Wait for fall animation then collect
            setTimeout(() => {
                const toy = toys.find(t => t.id === targetToyId);
                if (toy) collectToy(toy);
                setTargetToyId(null);
            }, 600);
        }

        setTimeout(() => {
            setClawOpen(false);
            setHoriActive(true);
        }, 1000);
    };

    const collectToy = (toy: Toy) => {
        setCollectedToys(prev => [...prev, toy.type]);
        setShowOverlay(true);
        setShowCollectionArrow(true);

        // Remove from active toys
        setToys(prev => prev.filter(t => t.id !== toy.id));

        setTimeout(() => {
            setShowOverlay(false);
            if (toys.length > 0) setShowCollectionArrow(false);
        }, 1000);
    };

    // --- Render ---
    return (
        <>
            <style jsx>{`
                /* Styles derived from original HTML/CSS provided */
                * { box-sizing: border-box; }
                .pix, .pix::before, .pix::after { image-rendering: pixelated; }
                .pix::before, .pix::after { position: absolute; content: ''; }

                /* Launch Button */
                .claw-wrapper {
                    position: fixed; bottom: 15px; left: 15px; z-index: 9999;
                }
                .claw-toggle {
                    width: 60px; height: 60px;
                    border-radius: 50%; border: 3px solid #fff;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    background-color: #84dfe2; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    transition: transform 0.2s;
                }
                .claw-toggle:hover { transform: scale(1.05); }

                /* Modal Overlay */
                .claw-modal {
                    position: fixed; inset: 0;
                    background-color: rgba(132, 223, 226, 0.95);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 10000; animation: fadeIn 0.3s forwards;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                .close-btn {
                    position: absolute; top: -50px; right: -50px;
                    background: none; border: none; cursor: pointer;
                    z-index: 20;
                }

                /* Collection Box (Inventory) */
                .collection-box {
                    width: ${machineWidth}px; height: 64px;
                    margin: -74px 0 24px; display: flex; align-items: end; justify-content: start;
                }
                .collection-box .toy-wrapper {
                    position: relative; width: calc(100% / 6); display: flex; align-items: end; justify-content: center;
                }
                .toy-wrapper.squeeze-in { width: 0; animation: squeeze-in forwards 0.4s 1.4s; }
                @keyframes squeeze-in { 0% { width: 0; } 100% { width: calc(100% / 6); } }
                .toy-wrapper .toy {
                    opacity: 0; transform: translateY(-100vh);
                    animation: show-toy-2 0.8s 1s forwards;
                }
                @keyframes show-toy-2 { 0% { opacity: 0; transform: translateY(-100vh); } 100% { opacity: 1; transform: translateY(0); } }

                /* Machine Box */
                .claw-machine {
                    display: flex; flex-direction: column;
                    border: 4px solid #57280f; overflow: hidden;
                    position: relative; background-color: #84dfe2;
                    transform: scale(1);
                }
                .claw-machine.show-overlay::after {
                    content: ''; position: absolute; inset: 0;
                    background-color: #32c2db; opacity: 0.6;
                    z-index: 6; pointer-events: none;
                }

                .box {
                    position: relative; background-color: #7fcfed;
                    width: ${machineWidth}px; height: ${machineHeight}px;
                }
                .box::before { /* Brown bar */
                    background-color: #57280f; top: ${machineTopHeight}px;
                    width: 100%; height: 16px; z-index: 5;
                }
                .box::after { /* Right bar */
                    background-color: #32c2db; top: ${machineTopHeight}px; right: 0;
                    width: 16px; height: 340px; z-index: 2;
                }

                .machine-top {
                    position: absolute; width: 100%; height: ${machineTopHeight}px;
                    top: 0; display: flex; align-items: center; z-index: 1;
                    pointer-events: none; /* Let clicks pass through glass */
                }
                .machine-top::after {
                    content: ''; position: absolute; inset: 0;
                    background-color: rgba(112, 247, 243, 0.45); z-index: -1;
                }
                .machine-bottom {
                    position: absolute; width: 100%; height: ${machineBottomHeight}px;
                    bottom: 0; background-color: #def7f6;
                }
                
                /* Collection Point (Hole) */
                .collection-point {
                    position: absolute; bottom: 0; left: 0;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAMCAYAAABm+U3GAAAAAXNSR0IArs4c6QAAADBJREFUOE9jtJqy/T8DFcGxHE9GkHGM1DYYZCjIcJoYTDMXjxqMkrZGIw8eHEMvKADnSiE1EAXSagAAAABJRU5ErkJggg==);
                    width: 88px; height: 48px; background-size: 88px 48px;
                    z-index: 2; /* Increased Z to show */
                }

                /* Mechanical */
                .rail { position: absolute; top: 0; left: 0; border: solid #33a5da; background-color: #fff; transition: 0.3s; }
                .rail.hori { height: 10px; width: 100%; border-width: 2px 0; z-index: 1; }
                .rail.vert { height: ${machineTopHeight}px; width: 10px; border-width: 0 2px; z-index: 1; }

                .arm-joint { position: absolute; width: 10px; height: 10px; z-index: 4; transition: 0.3s; }
                .arm-joint::after {
                    position: absolute; border: solid #33a5da 2px; background-color: #fff;
                    width: 20px; height: 20px; top: -5px; left: -5px;
                }
                .arm-joint::before {
                    width: 40px; height: 32px; margin-left: -30px; margin-top: ${maxArmLength}px;
                    transform: scale(var(--shadow-scale, 0.5));
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAF5JREFUOE9jZMABrKZs/49LDiR+LMeTEZs8iiAhQ3BZgGw43EByDYNZAjMUbCClhiEbSn0DqeU6mCsZRw3El5aJkqN+GA7+dAgLGEqTD0rWo9RQrIUDehQScjGu4gsAxKQ3Ke4v44gAAAAASUVORK5CYII=);
                    background-size: 40px 32px; z-index: -1; opacity: 0.5;
                }

                .arm {
                    position: absolute; width: 14px; background-color: #fff;
                    box-shadow: 0 0 0 2px #33a5da; margin-top: -2px; margin-left: -2px;
                    transition: 0.3s; transform-origin: top center;
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
                .claws::before, .claws::after {
                    top: 0; width: 20px; height: 32px; transition: 0.2s; background-size: 20px 32px;
                }
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

                /* Controls */
                .control {
                    position: relative; height: 120px; width: 100%;
                    background-color: #3a94b7; text-align: right;
                    border-top: 2px solid #57280f;
                }
                .control .collection-point {
                    filter: brightness(0.8); bottom: 16px;
                }
                .cover { position: absolute; background-color: #32c2db; z-index: 4; }
                .cover.top { top: 0; width: 100%; height: 32px; }
                .cover.bottom { bottom: 0; width: 100%; height: 16px; background-color: #57280f; }
                .cover.left { bottom: 0; left: 0; height: 340px; width: 16px; }
                .cover.right { top: 0; right: 0; height: 100%; width: 232px; }

                .collection-arrow {
                    position: absolute; left: 42px; top: 18px; width: 16px; height: 8px;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAYAAACzzX7wAAAAAXNSR0IArs4c6QAAAClJREFUGFdjDDn86T8DHsAIksOlaI0tHyNYATZFIEmQOFwBsiKYJEgMAPTvDw1xBcM+AAAAAElFTkSuQmCC);
                    background-size: 16px 8px; filter: sepia(1) brightness(0.5);
                    opacity: 0; transition: opacity 0.3s; z-index: 6;
                }
                .collection-arrow.active { opacity: 1; }

                .instruction {
                    position: absolute; width: 102px; height: 24px;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAMCAYAAADPjYVSAAAAAXNSR0IArs4c6QAAAPRJREFUSEvdVkESwkAIs0d9hv9/k8/Qow4d6aSZBKjjRfdSdltYIBC63B735+m9rufLkvuQ4/joHnVCRjsp531hG89w7+S0r3xdnc8X1RONOGfynL/lO1A/A8akOZ/4Xk7GhoQy6pBx2fwkmKOJZMQQ/Q0ZFzVHP0VIlUlVVlw+GKR6p/wYBTNFzSGjLu6SMk3iDhl04NfllbH+ZZUEUDWbqn9XjkgkWBaqlJh0eHQopkwwLDU7eu0a1fWHs9eRQqeHNF4OSYfMNFvVkHSzZ0oMqP9VZBytcy9O6JptTZGJ72SZqdrvJjT3Au6VgxVds+70t+cFkvdjifIP/BkAAAAASUVORK5CYII=);
                    background-size: 102px 24px; top: 68px; right: 22px; z-index: 6;
                }

                button {
                    position: relative; z-index: 5;
                    width: 48px; height: 48px; margin: 12px 12px 0 0;
                    border: 0; background-color: transparent;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAFRJREFUKFNjZICC/////4exsdGMjIyMIHEwQUgxzACQJkZsikOPfAarWW3Di2EZhgaYYphKdE0oGtAVY9ME14BLMbomypwEMo0kP9BGA8kRR2rSAACHREftd0fKPgAAAABJRU5ErkJggg==);
                    background-size: 48px 48px; filter: sepia(1) brightness(0.4);
                    pointer-events: none; cursor: pointer; display: inline-block;
                }
                button.hori-btn { transform: rotate(90deg); }
                button.active { animation: pulse infinite 1s; pointer-events: all; filter: none; }
                @keyframes pulse { 0%, 100% { filter: sepia(0); } 50% { filter: sepia(1); } }

                /* Toys */
                .toy { position: absolute; pointer-events: none; transition: transform 1s; }
                .toy.falling { transition: top 0.5s ease-in; top: 1000px !important; }
                .toy::after { content: ''; position: absolute; image-rendering: pixelated; background-repeat: no-repeat; }
                
                /* Toy Sprites */
                .toy.bear::after { width: 48px; height: 60px; top: -4px; left: -4px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAAAXNSR0IArs4c6QAAATNJREFUSEvtVssNwjAMbcUZwQLcYQfWQLAAU7FAEWuwA9xZAMQZgRzpRY7rOEkbTtALtLHfc54/ctuwZ7ucvfF6vD5afpb6H/P1IGTwOtw8zmS/aHJJLF9HoBmkItbOtQADAoqanu5yH4Lf7FZz50dEUCCQaCiwjIaIIK+/QS1wkIHk+wSU4NrR81u0GgGSlUscs6fvP0awOT+dvKf1NKjMYokGdZni5HKAUWEllAzlufaNcxT3AWQASKrCAoKcW5TI1hsVcK7RdByccH0OMAXpF1O1JGrNnwaeazQ+x0tBLXsK1CRAvaP+JVjqPEmgNZUkiZFD6iyJZOeCxAL3BChRnqSxeUCRuCRzsBoJl9vIn6CXrlESIXlWY5oEqCgNgDvGikFbN9UFly+y0EDuqTk25PsBag8IsJphwl4AAAAASUVORK5CYII=); background-size: 48px 60px; }
                .toy.bear.grabbed::after { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAAAXNSR0IArs4c6QAAAUNJREFUSEvllr0NAjEMhe9EjWABetiBNRAswFQsAGINdoCeBUDUCORIL3KM48RHqLiGn8T+bD87l75jz3o+eeHn4XLv+Vrpe842OqENz901+hltZ10txLINAG1DKWJtXQswAVDU9OzPtyH+u81iGuwIhAokJRrqWEZDIJQ3ZtDKOWCA/B5AAreOnmfRawBKzwvVbOg/FUAReCC5vSagFmIF4s5gdXqE8h6X46Qz3Rl4ysMFlbqFDHBUWKLmBCzZ0LBVAaAHr0upy5JBq8nCczh9HBUwbjF03Dn5jSXCKUifOFU9UWv2QQP5LvA6tfZToCYA/Y7+l85K60WANlQSkoOj1FUlkpMLiOU8AtCiXKRvdUCTxEHjbcpf3ENA8jaS3H1adNSfAyCepZNZInSU5oAb5rTSrpvqBZdfZNFJ8p5as4ds30LPDrDvwGtOAAAAAElFTkSuQmCC); }
                .toy.bunny::after { width: 48px; height: 64px; top: -4px; left: -4px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAAN1JREFUSEvtVtsNgzAMTCYoY9CJ2hHpRDBGO0Grq2TkOg4+KlAfSv4wjs+cH1xO5pz6w93aLtMtWxueGd+Xi7gwjNci1vnYJQvC+s4AtQuCpkHW+DYAr/ZJ09ko2o4iRAK3ON6saKSiBlFfu2kGRgHJewTXw/kZAJZrnalXG8Rxv6ABrC4yKLO979ls51Zr4LW41EXeRcMmg/lcdnvMwjxoktGWIH+8KpjOiBafjlF00W8CWIXG9PcSTXpeINYoZRfxXvubwf5dAMwatzq2UM2MqGV8hLa3ZTkj3QHyACJNPMzl3sUuAAAAAElFTkSuQmCC); background-size: 48px 64px; }
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

                        {/* Close Button */}
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
                                    {/* Arm Assembly */}
                                    <div
                                        className="arm-joint pix"
                                        style={{
                                            left: `${armPosition.x}px`,
                                            top: `${armPosition.y}px`,
                                            ['--shadow-scale' as any]: shadowScale,
                                        }}
                                    >
                                        <div
                                            className={`arm pix ${clawOpen ? 'open' : ''} ${clawMissed ? 'missed' : ''}`}
                                            style={{ height: `${armHeight}px` }}
                                        >
                                            <div className="claws pix"></div>
                                        </div>
                                    </div>
                                    <div className="rail vert pix" style={{ left: `${railPosition.x}px` }}></div>
                                    <div className="rail hori pix"></div>
                                </div>
                                <div className="machine-bottom pix">
                                    <div className="collection-point pix"></div>
                                </div>

                                {/* Toys */}
                                {toys.map((toy) => {
                                    // Calculate Position Logic for Grabbed Toys
                                    let displayX = toy.x;
                                    let displayY = toy.y;

                                    if (toy.grabbed && toy.clawPos) {
                                        const offsetX = toy.x - toy.clawPos.x;
                                        const offsetY = toy.y - toy.clawPos.y;
                                        const currentClawX = armPosition.x + 5;
                                        const currentClawY = armPosition.y + armHeight;
                                        displayX = currentClawX + offsetX;
                                        displayY = currentClawY + offsetY;
                                    }

                                    return (
                                        <div
                                            key={toy.id}
                                            className={`toy pix ${toy.type} ${toy.grabbed ? 'grabbed' : ''} ${toy.falling ? 'falling' : ''}`}
                                            style={{
                                                left: `${displayX}px`,
                                                top: `${displayY}px`,
                                                width: `${toy.w}px`,
                                                height: `${toy.h}px`,
                                                zIndex: toy.z,
                                                transform: `rotate(${toy.angle}deg)`,
                                                transformOrigin: toy.transformOrigin,
                                            }}
                                        ></div>
                                    );
                                })}
                            </div>

                            <div className="control pix">
                                <div className="cover left"></div>
                                <div className="cover right">
                                    <div className={`instruction pix ${tiny5.className}`} style={{ color: '#fff', fontSize: '10px', paddingTop: '6px', paddingLeft: '8px' }}>HOLD &gt; / CLICK v</div>
                                </div>
                                <button
                                    className={`hori-btn pix ${horiActive ? 'active' : ''}`}
                                    onMouseDown={handleHoriPress}
                                    onMouseUp={handleHoriRelease}
                                    onTouchStart={handleHoriPress}
                                    onTouchEnd={handleHoriRelease}
                                ></button>
                                <button
                                    className={`vert-btn pix ${vertActive ? 'active' : ''}`}
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
                    </div>
                </div>
            )}
        </>
    );
};

export default ClawMachine;