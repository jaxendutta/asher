"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { press_start_2p } from '@/lib/fonts';

// --- Types ---

interface Vector {
    x: number;
    y: number;
}

interface Line {
    start: Vector;
    end: Vector;
    point: 'start' | 'end';
    axis: 'start' | 'end';
    id: string;
    length: number;
}

interface CapsuleData {
    id: number;
    x: number;
    y: number;
    deg: number;
    velocity: Vector;
    acceleration: Vector;
    radius: number;
    bounce: number;
    friction: number;
    toyType: string;
    baseColor: string;
    selected: boolean;
    prevX: number;
    prevY: number;
}

const TOY_TYPES = ['bunny', 'duck-yellow', 'duck-pink', 'star', 'water-melon', 'panda', 'dino', 'roboto-san', 'roboto-sama', 'penguin', 'turtle'];
const BASE_COLORS = ['red', 'pink', 'white', 'blue'];

export default function Gachapon() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [isSeeThrough, setIsSeeThrough] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [capsulesReady, setCapsulesReady] = useState(false);

    // --- Refs ---
    const requestRef = useRef<number>(0);
    const capsuleRefs = useRef<(HTMLDivElement | null)[]>([]);
    const toyRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lineStartRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lineEndRefs = useRef<(HTMLDivElement | null)[]>([]);

    const machineRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const toyBoxRef = useRef<HTMLDivElement>(null);

    // Physics
    const capsules = useRef<CapsuleData[]>([]);
    const lines = useRef<Line[]>([
        { start: { x: 0, y: 280 }, end: { x: 160, y: 360 }, point: 'end', axis: 'start', id: 'flap_1', length: 0 },
        { start: { x: 160, y: 360 }, end: { x: 320, y: 280 }, point: 'start', axis: 'end', id: 'flap_2', length: 0 },
        { start: { x: 70, y: 340 }, end: { x: 230, y: 490 }, point: 'start', axis: 'end', id: 'ramp', length: 0 }
    ]);

    const settings = useRef({
        capsuleNo: 20,
        isTurningHandle: false,
        isHandleLocked: false,
        handleDeg: 0,
        prevHandleDeg: 0,
        handleRotate: 0,
        flapRotate: 0,
        collectedNo: 0,
    });

    // --- Helpers ---
    const randomN = (max: number) => Math.ceil(Math.random() * max);
    const degToRad = (deg: number) => deg / (180 / Math.PI);
    const radToDeg = (rad: number) => Math.round(rad * (180 / Math.PI));
    const angleTo = (a: Vector, b: Vector) => Math.atan2(b.y - a.y, b.x - a.x);
    const distanceBetween = (a: Vector, b: Vector) => Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
    const px = (num: number) => `${num}px`;
    const nearest360 = (n: number) => n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % 360) - 360);

    const rotatePoint = ({ angle, axis, point }: { angle: number, axis: Vector, point: Vector }) => {
        const a = degToRad(angle);
        const aX = point.x - axis.x;
        const aY = point.y - axis.y;
        return {
            x: (aX * Math.cos(a)) - (aY * Math.sin(a)) + axis.x,
            y: (aX * Math.sin(a)) + (aY * Math.cos(a)) + axis.y,
        };
    };

    // --- Physics Engine ---
    const initPhysics = useCallback(() => {
        const width = 320;
        const height = 500;

        capsules.current = Array.from({ length: settings.current.capsuleNo }).map((_, i) => ({
            id: i,
            x: randomN(width - 32),
            y: randomN(height - 250),
            deg: 0,
            velocity: {
                x: Math.cos(degToRad(90)) * 10,
                y: Math.sin(degToRad(90)) * 10
            },
            acceleration: { x: 0, y: 4 },
            radius: 36,
            bounce: -0.3,
            friction: 0.99,
            toyType: TOY_TYPES[randomN(TOY_TYPES.length) - 1],
            baseColor: BASE_COLORS[randomN(BASE_COLORS.length) - 1],
            selected: false,
            prevX: 0,
            prevY: 0
        }));

        updateLines();
        setCapsulesReady(true);
    }, []);

    const updateLines = () => {
        lines.current.forEach((l, i) => {
            l.length = distanceBetween(l.start, l.end);

            const startEl = lineStartRefs.current[i];
            const lineEl = lineRefs.current[i];
            const endEl = lineEndRefs.current[i];

            if (startEl && lineEl && endEl) {
                startEl.style.transform = `translate(${px(l.start.x)}, ${px(l.start.y)}) rotate(${radToDeg(angleTo(l.start, l.end))}deg)`;
                lineEl.style.width = px(l.length);
                endEl.style.transform = `translate(${px(l.end.x)}, ${px(l.end.y)})`;
            }
        });
    };

    const animate = () => {
        if (!machineRef.current) return;
        const machineW = 320;
        const machineH = 500;

        capsules.current.forEach((c, i) => {
            if (c.selected) return;

            const el = capsuleRefs.current[i];
            const toyEl = toyRefs.current[i];
            if (!el || !toyEl) return;

            c.prevX = c.x;
            c.prevY = c.y;

            // Physics
            c.velocity.x += c.acceleration.x;
            c.velocity.y += c.acceleration.y;
            c.velocity.x *= c.friction;
            c.velocity.y *= c.friction;
            c.x += c.velocity.x;
            c.y += c.velocity.y;

            // Collisions
            capsules.current.forEach(c2 => {
                if (c.id === c2.id || c2.selected) return;
                const dist = distanceBetween(c, c2);
                if (dist < c.radius * 2) {
                    c.velocity.x *= -0.6;
                    c.velocity.y *= -0.6;
                    const overlap = dist - (c.radius * 2);
                    const fullDist = dist;
                    if (fullDist > 0) {
                        const remainingD = fullDist - (overlap / 2);
                        c.x = ((remainingD * c.x) + ((overlap / 2) * c2.x)) / fullDist;
                        c.y = ((remainingD * c.y) + ((overlap / 2) * c2.y)) / fullDist;
                    }
                }
            });

            lines.current.forEach(l => {
                const d1 = distanceBetween(c, l.start);
                const d2 = distanceBetween(c, l.end);
                if (d1 + d2 >= l.length - c.radius && d1 + d2 <= l.length + c.radius) {
                    const dot = (((c.x - l.start.x) * (l.end.x - l.start.x)) + ((c.y - l.start.y) * (l.end.y - l.start.y))) / Math.pow(l.length, 2);
                    const closestX = l.start.x + (dot * (l.end.x - l.start.x));
                    const closestY = l.start.y + (dot * (l.end.y - l.start.y));

                    const fullDist = distanceBetween(c, { x: closestX, y: closestY });

                    if (fullDist < c.radius) {
                        c.velocity.x *= -0.6;
                        c.velocity.y *= -0.6;
                        const overlap = fullDist - c.radius;
                        c.x = ((fullDist - overlap / 2) * c.x + (overlap / 2) * closestX) / fullDist;
                        c.y = ((fullDist - overlap / 2) * c.y + (overlap / 2) * closestY) / fullDist;
                    }
                }
            });

            const buffer = 5;
            if (c.x + c.radius + buffer > machineW) {
                c.x = machineW - (c.radius + buffer);
                c.velocity.x *= c.bounce;
            }
            if (c.x - (c.radius + buffer) < 0) {
                c.x = c.radius;
                c.velocity.x *= c.bounce;
            }
            if (c.y + c.radius + buffer > machineH) {
                c.y = machineH - c.radius - buffer;
                c.velocity.y *= c.bounce;
            }
            if (c.y - c.radius < 0) {
                c.y = c.radius;
                c.velocity.y *= c.bounce;
            }

            if (Math.abs(c.prevX - c.x) < 2 && Math.abs(c.prevY - c.y) < 2) {
                c.velocity.x = 0;
                c.velocity.y = 0;
                c.x = c.prevX;
                c.y = c.prevY;
            } else {
                if (Math.abs(c.prevX - c.x)) {
                    const rotationChange = (c.x - c.prevX) * 2;
                    c.deg += rotationChange;
                    toyEl.style.transform = `rotate(${c.deg + rotationChange}deg)`;
                }
            }

            el.style.transform = `translate(${px(c.x)}, ${px(c.y)}) rotate(${c.deg}deg)`;
        });

        requestRef.current = requestAnimationFrame(animate);
    };

    const rotateLines = (angles: number[]) => {
        angles.forEach((angle, i) => {
            const line = lines.current[i];
            const axisPoint = line.axis === 'start' ? line.start : line.end;
            const targetPoint = line.point === 'start' ? line.start : line.end;

            const newPoint = rotatePoint({ angle, axis: axisPoint, point: targetPoint });

            if (line.point === 'start') line.start = newPoint;
            else line.end = newPoint;
        });
    };

    const openFlap = useCallback(() => {
        if (settings.current.flapRotate > -20) {
            settings.current.flapRotate -= 2;
            rotateLines([2, -2, -4]);
            updateLines();
            setTimeout(openFlap, 30);
        } else {
            setTimeout(closeFlap, 800);
        }
    }, []);

    const closeFlap = useCallback(() => {
        if (settings.current.flapRotate < 0) {
            settings.current.flapRotate += 1;
            if (settings.current.flapRotate === 0) {
                lines.current[0].end = { x: 160, y: 360 };
                lines.current[1].start = { x: 160, y: 360 };
                lines.current[2].start = { x: 70, y: 340 };
                settings.current.isHandleLocked = false;
            } else {
                rotateLines([-1, 1, 2]);
            }
            updateLines();
            setTimeout(closeFlap, 30);
        }
    }, []);

    const releaseCapsule = () => {
        settings.current.flapRotate = 0;
        settings.current.isHandleLocked = true;
        setTimeout(openFlap, 30);
    };

    const shake = () => {
        capsules.current.forEach(c => {
            if (!c.selected) {
                const angle = degToRad(randomN(270));
                c.velocity.x = Math.cos(angle) * 10;
                c.velocity.y = Math.sin(angle) * 10;
            }
        });
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    const handleCapsuleClick = (index: number) => {
        if (isLocked) return;
        const c = capsules.current[index];
        const el = capsuleRefs.current[index];
        const toy = toyRefs.current[index];

        if (!el || !wrapperRef.current || !machineRef.current || !toyBoxRef.current || !toy) return;

        setIsLocked(true);
        c.selected = true;

        el.classList.add('enlarge');

        // Use logical center of machine (96, 186) adjusted for scale/offset
        // Since buttons are below, machine is top aligned in wrapper.
        const centerX = 160 - 64; // 96
        const centerY = 250 - 64; // 186

        el.style.transform = `translate(${px(centerX)}, ${px(centerY)}) rotate(${nearest360(c.deg)}deg)`;
        toy.style.transform = 'rotate(0deg)';

        setTimeout(() => el.classList.add('open'), 700);

        setTimeout(() => {
            setIsLocked(false);
            toy.classList.add('collected');

            const colX = settings.current.collectedNo % 10 * 32;
            const colY = Math.floor(settings.current.collectedNo / 10) * 32;

            // Toybox is at -84px
            const destX = 16 + colX;
            const destY = -80 + 16 + colY;

            el.style.transform = `translate(${px(destX)}, ${px(destY)})`;
            settings.current.collectedNo++;
        }, 1800);
    };

    const getPage = (e: MouseEvent | TouchEvent, type: 'X' | 'Y') => {
        // @ts-expect-error - unified touch/mouse
        return e.type[0] === 'm' ? e[`page${type}`] : e.touches[0][`page${type}`];
    }

    useEffect(() => {
        if (!isOpen) {
            setCapsulesReady(false);
            return;
        }

        const handleMouseDown = (e: any) => {
            if (settings.current.isHandleLocked || !circleRef.current) return;
            settings.current.isTurningHandle = true;

            const rect = circleRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mousePos = { x: getPage(e, 'X'), y: getPage(e, 'Y') };
            settings.current.handleDeg = radToDeg(angleTo(mousePos, { x: centerX, y: centerY }));
            settings.current.handleRotate = 0;
        };

        const handleMouseUp = () => {
            settings.current.isTurningHandle = false;
            if (handleRef.current) handleRef.current.style.transform = `rotate(0deg)`;
        };

        const handleMouseMove = (e: any) => {
            if (!settings.current.isTurningHandle || settings.current.isHandleLocked || !circleRef.current || !handleRef.current) return;

            settings.current.prevHandleDeg = settings.current.handleDeg;

            const rect = circleRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mousePos = { x: getPage(e, 'X'), y: getPage(e, 'Y') };
            settings.current.handleDeg = radToDeg(angleTo(mousePos, { x: centerX, y: centerY }));

            const diff = settings.current.handleDeg - settings.current.prevHandleDeg;

            if (diff >= 0.5) {
                handleRef.current.style.transform = `rotate(${settings.current.handleRotate}deg)`;
            }

            if (diff > 0 && diff < 100) settings.current.handleRotate += diff;

            if (settings.current.handleRotate > 350) {
                handleRef.current.style.transform = `rotate(10deg)`;
                releaseCapsule();
                settings.current.isTurningHandle = false;
            }
        };

        const hRef = handleRef.current;
        if (hRef) {
            hRef.addEventListener('mousedown', handleMouseDown);
            hRef.addEventListener('touchstart', handleMouseDown);
        }
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchend', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleMouseMove);

        initPhysics();
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (hRef) {
                hRef.removeEventListener('mousedown', handleMouseDown);
                hRef.removeEventListener('touchstart', handleMouseDown);
            }
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleMouseMove);
            cancelAnimationFrame(requestRef.current);
        };
    }, [isOpen, initPhysics, openFlap, closeFlap]);

    return (
        <>
            <style>{`
                /* Toggle */
                .gachapon-toggle {
                    width: 60px; height: 60px;
                    border-radius: 50%;
                    border: 3px solid #fff;
                    cursor: pointer;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    transition: transform 0.2s;
                    background-color: #ff3636;
                    image-rendering: pixelated;
                    gap: 0;
                }
                .gachapon-toggle:hover { transform: scale(1.05); }
                .gachapon-toggle::before {
                    content: ''; display: block;
                    width: 30px; height: 15px;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAADlJREFUKFNjZEAD/////48uhsxnZGRkROHDODCN6ApwWQBTBzYNpJmQRmwGgfQwkqMZ2dWjBvz/DwCs+Tv1GZ2dFQAAAABJRU5ErkJggg==);
                    background-size: 30px 15px; image-rendering: pixelated;
                }
                .gachapon-toggle::after {
                    content: ''; display: block;
                    width: 30px; height: 15px;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAADBJREFUKFNj/G9m9p+BAsA4agADIyj8yA0HxlOnGMEGkGMISDNIH9wAYg2CaYSpBwAEFBgbcBUePAAAAABJRU5ErkJggg==);
                    background-size: 30px 15px; image-rendering: pixelated;
                }

                /* Layout */
                .machine-wrapper {
                    position: relative;
                    width: 320px;
                    display: flex; flex-direction: column; align-items: center;
                    transform: scale(0.8);
                }
                @media(min-width: 640px) { .machine-wrapper { transform: scale(1); } }

                .pix { image-rendering: pixelated; background-repeat: no-repeat !important; }

                .toy-box {
                    position: absolute;
                    top: -84px; left: 0;
                    width: 320px; height: 64px;
                }

                /* Machine Body - NO border radius for pixel look */
                .capsule-machine {
                    position: relative;
                    width: 320px; height: 500px; 
                    --m: 4;
                    background-size: 320px 500px !important;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAB9CAYAAAA1I+RFAAAAAXNSR0IArs4c6QAAAchJREFUeF7t08Ftg0AARcFsPS7QNbhA10O0SGuR2Ipw3tHDgcOKx2H4jK8X13a/bq/OP/1sXG7jt8GPA3DnJnKEfADCO4e3nlqIOyC89/COiAD/Z7dXc4XD+oLgRAQIsAnE2gIBRoGYWyDAKBBzCwQYBWJugQCjQMwtEGAUiLkFAowCMbdAgFEg5hYIMArE3AIBRoGYWyDAKBBzCwQYBWJugQCjQMwtEGAUiLkFAowCMbdAgFEg5hYIMArE3AIBRoGYWyDAKBBzCwQYBWJugQCjQMwtEGAUiLkFAowCMbdAgFEg5hYIMArE3AIBRoGYWyDAKBBzCwQYBWJugQCjQMwtEGAUiLkFAowCMbdAgFEg5hYIMArEfMx+u1+3+J6PzMflNgCGT/8AtML3FSferPbbuvzK5yAX3hMgyL8Bj3DryW9l1KLLccC7FgAAAABJRU5ErkJggg==);
                    overflow: visible; 
                }
                .capsule-machine.shake { animation: shake 0.5s forwards; }
                @keyframes shake {
                    0%, 40%, 80% { margin-left: 5px; }
                    20%, 60%, 100% { margin-left: -5px; }
                }

                .capsule-machine::after {
                    position: absolute;
                    content: ''; top: 0; left: 0;
                    width: 100%; height: 100%;
                    background-size: 320px 500px !important;
                    background-repeat: no-repeat !important;
                    image-rendering: pixelated;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAB9CAYAAAA1I+RFAAAAAXNSR0IArs4c6QAAAg9JREFUeF7t3VFOg1AABVHZ/6JrIKFWJeXB8FVOP5FL0tOpGNPo9LXxeDwej63jdz82TdP01+DXgRVu68S7483Pf8vnCTh/EdxYJq9WCyC8MbjXs1YzgMftlsUTUH0nBVdEgADPC8TlEp8CzysCPG/3cyNR4HlFBZ63U2C0AwjwCoF4Dd8DAUaBOFcgwCgQ5woEGAXiXIEAo0CcKxBgFIhzBQKMAnGuQIBRIM4VCDAKxLkCAUaBOFcgwCgQ5woEGAXiXIEAo0CcKxBgFIhzBQKMAnGuQIBRIM4VCDAKxLkCAUaBOFcgwCgQ5woEGAXiXIEAo0CcKxBgFIhzBQKMAnGuQIBRIM4VCDAKxLkCAUaBOFcgwCgQ5woEGAXiXIFXAcbr3Hq+/Pm7WwvEJw8QYBSIcwUCjAJxrkCAUSDOFQgwCsS5AgFGgThXIMAoEOcKBBgF4lyBAKNAnCsQYBSIcwUCjAJxrkCAUSDOFQgwCsS5AgGOC+z9+98zn9K4RYF7cH9fgiOQHw94FG/FHEX8aMCzeEcQPxaw4o0iAty5B+29lT8S8Kr6RioEOPBT0LsKAQL8L+AtPFDFu1MAAowCca5AgFEgzhUIMArEuQIBRoE4VyDAKBDnCoyA8/wqxFv+PvAC/+FLTPOZe8rDV7vZiXPlAMOL/gRU4XHFNb6lwPXhrTwG+XqD+gUI8j3g1p39G7BRXt/gk08UAAAAAElFTkSuQmCC);
                    pointer-events: none;
                    z-index: 20; 
                    transition: 0.5s;
                }
                .capsule-machine.see-through::after,
                .capsule-machine.see-through .circle { opacity: 0.3; }

                /* Fullscreen Lock Hue */
                .fullscreen-lock {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background-color: #fab2cc;
                    opacity: 0.8;
                    z-index: 50;
                    pointer-events: none;
                    transition: opacity 0.3s;
                }

                /* Capsules */
                .capsule-wrapper {
                    position: absolute;
                    width: 0; height: 0;
                    transition: 0.05s;
                    cursor: pointer;
                    z-index: 2; 
                }
                .capsule {
                    position: absolute;
                    left: -32px; top: -32px;
                    width: 64px; height: 64px;
                    display: flex; align-items: center; justify-content: center;
                }
                .lid, .base {
                    position: absolute;
                    width: 64px; height: 32px;
                    background-size: 64px 32px !important;
                    background-repeat: no-repeat !important;
                    image-rendering: pixelated;
                    left: 0;
                }
                .lid {
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAADlJREFUKFNjZEAD/////48uhsxnZGRkROHDODCN6ApwWQBTBzYNpJmQRmwGgfQwkqMZ2dWjBvz/DwCs+Tv1GZ2dFQAAAABJRU5ErkJggg==);
                    top: 0;
                    transition: transform 1s, opacity 1s;
                }
                .base {
                    bottom: 0;
                    transition: transform 1s, opacity 1s;
                }
                .base.white { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAAC1JREFUKFNj/P///38GCgDjqAEMjKDwIzccGEEAFgGkGgLTCzeAWIOQLQXpAQC80x/1FKzGmwAAAABJRU5ErkJggg==); }
                .base.pink { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAADBJREFUKFNj/O/Y/p+BAsA4agADIyj8yA0Hxv2VjGADyDEEpBmkD24AsQbBNMLUAwDsrRnng7/G/QAAAABJRU5ErkJggg==); }
                .base.red { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAADBJREFUKFNj/G9m9p+BAsA4agADIyj8yA0HxlOnGMEGkGMISDNIH9wAYg2CaYSpBwAEFBgbcBUePAAAAABJRU5ErkJggg==); }
                .base.blue { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAADBJREFUKFNj1Nn36D8DBYBx1AAGRlD4kRsOV5zkGMEGkGMISDNIH9wAYg2CaYSpBwAPYhoAi8QRLQAAAABJRU5ErkJggg==); }

                /* Enlarge Animation */
                .capsule-wrapper.enlarge {
                    z-index: 60 !important; /* Above pink hue */
                    transition: 0.8s;
                    pointer-events: none;
                }
                .capsule-wrapper.enlarge .capsule {
                     width: 128px; height: 128px;
                     left: -64px; top: -64px;
                }
                .capsule-wrapper.enlarge .lid, .capsule-wrapper.enlarge .base {
                    width: 128px; height: 64px;
                    background-size: 128px 64px !important;
                }
                .capsule-wrapper.open .lid { transform: translateY(-100px); opacity: 0; }
                .capsule-wrapper.open .base { transform: translateY(100px); opacity: 0; }

                /* Toys */
                .toy {
                    position: absolute;
                    width: 32px; height: 32px;
                    background-size: 32px 32px !important;
                    z-index: -1;
                    transition: 0.5s;
                    image-rendering: pixelated;
                }
                .capsule-wrapper.enlarge .toy {
                    width: 64px; height: 64px;
                    background-size: 64px 64px !important;
                    z-index: -1;
                }

                .capsule-wrapper.enlarge.open .toy {
                    width: 96px; height: 96px;
                    background-size: 96px 96px !important;
                }
                .capsule-wrapper.enlarge.open .toy.collected {
                    width: 32px; height: 32px;
                    background-size: 32px 32px !important;
                }

                .bunny { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIJJREFUOE+tU1sOwCAIk/sfmkVmDc/oMvyktdQiNOLhVSIHpfVAYn55RAIB56K+CWhWEb8LKBcD3RNntYMkm+xpRsDY1F3ROctBh9gnAPtrEiYDn4MZ47ZQBYAPAmU15wnJ/Yn592tH4OBufwYtDg4RmG9+2oWtdbsLEuafbTy5D/gDlg9nEQXylfgAAAAASUVORK5CYII=); }
                .duck-yellow { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAG9JREFUOE9jZKAQMFKonwGXAf+xGIxVLTbB//9fBGHoZ5RYBxLDUI8ugFUzzDRshuA0AKQY3SU4Dfj//z/Czy+DwRZSbAC22CHJC/iiF9kgkgIR2VCYIcPQAJA38SYmWBTDUiUpeQElDOGpk9LcCAA2WjgR81D3SgAAAABJRU5ErkJggg==); }
                .duck-pink { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAG5JREFUOE9jZKAQMFKonwGXAf+xGIxVLTbB//8d2zH0M+6vBIlhqEcXwKoZZho2Q3AaAFKM7hKcBvx/EYTwc6Qp2EKKDcAWOyR5AV/0IhtEUiAiGwozZBgaAPIm3sQEi2JYqiQlL6CEITx1UpobAdngNhF5e7c/AAAAAElFTkSuQmCC); }
                .star { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAJRJREFUOE+1U0EOwCAIk1/4Lh/qu/yFi0QIIp1ZtnlZ4mxpC1B6eeiA7/M/fHdH0HsrjKdc+RMV+41Aq0tVpAIpeEwgYSXxjcKdSlTYUBBW80QDGN2JhYUEPbYEkonNYFNysMFYH+LSezsHaCYWgt6KhmkGKPKuuM8sbCG6HWBlMESRbnoMB8wSUa6kbTxtneuIbukFwYNUEDYqJhQAAAAASUVORK5CYII=); }
                .water-melon { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIdJREFUOE/Fk0sOwCAIRGHXQ3kaD9bT9FDubCAZgx+qjU3qTmEeSAamzcML+kxEbp4XEBEd16n8FCLqdPntQ4Zo1JmAJJ5CLDoLUDGSAPDugABQKr8ASA2uAKtiM5ePASDbQT7MoP/CNuDXGYhB1H2rXbQ+UN8AMtsPz4lWp90MznQXZsW7+A1tU4YRf0fGXgAAAABJRU5ErkJggg==); }
                .panda { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIVJREFUOE+1U1sOwCAIk/sf2gWirFSMLNv8UmzLwyrt5RLgd9hrHM96xTHj7gRa75EvglBLlQswkTsEoUVAs3LZ6YSEVQbK+PNu1wJg1hY+EcCaD9X8MIOHngoVlKafJHB3mEDxFf2l1Exsr6MVxmCdtwgU51AWmMDsY90fgrJO8K66EL8ABN49ETdlUwYAAAAASUVORK5CYII=); }
                .penguin { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAH5JREFUOE+1k9ENgDAIRGEL53JQ53ILTKvFeoAhQfvZ5q7HvZapuLioJzSQpKHqZoOseNzRtcZARIjZnwzOfjIY+WRfH3XwsmE9foLPDBI0TIKm6SRaWd6ayo0xRmJldxOKKbzFxxTmJSYTuCOc41/4EBvshwZaJLzScL/8Gw8v8zIR/QQO5QAAAABJRU5ErkJggg==); }
                .dino { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIpJREFUOE+lk90RABEMhKMRFahC4apQgUbcMGLiL8vcveVGPpvNMvTzMz/7SQLyBWy5kH9kFxLsj96+AaK3JMGlJhpU92KQz01PgJsRyvWzisVEBNIA1UQXkroNBKjNmgoIQCMIH+pGdkm8zcQegDyYN6EqaPN2T7iWYTo9Jt5Ej3rL+THK8B2cDnzs+TgRPHoJSgAAAABJRU5ErkJggg==); }
                .roboto-san { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAKZJREFUOE+1k+0RgCAIhnWQmqCGqMFriJqgBqFDhdBAu+7yp8DDy5d39oPC5DVX9TM5AkBkeB/cXgHKrJY+hkkqDMtRqeg27XPPih6AbercuJ4qiGz/Aih1ysJKZHlVBW+aYAEw9vMUOLA1iaK0uCGYmZYGJ4Dd1p600XIxgAJQQQ1gKaD45jLJBlr7HcpJErkS8ZfdhHYgEpD1SDsqFSAa+OhReZUXbdFUEQlelEMAAAAASUVORK5CYII=); }
                .roboto-sama { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAKNJREFUOE+1U20RgCAMZS2sIxFMowkkjRG0ji3mMWHiGILeyR85x/vYG4ApLxQl0I6qP8NBxH2gLXQLfVoIpGrJH5OlrIj9/NDRVYJtYkc5wToaY51OFGo/EwTtoMJO0vaeHTSkUCLw0E9TiCAfaHUSiTrh4hRYmXr1aWvLOiOyAVKNubGDOgHj5PV808J5zRWntSBvmNJj8iSZO02w5iALWZIcuqhDD326nv0AAAAASUVORK5CYII=); }
                .turtle { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAKlJREFUOE+1k8ENgCAMRcvNERjGKRjBwRzBKRiGEbzVtAECpUWjkQtJ7X/wf8XBx+UMPRr1oX8oLHG3xMw8163TSAAucacmoL1dpUY7AFTdP4Bycj6tu83dDaj5dQbsPwelDkF8Z/ttBjVATEEFOH+wndbGEKIlLkSCzKYAmMI0A+eP6X9AdJxZELa7DFhcPEqI5l+GWAHaJLQJaACG5MCGgLW69RofP/ILf2RUEUrHVC0AAAAASUVORK5CYII=); }

                /* Lines/Ramps */
                .line-start, .line-end {
                    position: absolute;
                    width: 0; height: 0;
                    z-index: 2; 
                }
                .line {
                    position: absolute;
                    height: 1px; width: 0;
                    border-top: solid #ff3636 4px;
                }

                /* UI Elements */
                .circle {
                    position: absolute;
                    bottom: 30px; left: 26px; /* Positioned back on machine */
                    width: 160px; height: 160px;
                    display: flex;
                    align-items: center;
                    z-index: 25; 
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAQJJREFUWEft2e0NAiEMBmAZRCfQIXRwHUIn0EG8YFJSsUD5CLSx98vkIPfkhdij53Yd1/H6fHOmPy4HxxlHjameiFH385713NPtFcbVYtlAgHFRKTlgudAicBQsBnOhWaDH9SZW2gMemkszCZyBA3wOSQJn4krIH+AKXA75BVyJSyH1ACWkR6UYEhQNlISLU/wkaMBSOSHuw5+3k5geXmYDNqxumOKX2RK0BHsS6J1re/A/ErRa3LjOoRarSFAaEh9DdbxRwzaR8OoVH+L1nOokpEi1QPS1PlYkWd08molsbr9hpP89uk84pIGJq9SoTisXBs8utoDjUiq2iU7V/BmfITaUSgYmL25tRwAAAABJRU5ErkJggg==);
                    background-size: 160px 160px;
                    image-rendering: pixelated;
                    /* Removed scale(0.8) to make it bigger */
                    transform-origin: bottom left;
                }
                .circle::after {
                    position: absolute;
                    top: -10px; right: -22px;
                    content: '';
                    width: 60px; height: 60px;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAGVJREFUOE9j1N376D8DErjsLMeIzMfHZkTXDFNMjCEotmAzCJ8hWJ1IrFfw+g/ZEGwuIBg4+AwgqBkUgDAD0G0nSTPIIGQDiNKMy3aSNSPbTrRmbLbTXjOuJEy0zdhSHdGasfkZAFdWOttEm2PiAAAAAElFTkSuQmCC);
                    background-size: 60px 60px !important;
                    background-repeat: no-repeat !important;
                    image-rendering: pixelated;
                }
                .handle {
                    position: relative;
                    width: 160px; height: 50px;
                    cursor: pointer;
                }
                .handle::after {
                    position: absolute;
                    top: -7px;
                    content: '';
                    width: 160px; height: 64px;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAQCAYAAABk1z2tAAAAAXNSR0IArs4c6QAAANRJREFUSEvVlusNwjAMhMkgMAEdAgaHIWACGITKlU4K1plzQ4ho/+V1/nx2m5Zdh+d4ebyYzP18KN/KNwl4oNtpTzmm6/NtvgU4BZgFUm61AFPAXkA9gBfAUUAtwMXgoh5Sgmq9LqnFUGOvZ/spIBNCgCgQkrSzPmHM+bVoHqAhoG2oxbwQG9uZOgloINinxFhSOB+WWAECqE4GzisHo4TTJWYOeid8yVmJVc/59VWA6gUYsb704N9/ZpgTo76LmZtlm1ed6q+swxmHVKyUg0rkl79bMwwK5tMkyZ5mAAAAAElFTkSuQmCC);
                    background-size: 160px 64px !important;
                    background-repeat: no-repeat !important;
                    image-rendering: pixelated;
                }

                /* Covers */
                .cover { position: absolute; z-index: 10; pointer-events: auto; }
                .cover.a { top: 0; left: 0; width: 320px; height: 280px; }
                .cover.b { top: 280px; left: 0; width: 212px; height: 220px; }
                .cover.c { top: 280px; left: 212px; width: 108px; height: 108px; }
                .cover.d { bottom: 0; left: 212px; width: 80px; height: 24px; }
                .cover.e { bottom: 0; left: 292px; height: 112px; width: 28px; }

                /* Action Buttons */
                .button-wrapper {
                    margin-top: 20px; /* Space below machine */
                    display: flex; gap: 10px;
                    z-index: 30;
                }
                .machine-btn {
                    border: 2px solid black;
                    background-color: white;
                    padding: 10px 20px;
                    font-size: 12px;
                    cursor: pointer;
                    color: black;
                    box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
                    text-transform: uppercase;
                    font-family: inherit;
                }
                .machine-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 rgba(0,0,0,0.2); }
                
                .close-btn {
                    position: absolute;
                    top: -50px; right: -50px;
                    background: white;
                    border: none;
                    width: 40px; height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 100;
                    font-weight: bold;
                    font-size: 1.2rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                }
            `}</style>

            <div className="fixed bottom-5 right-5 z-[9998]">
                {!isOpen && (
                    <button
                        className="gachapon-toggle"
                        onClick={() => setIsOpen(true)}
                        aria-label="Open Gachapon"
                    />
                )}
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 flex justify-center items-center z-[9999] bg-black/60 backdrop-blur-[4px]"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Pink Locked Hue Overlay (Full Screen) */}
                    {isLocked && <div className="fullscreen-lock" />}

                    <div
                        className={`machine-wrapper`}
                        ref={wrapperRef}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className={`close-btn ${press_start_2p.className}`} onClick={() => setIsOpen(false)}>X</button>

                        <div className="toy-box" ref={toyBoxRef} />

                        <div
                            className={`capsule-machine pix ${isShaking ? 'shake' : ''} ${isSeeThrough ? 'see-through' : ''}`}
                            ref={machineRef}
                        >
                            {/* Capsules Render */}
                            {capsulesReady && capsules.current.map((c, i) => (
                                <div
                                    key={c.id}
                                    className="capsule-wrapper"
                                    ref={el => { capsuleRefs.current[i] = el; }}
                                    onClick={() => handleCapsuleClick(i)}
                                >
                                    <div className="capsule">
                                        <div className="lid" />
                                        <div
                                            className={`toy ${c.toyType}`}
                                            ref={el => { toyRefs.current[i] = el; }}
                                        />
                                        <div className={`base ${c.baseColor}`} />
                                    </div>
                                </div>
                            ))}

                            {/* Internal Lines */}
                            {lines.current.map((line, i) => (
                                <React.Fragment key={line.id}>
                                    <div
                                        className="line-start"
                                        ref={el => { lineStartRefs.current[i] = el; }}
                                    >
                                        <div
                                            className="line"
                                            ref={el => { lineRefs.current[i] = el; }}
                                        />
                                    </div>
                                    <div
                                        className="line-end"
                                        ref={el => { lineEndRefs.current[i] = el; }}
                                    />
                                </React.Fragment>
                            ))}

                            {/* Covers (Transparent Interactions) */}
                            <div className="cover a" />
                            <div className="cover b" />
                            <div className="cover c" />
                            <div className="cover d" />
                            <div className="cover e" />
                            {/* Removed cover.white to allow hole visibility */}

                            <div className="circle" ref={circleRef}>
                                <div className="handle" ref={handleRef} />
                            </div>
                        </div>

                        {/* Controls moved outside machine */}
                        <div className="button-wrapper">
                            <button className={`machine-btn ${press_start_2p.className}`} onClick={shake}>SHAKE</button>
                            <button
                                className={`machine-btn ${press_start_2p.className}`}
                                onClick={() => setIsSeeThrough(!isSeeThrough)}
                            >
                                {isSeeThrough ? 'HIDE' : 'PEEK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
