"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Position {
    x: number;
    y: number;
}

interface ToyData {
    w: number;
    h: number;
}

interface Toy extends Position {
    type: string;
    w: number;
    h: number;
    z: number;
    angle: number;
    index: number;
    grabbed?: boolean;
    selected?: boolean;
    transformOrigin: string;
    clawPos?: Position;
}

const ClawMachine: React.FC = () => {
    const m = 2;
    const machineWidth = 160 * m;
    const machineHeight = 180 * m;
    const machineTopHeight = 70 * m;
    const machineBottomHeight = 70 * m; // Both top and bottom are 70px in original
    const cornerBuffer = 16;
    const machineBuffer = { x: 36, y: 16 };
    const maxArmLength = machineHeight - machineTopHeight - machineBuffer.y * 2;

    const [armPosition, setArmPosition] = useState({ x: 0, y: 0 });
    const [armHeight, setArmHeight] = useState(28 * m);
    const [shadowScale, setShadowScale] = useState(0.5);
    const [railPosition, setRailPosition] = useState({ x: 0 });
    const [toys, setToys] = useState<Toy[]>([]);
    const [collectedToys, setCollectedToys] = useState<string[]>([]);
    const [targetToy, setTargetToy] = useState<number | null>(null);
    const [horiActive, setHoriActive] = useState(false);
    const [vertActive, setVertActive] = useState(false);
    const [clawOpen, setClawOpen] = useState(false);
    const [clawMissed, setClawMissed] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showCollectionArrow, setShowCollectionArrow] = useState(false);

    const machineRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const horiIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const vertIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const armIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isHoriPressedRef = useRef(false);
    const isVertPressedRef = useRef(false);

    const toyTypes: Record<string, ToyData> = {
        bear: { w: 20 * m, h: 27 * m },
        bunny: { w: 20 * m, h: 29 * m },
        golem: { w: 20 * m, h: 27 * m }, // Container size - sprite overflows
        cucumber: { w: 16 * m, h: 28 * m },
        penguin: { w: 24 * m, h: 22 * m },
        robot: { w: 20 * m, h: 30 * m },
    };

    const radToDeg = (rad: number) => Math.round(rad * (180 / Math.PI));
    const randomN = (min: number, max: number) =>
        Math.round(min - 0.5 + Math.random() * (max - min + 1));
    const calcX = (i: number, n: number) => i % n;
    const calcY = (i: number, n: number) => Math.floor(i / n);

    const adjustAngle = (angle: number) => {
        const adjustedAngle = angle % 360;
        return adjustedAngle < 0 ? adjustedAngle + 360 : adjustedAngle;
    };

    // Initialize toys
    useEffect(() => {
        const allToys = [...Object.keys(toyTypes), ...Object.keys(toyTypes)].sort(
            () => 0.5 - Math.random()
        );

        const initialToys: Toy[] = allToys
            .filter((_, i) => i !== 8) // Skip index 8 like original
            .map((toyType, index) => {
                const actualIndex = index >= 8 ? index + 1 : index;
                const size = toyTypes[toyType];
                return {
                    type: toyType,
                    x:
                        cornerBuffer +
                        calcX(actualIndex, 4) * ((machineWidth - cornerBuffer * 3) / 4) +
                        size.w / 2 +
                        randomN(-6, 6),
                    y:
                        machineHeight - machineBottomHeight + // Start of bottom section
                        cornerBuffer +
                        calcY(actualIndex, 4) * ((machineBottomHeight - cornerBuffer * 2) / 3) -
                        size.h / 2 +
                        randomN(-2, 2),
                    z: 0,
                    angle: 0,
                    index: actualIndex,
                    transformOrigin: 'center',
                    ...size,
                };
            });

        setToys(initialToys);
    }, []);

    // Update shadow scale when arm height changes
    useEffect(() => {
        setShadowScale(0.5 + armHeight / maxArmLength / 2);
    }, [armHeight]);

    // Initialize arm position
    useEffect(() => {
        const initAnim = async () => {
            await moveArmDown();
            await moveRailRight();
            setHoriActive(true);
        };
        initAnim();
    }, []);

    const moveArmDown = () => {
        return new Promise<void>((resolve) => {
            const target = machineTopHeight - machineBuffer.y;
            const interval = setInterval(() => {
                setArmPosition((prev) => {
                    const distance = Math.abs(prev.y - target) < 10 ? Math.abs(prev.y - target) : 10;
                    const increment = prev.y > target ? -distance : distance;
                    if (increment > 0 ? prev.y < target : prev.y > target) {
                        return { ...prev, y: prev.y + increment };
                    } else {
                        clearInterval(interval);
                        resolve();
                        return { ...prev, y: target };
                    }
                });
            }, 50);
        });
    };

    const moveRailRight = () => {
        return new Promise<void>((resolve) => {
            const target = machineBuffer.x;
            const interval = setInterval(() => {
                setRailPosition((prev) => {
                    const distance = Math.abs(prev.x - target) < 10 ? Math.abs(prev.x - target) : 10;
                    const increment = prev.x > target ? -distance : distance;
                    if (increment > 0 ? prev.x < target : prev.x > target) {
                        setArmPosition((armPrev) => ({ ...armPrev, x: prev.x + increment }));
                        return { x: prev.x + increment };
                    } else {
                        clearInterval(interval);
                        resolve();
                        setArmPosition((armPrev) => ({ ...armPrev, x: target }));
                        return { x: target };
                    }
                });
            }, 50);
        });
    };

    const handleHoriPress = () => {
        if (!horiActive) return;
        isHoriPressedRef.current = true;
        setClawMissed(false);

        const target = machineWidth - 10 - machineBuffer.x;
        horiIntervalRef.current = setInterval(() => {
            setRailPosition((prev) => {
                const distance = Math.abs(prev.x - target) < 10 ? Math.abs(prev.x - target) : 10;
                const increment = prev.x > target ? -distance : distance;
                if (increment > 0 ? prev.x < target : prev.x > target) {
                    setArmPosition((armPrev) => ({ ...armPrev, x: prev.x + increment }));
                    return { x: prev.x + increment };
                } else {
                    if (horiIntervalRef.current) clearInterval(horiIntervalRef.current);
                    setHoriActive(false);
                    setVertActive(true);
                    return { x: target };
                }
            });
        }, 100);
    };

    const handleHoriRelease = () => {
        if (horiIntervalRef.current) {
            clearInterval(horiIntervalRef.current);
            horiIntervalRef.current = null;
        }
        isHoriPressedRef.current = false;
        setHoriActive(false);
        setVertActive(true);
    };

    const doOverlap = (toy: Toy, claw: { x: number; y: number; w: number; h: number }) => {
        // Check if claw overlaps with toy
        return (
            claw.x < toy.x + toy.w &&
            claw.x + claw.w > toy.x &&
            claw.y < toy.y + toy.h &&
            claw.y + claw.h > toy.y
        );
    };

    const getClosestToy = () => {
        // Shadow position matches the claw tip when arm is fully extended
        const shadowCenterX = armPosition.x + 5; // Center of the arm joint (10px wide)
        const shadowCenterY = armPosition.y + maxArmLength;

        const claw = {
            x: shadowCenterX - 20, // 40px wide claw centered on shadow
            y: shadowCenterY - 16, // 32px tall claw centered on shadow
            w: 40,
            h: 32,
        };

        const overlappedToys = toys
            .filter((t) => !t.selected && doOverlap(t, claw))
            .sort((a, b) => b.index - a.index);

        if (overlappedToys.length > 0) {
            return toys.indexOf(overlappedToys[0]);
        }
        return null;
    };

    const handleVertPress = () => {
        if (!vertActive) return;
        isVertPressedRef.current = true;

        const target = machineBuffer.y;
        vertIntervalRef.current = setInterval(() => {
            setArmPosition((prev) => {
                const distance = Math.abs(prev.y - target) < 10 ? Math.abs(prev.y - target) : 10;
                const increment = prev.y > target ? -distance : distance;
                if (increment > 0 ? prev.y < target : prev.y > target) {
                    return { ...prev, y: prev.y + increment };
                } else {
                    if (vertIntervalRef.current) clearInterval(vertIntervalRef.current);
                    return { ...prev, y: target };
                }
            });
        }, 100);
    };

    const handleVertRelease = () => {
        if (vertIntervalRef.current) {
            clearInterval(vertIntervalRef.current);
            vertIntervalRef.current = null;
        }
        isVertPressedRef.current = false;
        setVertActive(false);

        const toyIndex = getClosestToy();
        setTargetToy(toyIndex);

        // Start the grab sequence
        setTimeout(() => {
            setClawOpen(true);
            // Lower the arm
            const lowerArm = setInterval(() => {
                setArmHeight((prev) => {
                    if (prev < maxArmLength) {
                        return prev + 10;
                    } else {
                        clearInterval(lowerArm);
                        // Wait then close claw
                        setTimeout(() => {
                            setClawOpen(false);
                            if (toyIndex !== null) {
                                // Grab the toy
                                setToys((prev) =>
                                    prev.map((toy, i) => {
                                        if (i === toyIndex) {
                                            // Use same calculation as shadow center
                                            const clawPos = {
                                                x: armPosition.x + 5, // Center of arm joint
                                                y: armPosition.y + maxArmLength, // Shadow position
                                            };
                                            const angle =
                                                radToDeg(
                                                    Math.atan2(
                                                        toy.y + toy.h / 2 - clawPos.y,
                                                        toy.x + toy.w / 2 - clawPos.x
                                                    )
                                                ) - 90;
                                            const adjustedAngle = Math.round(adjustAngle(angle));
                                            const finalAngle =
                                                adjustedAngle < 180 ? adjustedAngle * -1 : 360 - adjustedAngle;

                                            return {
                                                ...toy,
                                                grabbed: true,
                                                z: 1,
                                                angle: finalAngle,
                                                transformOrigin: `${clawPos.x - toy.x}px ${clawPos.y - toy.y}px`,
                                                clawPos,
                                            };
                                        }
                                        return toy;
                                    })
                                );
                            } else {
                                setClawMissed(true);
                            }
                            // Raise arm back up
                            setTimeout(() => raiseArmBack(), 500);
                        }, 500);
                        return prev;
                    }
                });
            }, 100);
        }, 500);
    };

    const raiseArmBack = () => {
        const raiseArm = setInterval(() => {
            setArmHeight((prev) => {
                if (prev > 28 * m) {
                    return prev - 10;
                } else {
                    clearInterval(raiseArm);
                    // Move rail back
                    moveRailBack();
                    return 28 * m;
                }
            });
        }, 100);
    };

    const moveRailBack = () => {
        const moveBack = setInterval(() => {
            setRailPosition((prev) => {
                const target = machineBuffer.x;
                const distance = Math.abs(prev.x - target) < 10 ? Math.abs(prev.x - target) : 10;
                const increment = prev.x > target ? -distance : distance;
                if (increment > 0 ? prev.x < target : prev.x > target) {
                    setArmPosition((armPrev) => ({ ...armPrev, x: prev.x + increment }));
                    return { x: prev.x + increment };
                } else {
                    clearInterval(moveBack);
                    // Move arm down
                    moveArmDownFinal();
                    return { x: target };
                }
            });
        }, 100);
    };

    const moveArmDownFinal = () => {
        const moveDown = setInterval(() => {
            setArmPosition((prev) => {
                const target = machineTopHeight - machineBuffer.y;
                const distance = Math.abs(prev.y - target) < 10 ? Math.abs(prev.y - target) : 10;
                const increment = prev.y > target ? -distance : distance;
                if (increment > 0 ? prev.y < target : prev.y > target) {
                    return { ...prev, y: prev.y + increment };
                } else {
                    clearInterval(moveDown);
                    dropToy();
                    return { ...prev, y: target };
                }
            });
        }, 100);
    };

    const dropToy = () => {
        setClawOpen(true);

        // Immediately drop the toy at current position
        if (targetToy !== null) {
            const currentToy = toys[targetToy];

            if (currentToy.clawPos) {
                const offsetX = currentToy.x - currentToy.clawPos.x;
                const offsetY = currentToy.y - currentToy.clawPos.y;

                const currentClawX = armPosition.x + 5;
                const currentClawY = armPosition.y + armHeight;

                const finalX = currentClawX + offsetX;
                const finalY = currentClawY + offsetY;

                // Update position and ungrab immediately
                setToys((prev) =>
                    prev.map((t, i) =>
                        i === targetToy
                            ? { ...t, x: finalX, y: finalY, z: 0, grabbed: false, angle: 0, transformOrigin: 'center' }
                            : t
                    )
                );
            }
        }

        setTimeout(() => {
            setClawOpen(false);
            setHoriActive(true);
            if (targetToy !== null) {
                setToys((prev) =>
                    prev.map((t, i) => (i === targetToy ? { ...t, selected: true } : t))
                );
                setShowCollectionArrow(true);
            }
            setTargetToy(null);
        }, 700);
    };

    const collectToy = (index: number) => {
        const toy = toys[index];
        setCollectedToys((prev) => [...prev, toy.type]);
        setShowOverlay(true);
        setToys((prev) => prev.filter((_, i) => i !== index));

        setTimeout(() => {
            setShowOverlay(false);
            if (!toys.some((t) => t.selected && toys.indexOf(t) !== index)) {
                setShowCollectionArrow(false);
            }
        }, 1000);
    };

    return (
        <>
            <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          padding: 0;
          margin: 0;
          font-family: sans-serif;
          background-color: #84dfe2;
        }
        .claw-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          min-height: 600px;
          flex-direction: column;
        }
        .pix,
        .pix::before,
        .pix::after {
          image-rendering: pixelated;
        }
        .pix::before,
        .pix::after {
          position: absolute;
          content: '';
        }
        .collection-box {
          width: ${machineWidth}px;
          height: 64px;
          margin: -74px 0 24px;
          display: flex;
          align-items: end;
          justify-content: start;
        }
        .collection-box .toy-wrapper {
          position: relative;
          width: calc(100% / 6);
          display: flex;
          align-items: end;
          justify-content: center;
        }
        .toy-wrapper.squeeze-in {
          width: 0;
          animation: squeeze-in forwards 0.4s;
          animation-delay: 1.4s;
        }
        @keyframes squeeze-in {
          0% { width: 0; }
          100% { width: calc(100% / 6); }
        }
        .toy-wrapper .toy {
          opacity: 0;
          transform: translateY(-100vh);
          animation: forwards show-toy-2 0.8s;
          animation-delay: 1s;
        }
        @keyframes show-toy-2 {
          0% {
            opacity: 0;
            transform: translateY(-100vh);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .claw-machine {
          display: flex;
          flex-direction: column;
          border: 2px solid #57280f;
          overflow: hidden;
          position: relative;
        }
        .claw-machine.show-overlay::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background-color: #32c2db;
          opacity: 0.6;
          z-index: 6;
          pointer-events: none;
        }
        .box {
          position: relative;
          background-color: #7fcfed;
          width: ${machineWidth}px;
          height: ${machineHeight}px;
        }
        .box::before {
          background-color: #57280f;
          top: ${machineTopHeight}px;
          width: 100%;
          height: ${8 * m}px;
          z-index: 5;
        }
        .box::after {
          background-color: #32c2db;
          top: ${machineTopHeight}px;
          right: 0px;
          width: ${8 * m}px;
          height: ${170 * m}px;
          z-index: 2;
        }
        .machine-top {
          position: absolute;
          width: 100%;
          height: ${machineTopHeight}px;
          top: 0;
          display: flex;
          align-items: center;
          z-index: 1;
        }
        .machine-top::after {
          content: '';
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #70f7f372;
          z-index: -1;
          pointer-events: none;
        }
        .machine-bottom {
          position: absolute;
          width: 100%;
          height: ${machineBottomHeight}px;
          bottom: 0;
          background-color: #def7f6;
        }
        .collection-point {
          position: absolute;
          bottom: 0;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAMCAYAAABm+U3GAAAAAXNSR0IArs4c6QAAADBJREFUOE9jtJqy/T8DFcGxHE9GkHGM1DYYZCjIcJoYTDMXjxqMkrZGIw8eHEMvKADnSiE1EAXSagAAAABJRU5ErkJggg==);
          width: 88px;
          height: 48px;
          background-size: 88px 48px;
          z-index: 0;
        }
        .rail {
          top: 0;
          left: 0;
          transition: 0.3s;
          border: solid #33a5da;
          position: absolute;
        }
        .rail.hori {
          height: 10px;
          width: 100%;
          background-color: #fff;
          border-width: 2px 0;
          z-index: 1;
        }
        .rail.vert {
          height: ${machineTopHeight}px;
          width: 10px;
          background-color: #fff;
          border-width: 0 2px;
          z-index: 1;
        }
        .arm-joint {
          position: absolute;
          top: 0;
          left: 0;
          width: 10px;
          height: 10px;
          transition: 0.3s;
        }
        .arm-joint::after {
          position: absolute;
          border: solid #33a5da 2px;
          background-color: #fff;
          width: 20px;
          height: 20px;
          top: -5px;
          left: -5px;
        }
        .arm-joint::before {
          width: 40px;
          height: 32px;
          margin-left: -30px;
          margin-top: ${maxArmLength}px;
          transform: scale(var(--shadow-scale, 0.5));
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAF5JREFUOE9jZMABrKZs/49LDiR+LMeTEZs8iiAhQ3BZgGw43EByDYNZAjMUbCClhiEbSn0DqeU6mCsZRw3El5aJkqN+GA7+dAgLGEqTD0rWo9RQrIUDehQScjGu4gsAxKQ3Ke4v44gAAAAASUVORK5CYII=);
          background-size: 40px 32px;
          z-index: -1;
          opacity: 0.5;
        }
        .arm {
          position: absolute;
          width: 14px;
          background-color: #fff;
          box-shadow: 0 0 0 2px #33a5da;
          transition: 0.3s;
          margin-top: -2px;
          margin-left: -2px;
        }
        .arm::after {
          position: absolute;
          width: 26px;
          height: 14px;
          bottom: -2px;
          left: -6px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAHCAYAAADTcMcaAAAAAXNSR0IArs4c6QAAAElJREFUKFNjZGBgYDBeeus/iCYGnI1WY2QEaTgTpUqMerAak2W3GVA0RWgKMKy4/gHDAGRx6miCWQEyGQbQbcawiRiPgTWRE3oA5mIzfZr3jVYAAAAASUVORK5CYII=);
          background-size: 26px 14px;
        }
        .arm.missed::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAHCAYAAADTcMcaAAAAAXNSR0IArs4c6QAAAENJREFUKFNjZGBgYDBeeus/iCYGnI1WY2QEaTgTpUqMerAak2W3GSjTFKEpADZpxfUPGLYiy+G0CaYImyHkO4+c0AMAWBctfQPWfVQAAAAASUVORK5CYII=);
          background-size: 26px 14px;
        }
        .claws {
          position: absolute;
          width: 6px;
          height: 20px;
          bottom: -10px;
          left: 5px;
        }
        .claws::before,
        .claws::after {
          top: 0;
          width: 20px;
          height: 32px;
          transition: 0.2s;
          background-size: 20px 32px;
        }
        .claws::before {
          left: -20px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAAAXNSR0IArs4c6QAAAGRJREFUKFNjZMADwjX4/6+88ZERpARMYAMgRSuuf2CI0BRgACnGqhCmCGYASDGGQmyKMEzEpQjFjfgUwRUSUgRWSIwi0hSCVBNjKjx4CClGCUeiggcWC0QFOD7FlCUKZJNhyQwAi8VlK14hrsQAAAAASUVORK5CYII=);
          transform-origin: top right;
        }
        .claws::after {
          left: 5px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAAAXNSR0IArs4c6QAAAFxJREFUKFNjZICCcA3+/ytvfGSE8dFpsARI0YrrHxgiNAUYcClmhCmCmYBLMYqJ+BTD3UTIZBTH41OM4UtcirEGBzbF5CskymqiPENU8BBSBIoI8qIQb6IgNpkBAEPjZSuK8jVuAAAAAElFTkSuQmCC);
          transform-origin: top left;
        }
        .arm.open .claws::before {
          rotate: 45deg;
        }
        .arm.open .claws::after {
          rotate: -45deg;
        }
        .control {
          position: relative;
          height: 120px;
          width: 100%;
          text-align: right;
          background-color: #3a94b7;
        }
        .cover {
          position: absolute;
          background-color: #32c2db;
          z-index: 4;
        }
        .cover.top {
          top: 0;
          width: 100%;
          height: 32px;
        }
        .collection-arrow {
          position: absolute;
          left: 42px;
          top: 18px;
          width: 16px;
          height: 8px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAYAAACzzX7wAAAAAXNSR0IArs4c6QAAAClJREFUGFdjDDn86T8DHsAIksOlaI0tHyNYATZFIEmQOFwBsiKYJEgMAPTvDw1xBcM+AAAAAElFTkSuQmCC);
          background-size: 16px 8px;
          filter: sepia(1) brightness(0.5);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .collection-arrow.active {
          opacity: 1;
        }
        .cover.bottom {
          bottom: 0px;
          width: 100%;
          height: 16px;
          background-color: #57280f;
        }
        .cover.left {
          bottom: 0px;
          left: 0px;
          height: 340px;
          width: 16px;
        }
        .cover.right {
          top: 0;
          right: 0px;
          height: 100%;
          width: 232px;
        }
        .instruction {
          position: absolute;
          width: 102px;
          height: 24px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAMCAYAAADPjYVSAAAAAXNSR0IArs4c6QAAAPRJREFUSEvdVkESwkAIs0d9hv9/k8/Qow4d6aSZBKjjRfdSdltYIBC63B735+m9rufLkvuQ4/joHnVCRjsp531hG89w7+S0r3xdnc8X1RONOGfynL/lO1A/A8akOZ/4Xk7GhoQy6pBx2fwkmKOJZMQQ/Q0ZFzVHP0VIlUlVVlw+GKR6p/wYBTNFzSGjLu6SMk3iDhl04NfllbH+ZZUEUDWbqn9XjkgkWBaqlJh0eHQopkwwLDU7eu0a1fWHs9eRQqeHNF4OSYfMNFvVkHSzZ0oMqP9VZBytcy9O6JptTZGJ72SZqdrvJjT3Au6VgxVds+70t+cFkvdjifIP/BkAAAAASUVORK5CYII=);
          background-size: 102px 24px;
          top: 68px;
          right: 22px;
        }
        .control .collection-point {
          filter: brightness(0.8);
          bottom: 16px;
        }
        button {
          position: relative;
          z-index: 5;
          width: 48px;
          height: 48px;
          margin: 12px 24px 0 0;
          border: 0;
          background-color: transparent;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAFRJREFUKFNjZICC/////4exsdGMjIyMIHEwQUgxzACQJkZsikOPfAarWW3Di2EZhgaYYphKdE0oGtAVY9ME14BLMbomypwEMo0kP9BGA8kRR2rSAACHREftd0fKPgAAAABJRU5ErkJggg==);
          background-size: 48px 48px;
          filter: sepia(1) brightness(0.4);
          pointer-events: none;
          cursor: pointer;
        }
        button.hori-btn {
          transform: rotate(90deg);
        }
        button.active {
          animation: pulse infinite 1s;
          pointer-events: all;
        }
        @keyframes pulse {
          0%, 100% { filter: sepia(0); }
          50% { filter: sepia(1); }
        }
        .toy {
          position: absolute;
          transition: transform 1s;
          pointer-events: none;
        }
        .toy::after {
          content: '';
          position: absolute;
          image-rendering: pixelated;
          background-repeat: no-repeat;
        }
        .toy.selected {
          pointer-events: all;
          cursor: pointer;
        }
        .toy.bear::after {
          width: 48px;
          height: 60px;
          top: -4px;
          left: -4px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAAAXNSR0IArs4c6QAAATNJREFUSEvtVssNwjAMbcUZwQLcYQfWQLAAU7FAEWuwA9xZAMQZgRzpRY7rOEkbTtALtLHfc54/ctuwZ7ucvfF6vD5afpb6H/P1IGTwOtw8zmS/aHJJLF9HoBmkItbOtQADAoqanu5yH4Lf7FZz50dEUCCQaCiwjIaIIK+/QS1wkIHk+wSU4NrR81u0GgGSlUscs6fvP0awOT+dvKf1NKjMYokGdZni5HKAUWEllAzlufaNcxT3AWQASKrCAoKcW5TI1hsVcK7RdByccH0OMAXpF1O1JGrNnwaeazQ+x0tBLXsK1CRAvaP+JVjqPEmgNZUkiZFD6iyJZOeCxAL3BChRnqSxeUCRuCRzsBoJl9vIn6CXrlESIXlWY5oEqCgNgDvGikFbN9UFly+y0EDuqTk25PsBag8IsJphwl4AAAAASUVORK5CYII=);
          background-size: 48px 60px;
        }
        .toy.bear.grabbed::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAAAXNSR0IArs4c6QAAAUNJREFUSEvllr0NAjEMhe9EjWABetiBNRAswFQsAGINdoCeBUDUCORIL3KM48RHqLiGn8T+bD87l75jz3o+eeHn4XLv+Vrpe842OqENz901+hltZ10txLINAG1DKWJtXQswAVDU9OzPtyH+u81iGuwIhAokJRrqWEZDIJQ3ZtDKOWCA/B5AAreOnmfRawBKzwvVbOg/FUAReCC5vSagFmIF4s5gdXqE8h6X46Qz3Rl4ysMFlbqFDHBUWKLmBCzZ0LBVAaAHr0upy5JBq8nCczh9HBUwbjF03Dn5jSXCKUifOFU9UWv2QQP5LvA6tfZToCYA/Y7+l85K60WANlQSkoOj1FUlkpMLiOU8AtCiXKRvdUCTxEHjbcpf3ENA8jaS3H1adNSfAyCepZNZInSU5oAb5rTSrpvqBZdfZNFJ8p5as4ds30LPDrDvwGtOAAAAAElFTkSuQmCC);
          background-size: 48px 60px;
        }
        .toy-wrapper .toy.bear::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAAAXNSR0IArs4c6QAAATVJREFUSEvtVsutwkAMTMQZQQPvDj3QBoIGqOo1AKINeoA7DYA4I9CsNCuv5f2FhQvkkpC1ZxyPbdx34lrNJg/+3J2uvTzLPcd8PQgM7v9njzPa/HWlJClfR2AZ5CK2zq0AAwJEjWt7vAzB79bzqfMDETMQpGgosI4GREyv/4JW4CQjyfsJIHDr6OVX9BYBxSoljtnj/ZcRLA83l979YhxUZnWKBnWZ4eQ04KhICQpD6zz2HpjVfcA0yEBzQaGbPzMqGFWLppNzCLheA05B3DlVa8XmuKa/S5H+L6gFTdmDKEnAemf9a7DceZbAaipNEiNnqotSpDuXJClwT8BGkyK/qkMgsgRrIbjeRoLd50dAYeXCVpUiiicXLF0QSQ1YURaAdIxpZa2b5oIrF1lGqPfUEhv4PgFUUwiwSYZ9UgAAAABJRU5ErkJggg==);
          background-size: 48px 60px;
        }
        .toy.bunny::after {
          width: 48px;
          height: 64px;
          top: -4px;
          left: -4px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAAN1JREFUSEvtVtsNgzAMTCYoY9CJ2hHpRDBGO0Grq2TkOg4+KlAfSv4wjs+cH1xO5pz6w93aLtMtWxueGd+Xi7gwjNci1vnYJQvC+s4AtQuCpkHW+DYAr/ZJ09ko2o4iRAK3ON6saKSiBlFfu2kGRgHJewTXw/kZAJZrnalXG8Rxv6ABrC4yKLO979ls51Zr4LW41EXeRcMmg/lcdnvMwjxoktGWIH+8KpjOiBafjlF00W8CWIXG9PcSTXpeINYoZRfxXvubwf5dAMwatzq2UM2MqGV8hLa3ZTkj3QHyACJNPMzl3sUuAAAAAElFTkSuQmCC);
          background-size: 48px 64px;
        }
        .toy.bunny.grabbed::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAAOxJREFUSEvtVsENwjAMTCaAMWAiGBEmgjFgAqpDcmUcp76UVAWpfbVR7LMv5/RyMs/psHvZtev9me0avpm9H4EIuNweRa7zcZ8sCLt3BKgFCJoGadm7AXhnnzSdG0X9KEImcIvHmxWNVJxBpGu3zGBRQPISyfVwrgPAch1RhzxuB60Atf1dAJBEVKXfRXVdOqhRVe3ABtjKpDpmHmgVCc8CHiUfKZJfHxMQqcabZvo2nZMcMW+AJaZ5navCU0sLNVZdhUz/E8A6tG/lqucFZo1ydi3nYF3gbwEw1/hkB1NDx3hTzyTPtuWMdUfBA5gROcxJDOyoAAAAAElFTkSuQmCC);
          background-size: 48px 64px;
        }
        .toy-wrapper .toy.bunny::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAAOZJREFUSEvtVtsNgzAMTCZox6ATtSO2E5Ux2gmorpKRcZz4QCC1CL7Asn3J+cHlZJ5rdxqs7dG/s7Xhm/GdBCLg/nwVuW6Xc7IgrO8IUAsQNA0yx/cA8GqfNJ0HRetRhEzgFo83KxqpqEHU1+4xA6OA5C2S6+HcKQBbTE2FV3zkKSiCUbpEv9dq2vJ3AZZ0TAucKrJ3E/Z2FIAeMjltNGwS8112W8zCOGhyojVBdrwqmM6I2tjOxaSL/hPAKjSmv1s0yR6DD8Qapewi3mt/M9h/C4BZ41bHFqqZEbWMj9C2WJYz0h0gH33VNsxxz+QWAAAAAElFTkSuQmCC);
          background-size: 48px 64px;
        }
        .toy.golem::after {
          width: 52px;
          height: 60px;
          top: -2px;
          left: -6px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAYAAAAy2w7YAAAAAXNSR0IArs4c6QAAAQpJREFUSEtjZEAC4Rr8/5H5K298ZKSWPNwgkCVFtRXI5jL0NXcwwCyjVB7FooXbVqFYFO8VhmIRJfJgi0CuRTcEZiPIMhCgRB4UKoz4LEHxHgUckGNHiEWE4gVXKOLShzPoRi0ilBUGZ6qDxRt6QsCVkZHV0ddHhIogCgoEsFZYeYm3UKWWJSBzMOob9KqCXMuQqxi4RbAKj5iIJcViWAIiWHpfPH4ObK6+pRHcfGLFSEp1xBqKTd3gtIiU+MCnFpxhYfkIX3VNroUoiQG9OUWtlIfcsMGaj0aeRcTWvhQFHaEGJXreQW5So5R1sBSIq7wj1ESGWYRezmEkBphC9MY+TJxQox+XOpA4AFO+HuQ4QuSjAAAAAElFTkSuQmCC);
          background-size: 52px 60px;
          background-position: 0 0;
        }
        .toy.golem.grabbed::after {
           background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAYAAAAy2w7YAAAAAXNSR0IArs4c6QAAARhJREFUSEtjZEAC4Rr8/5H5K298ZKSWPNwgkCVFtRXI5jL0NXcwwCyjVB7FooXbVqFYFO8VhmIRJfJgi0CuRTcEZiPIMhCgRB4UKoz4LEHxHgUckGNHgEWwOIGFFK64QQ9JfPqwBt2oRejZAFuQk5zqKAlWkpL30LCIUBFEQYEA1gorL/EWqtSyBGQORn2DXlWQaxlyFQO3CFbhEVsKEGs5LPEQLL0vHj8HNlPf0ghuNrFiyI4hmI+INRSbusFpEbFxQUgdOOhg+QhfdU3IIFzyKIkBWRE1q3Xkhg3WfEStJD50LCLU/EKun5BbuhhFEL6gI9SgRM87OC2CpUBc5R2hJjLMIvRyDiMxwBSiN/Zh4oQa/bjUgcQBMesk5BS8p3gAAAAASUVORK5CYII=);
           background-size: 52px 60px;
          background-position: 0 0;
        }
        .toy-wrapper .toy.golem::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAYAAAAy2w7YAAAAAXNSR0IArs4c6QAAAR1JREFUSEtjZEAC4Rr8/5H5K298ZKSWPNwgkCVFtRXI5jL0NXcwwCyjVB7FooXbVqFYFO8VhmIRJfJgi0CuRTcEZiPIMhCgRB4UKoz4LEHxHgUckGNHLSIrALEGHSzyYSbiSgToNuLTN7AWkRU2BDSRlOpAirFlWGKCliSLQI6mJP7ol48IFUGUxhmsvMRbqFLLEpA5GPUNelVBrmXIVQzcIliFR0wKIsViWOIhWHpfPH4ObK6+pRHcfGLFkB1EMHkTayg2dYPTIlLiA59acNDB8hG+6ppcC1ESA3pzilopD7lhgzUfjTyLCDW/kJtpyC1djCIIX9ARalCi5x2cFsFSIK7yjlATGWYRejmHkRhgCtEb+zBxQo1+XOpA4gCEWBjkRLE8iwAAAABJRU5ErkJggg==);
          background-size: 52px 60px;
          background-position: 0 0;
        }
        .toy.cucumber::after {
          width: 32px;
          height: 60px;
          top: 2px;
          left: 0;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAYAAAAl+Z4RAAAAAXNSR0IArs4c6QAAAIVJREFUSEtjZEAD4Rr8/9HFkPkrb3xkRObDOTCNzFvP4NPP8NfbBCwPMwhsAEgzIY3opoIMAhnCSI5mmGEgQ1AMgDkPl2vQ5QehAXiDH4skhheQ1cD8CxPDFi54DSDGNaMGMIDzBXWTMjEhjx7Voy4YjYXhkhIprlhgmYOiqg05h5FauQIAKIamV0t/KUgAAAAASUVORK5CYII=);
          background-size: 32px 60px;
        }
        .toy.cucumber.grabbed::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAYAAAAl+Z4RAAAAAXNSR0IArs4c6QAAAIdJREFUSEtjZEAD4Rr8/9HFkPkrb3xkRObDOTCNzFvP4NPP8NfbBCwPMwhsAEgzIY3opoIMAhnCSI5mmGEgQ1AMgDkPl2vQ5QehAbiCH+RUbN7C8AKyATD/gsTwhQl1YwFvCsIiidcLxBg2agADOGeORuNoGAyXdEBxxQIrOCiq2pBLH1IrVwA8halXrQxpsQAAAABJRU5ErkJggg==);
          background-size: 32px 60px;
        }
        .toy-wrapper .toy.cucumber::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAYAAAAl+Z4RAAAAAXNSR0IArs4c6QAAAIVJREFUSEtjZEAD4Rr8/9HFkPkrb3xkRObDOTCNzFvP4NPP8NfbBCwPMwhsAEgzIY3opoIMAhnCSI5mmGEgQ1AMgDkPl2vQ5QehAcgBBXIezCvIbHQ1eAORmDChbizgTUFYJDFiYdQAUkOAAZwzR6NxNAyGSzqguGKBZSGKqjbkfEhq5QoAaISsV8DV840AAAAASUVORK5CYII=);
          background-size: 32px 60px;
        }
        .toy.penguin::after {
          width: 52px;
          height: 48px;
          top: -2px;
          left: -2px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAAXNSR0IArs4c6QAAAPBJREFUSEtjZMACwjX4/2MTJ1Zs5Y2PjOhqUQRgFvyd/ZhYM7GqY06VBYsjWwi3CGQJpRag2wqyEGYZ2CJaWAKzFGYZIy0tQbYMq0WwMCY1KHHpA4mPYItgwYKespCDl+Sgw5ZMF25bhTXPxHuFMRCKS5xxNGAWgSwmJuhwFScEfbTahpekoij0yGecRRJK8kZ29YrrH0iyBKY4QlMArg8Wd3h9BJIk1TKQJdgSxqhFBOOM6KCja2IgNUnj8iZyUgcnBmwVH6WWoVsCqmXpV8PCvA6qaXEVnDA1oAIU1gYgVT3WVhCucEdvRhFqliGrBwDOBdzprDO9jAAAAABJRU5ErkJggg==);
          background-size: 52px 48px;
        }
        .toy.penguin.grabbed::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAAXNSR0IArs4c6QAAAP9JREFUSEtjZMACwjX4/2MTJ1Zs5Y2PjOhqUQRgFvyd/ZhYM7GqY06VBYsjWwi3CGQJpRag2wqyEGYZ2CJaWAKzFGYZIy0tQbZsYC2CRSapcYZLH0gcw0cgQZgFyGxCyRCfPqwW4TIQ5lp0eWJ8TbRFIIULt63C6oZ4rzB4COBzJFGJgW4WgVxK06BbbcNLKA2gyIce+YyzSEIJOmRXr7j+gSRLYIojNAXg+pBTL844AllKqmUgS7ClQrypbtQiUMQQHXR0TQykJmlcSRM5qYMTA7aKj1LL0C0B1bL0q2FhXgfVtLgKTpgaUAEKawOQqh5rKwhXuKM3owg1y5DVAwDi4Nbp/c5ePwAAAABJRU5ErkJggg==);
          background-size: 52px 48px;
        }
        .toy-wrapper .toy.penguin::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAAXNSR0IArs4c6QAAAPxJREFUSEtjZMACwjX4/2MTJ1Zs5Y2PjOhqUQRgFvyd/ZhYM7GqY06VBYsjWwi3CGQJpRag2wqyEGYZ2CJaWAKzFGYZIy0tQbZsBFgEClNYokBmE0qG+PSB5LAGHSx5IqdCmBi6hdjUoKdenBZhS6YLt63C6ql4rzB4CODy9eCzCORSYoKObB+ttuEllAZQ5EOPfMZZJKEkBmRXr7j+gSRLYIojNAXg+pBTL84MC7KUVMtAlmArL/EmhlGLQBFDdNDRNTGQmqRxJU3kpA5ODNgqPkotQ7cEVMvSr4aFeR1U0+IqOGFqQAUorA1AqnqsrSBc4Y7ejCLULENWDwD2ldbpo7PPMQAAAABJRU5ErkJggg==);
          background-size: 52px 48px;
        }
        .toy.robot::after {
          width: 48px;
          height: 64px;
          top: -2px;
          left: -4px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAAO5JREFUSEtjZMADwjX4/+OTh8mtvPGREZc6nBIgw1dc/0CM+QwRmgIMuCwBW0CsS4myDUkRyFJGkOFFtRWk6iVKfV9zB8OoBXiDamCCCGQrCJAa8dj0YfXBqAXIQTswkYye7mBxgis94ksMg8MHRBU6OBSBfUDz0hRmOTVLVZDLYfUDvMKhqQWwCgeWIsyiyKsfTi2DFDOwlAevcEBVI6jao6YFMDPBFc6oBbCUiBwH8CBCzgfUjAOQueBIHh75ABZMpFaTuMop+udk5HigpPTE1hjGaPziavQiN3CJUQOzDGvrGltjGL31TIwakCUAkfj3fsmx0PsAAAAASUVORK5CYII=);
          background-size: 48px 64px;
        }
        .toy.robot.grabbed::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAAPtJREFUSEtjZMADwjX4/+OTh8mtvPGREZc6nBIgw1dc/0CM+QwRmgIMuCwBW0CsS4myDUkRyFJGkOFFtRWk6iVKfV9zB8OoBXiDahgGEchLyIDY1IVLH0YQ0dwCohI3CYqIimSQIlxBhU8O5A6iLIApxOZwQnFEtAUkhAqKUvpYQPPSFOYnapaqoKCB1Q/wCoemFsAqHFiqMIsir344tQxSEsAyLLzCAVWNoGqPmhbAzARXOKMWwFIichzAgwg5H1AzDkDmgiN5eOQDWDARKh2JLfTon5OR44FYV+JTh9xOxWj84mr0IjdwiVEDcwDW1jW2xjB665kYNSBLAOSw8X4zbpm3AAAAAElFTkSuQmCC);
          background-size: 48px 64px;
        }
        .toy-wrapper .toy.robot::after {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAYAAAAIXrg4AAAAAXNSR0IArs4c6QAAAPlJREFUSEtjZMADwjX4/+OTh8mtvPGREZc6nBIgw1dc/0CM+QwRmgIMuCwBW0CsS4myDUkRyFJGkOFFtRWk6iVKfV9zB8OoBXiDamCCCGQrCJAa8dj0YfXBqAXIQUtUJIMU4YoPfHKgeCTKAphCbOmRUEIg2gKiygUsiuhjAc1LU5jPqFmqgoIGVj/AKxyaWgCrcGCpwiyKvPrh1DJIMQMrDeAVDqhqBFV71LQAZia4whm1AJYSkeMAHkTI+YCacQAyFxzJwyMfwIKJUOlIbKFH/5yMHA/EuhKfOuR2KkbjF1ejF7mBS4wamAOwtq6xNYbRW8/EqAFZAgDgjP1+jrGWQwAAAABJRU5ErkJggg==);
          background-size: 48px 64px;
        }
        .toy.display {
          transform: scale(3);
          animation: forwards show-toy-1 0.8s;
          animation-delay: 1s;
          z-index: 7;
        }
        @keyframes show-toy-1 {
          0% {
            opacity: 1;
            transform: scale(3) translateY(0);
          }
          30% {
            opacity: 0;
          }
          100% {
            opacity: 0;
            transform: scale(1) translateY(-100vh);
          }
        }
      `}</style>

            <div className="claw-wrapper">
                <div className="collection-box pix">
                    {collectedToys.map((type, i) => (
                        <div
                            key={i}
                            className={`toy-wrapper ${i >= 6 ? 'squeeze-in' : ''}`}
                        >
                            <div className={`toy pix ${type}`}></div>
                        </div>
                    ))}
                </div>

                <div className={`claw-machine ${showOverlay ? 'show-overlay' : ''}`} ref={machineRef}>
                    <div className="box pix" ref={boxRef}>
                        <div className="machine-top pix">
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
                            <div
                                className="rail vert pix"
                                style={{ left: `${railPosition.x}px` }}
                            ></div>
                            <div className="rail hori pix"></div>
                        </div>
                        <div className="machine-bottom pix">
                            <div className="collection-point pix"></div>
                        </div>

                        {toys.map((toy, index) => {
                            // Calculate position for grabbed toys based on arm position
                            let displayX = toy.x;
                            let displayY = toy.y;

                            if (toy.grabbed && toy.clawPos) {
                                // Offset based on where the toy was grabbed relative to the claw center
                                const offsetX = toy.x - toy.clawPos.x;
                                const offsetY = toy.y - toy.clawPos.y;

                                // Current claw center position
                                const currentClawX = armPosition.x + 5;
                                const currentClawY = armPosition.y + armHeight;

                                // Apply offset to current claw position
                                displayX = currentClawX + offsetX;
                                displayY = currentClawY + offsetY;
                            }

                            return (
                                <div
                                    key={index}
                                    className={`toy pix ${toy.type} ${toy.grabbed ? 'grabbed' : ''} ${toy.selected ? 'selected display' : ''
                                        }`}
                                    style={{
                                        left: `${displayX}px`,
                                        top: `${displayY}px`,
                                        width: `${toy.w}px`,
                                        height: `${toy.h}px`,
                                        zIndex: toy.z,
                                        transform: `rotate(${toy.angle}deg)`,
                                        transformOrigin: toy.transformOrigin,
                                    }}
                                    onClick={() => toy.selected && collectToy(index)}
                                ></div>
                            );
                        })}
                    </div>

                    <div className="control pix">
                        <div className="cover left"></div>
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
                        <div className="cover right">
                            <div className="instruction pix"></div>
                        </div>
                        <div className="cover bottom"></div>
                        <div className="cover top">
                            <div
                                className={`collection-arrow pix ${showCollectionArrow ? 'active' : ''
                                    }`}
                            ></div>
                        </div>
                        <div className="collection-point pix"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClawMachine;