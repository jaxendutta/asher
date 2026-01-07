"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { tiny5 } from '@/lib/fonts';

// --- Types ---
interface Size {
    w: number;
    h: number;
}

// --- Data URIs & Constants ---
const BEAR_BG = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAEFJREFUKFNjZMACvp+a/h8kzGmWyYgujSIAU4iuCFkjXAMuxTDNME1gDYQUI2tiJFYxTNPI1EBysMKCi1DwwiIOAN7kLBdgm7MJAAAAAElFTkSuQmCC)";
const ROUND_BG = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAEBJREFUKFNjZEAD309N/48sxGmWyYjMh3PQFaIbBNMI1kBIMUwzSBMjsYphmkamBpKDFRZchIIXJeKQY5VQ0gAAHM4sF8jjrCwAAAAASUVORK5CYII=)";
const MOUTH_BG = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAJCAYAAAALpr0TAAAAAXNSR0IArs4c6QAAADxJREFUKFNjZICCh6UT/st15cO4YPpR2UQG+e4CRhAbTIAUwVTAFIMUwQBIMSOyIhTj0DhDQiHRviY2HAHIiSqDjfLRxAAAAABJRU5ErkJggg==)";
const NOSE_BG = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAAEZJREFUKFNjZICC/////4exQbSyRxYyl+HujmkofEZGRkaQAJhA10yMAWDNIIBNM4pVBDjDwQBcgUhMOIADEVc0EjIAphcAZB4l+bnOcdYAAAAASUVORK5CYII=)";
const HAND_BG = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAGCAYAAAAL+1RLAAAAAXNSR0IArs4c6QAAAClJREFUGFdjDNfg/88ABStvfGQEMcEEDIAUgCRQBEGSIAnCgnDt2CwCAGzKEyHNFrF4AAAAAElFTkSuQmCC)";
const CRUMBS_BG = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAABxJREFUGFdjZICCM61p/0FMRsICIKUm1bMYYVoAj+EO3fwl+Y4AAAAASUVORK5CYII=)";
const SPARKLE_BG = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAEdJREFUKFONUFsKACAIa/c/9EJokqaVPyLupRirSBIANOfuiyfQAAcbQCaWijtZcVrrVtHsbzmDorJW14d3fCl2/3OXF0D7CVHNLAu21ivDAAAAAElFTkSuQmCC)";

// Donut Stages
const DONUT_STAGES = [
    "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAAAXNSR0IArs4c6QAAAVJJREFUOE9jZCAAwjX4/+NTsvLGR0Z88lglkQ0tjQ1nMLazxWlGRGoOXA6bZSgWwAwGGUosQLYcZhmyRXALQIaTYjA2B8AsA1kEswRsATUMR7YQZBHMErAFZ1rT8EbkrdtXsIaYmqoOzpAEWcJoG8vIiM/1uAxGNxWbRTBf4LSge/FKBn8LbbhZOk5WKOZe2XcMzt944ioDtvgDmYHTApgLQKZUV6ViDYrWttlg8RWzpzCcPXQYQw1eC0CqkVMFNhtABoMANsNB4nALQEFBKMKwWYDLYJBaUPyBgg4cRMhhjc8iYjIfcsIAWwDS9PfFrv8rKxrg+sm1BNnw8I4GBmYJN0Z4Rlt2YDUDsiUw2whZhi0pgwyPcggF52aUogJkCQhgs4iY4AEZDAIww0FsrIUdzCJiLIMZCjMYrAepCCdYXCNbhs0XINfCAMHiGpsBlFY4AGg4nGHeibMpAAAAAElFTkSuQmCC)",
    "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAAAXNSR0IArs4c6QAAAWBJREFUOE+dlbFKA0EQhm/xAWx9ASVgOhsJJEgKW6twIqRMZxsQ06SJCLZ2KQXJYWVrIaIgNnYRRF/ANg8QIv/CP8yds3trtko2O983O7s7cVniyBubK2tp8blwMUT0RwYCPptem5zjwanMW7JkwbCfm4K9TlvmKdOiWgGyD8GrRsogoiQq+A9cyyCixAt4gHprGv71PTfLs7PdDJ4vJK7dd06Drm4KH8CShMBVqiXiLkoCHQjZ0f6uTDW7rRJ3/vgq3+/fPiSpKiMoYAYIGJ0PzFJMLqZ+Hlf4/fnlzxokGRRgtb4VloFvw4JjvQhQiroDswQhMNbi/FA6vwNd65gopavoi+EFCFr+PKyKs7HEryvR8PxynG1sHTp5B7dPd5mW0FYns64y4CcHPf+a5SWjVJBgWKKU8gCMQTg+l1oFXzRFKTJCCfYxqoWbvUj3fi2zdoFsOdZq16E/mhhUJ/ILNpijYV616soAAAAASUVORK5CYII=)",
    "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAAAXNSR0IArs4c6QAAAVtJREFUOE9jZKAxYKSG+eEa/P9B5qy88RHDPIotABm+YvYUsDsjUnPANLJFZFkAczHIsNLYcHggGNvZwi2CWUKSBTCDkQ3FFsQgi0C+AVlCtAUgw/0ttFHMU1PVwRmFIEsYbWOJswCb4cgmY7MI5guifLAsweq/jpMVimuv7DsG5288cRUlLmAS3YtXMoAtwJbMkCOyuioVa1C0ts0Gi4NS0dlDhzHUgC0AGQSLNJAADIDEkFMFNhtgyROb4SD1cAtAkUcowrBZgMtgkNpbt68wgIIO7APk1IHPImJyPchgGABbAOL8fbHr/8qKBrgEuZYgGx7e0cDALOEGSaYgXyw7sJoB2RKYbYQsQzYUpgdkeJRDKGpGg1kCLkuQfENMsCAbDGLDDAexUfIBLGmCfAMDhCwDuRYGQAaDHYhUqmLNaMh5ANkybL6BGYpuMEwtwZyMbBk2C7DVAcjqADiOkGEeg4/IAAAAAElFTkSuQmCC)",
    "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAAAXNSR0IArs4c6QAAARFJREFUOE9jZKAxYKSG+eEa/P9B5qy88RHDPIotABm+YvYUsDsjUnPANLJFZFsAc3VpbDg8EIztbOEWwSwhywKQ4cgGowczyCKQb0CWkGXBsgQrcJirqergjEKQJYy2saRbADMc2WRsFsF8QbIPLi0qAbv+yr5jcDs2nrjKgC3IuhevZCDbApDprW2zwZaAUtHZQ4cxgossC2CpB2YwiMZmOEicZAuQ0zw+g0Fyt25fYQAFHdFBRChpwsIHZDAMUN0CZMPDOxoYmCXciE+muHyAbCjM5SDDoxxCic9oIMP9LbQJlosgg0EAZjiITVQc4LMAZijMYJILO5Dhyw6sxul6kGthgOziGjnto9uEzVBkNQCDSHph6/HU2wAAAABJRU5ErkJggg==)",
    "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAAAXNSR0IArs4c6QAAAO1JREFUOE9jZKAxYKSx+QxUsyBcg/8/zLErb3yEm0uxBTCDS2PDGYztbMF2RKTmMMAsocgCkOEgg9EByCKYJRRZcKY1DR4s2CxhtI1lJNuCZQlWcMPVVHVw+oIqFmw8cZUBW1B1L15Jfiq6tKjkf2vbbLDLV8yewnD20GEMX1BkASiCQQaDADbDQeJkWwAzHJfBIMNv3b7CAAo6suIAV/KEGQwLK6pbAHI1DIR3NDAwS7iRn0xhvkA2FNnwKIdQcG4mK4jgBmnw//e30EZxNYgDMxzEptiCZQdWwy0AGQwCNCns0A2G2UqRD4ipSwCm6mlhhOrUsgAAAABJRU5ErkJggg==)",
    "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAAAXNSR0IArs4c6QAAAIpJREFUOE9jZKAxYKSx+QyjFhAMYaoH0ZnWtP/di1eCLV554yMjVS0AGQ7zkrGdLUNEag71IhnZcJglIJ9QxQf/Dy/+f/bQYYz4oJoF4Rr8/0tjw+lrwa3bVxg2nrhKnSACOR0WByCDYYCqFoCCyd9CG8VwqidTkCUwG0CGg9hUSUX4svOoBQQLOwA+szZhNsKHIwAAAABJRU5ErkJggg==)"
];

export default function Bear() {
    const [isEating, setIsEating] = useState(false);
    const [isGrowing, setIsGrowing] = useState(false);
    const [foodEatenLevel, setFoodEatenLevel] = useState(0);
    const [showMessage, setShowMessage] = useState(true);
    const [bearSize, setBearSize] = useState<Size>({ w: 70, h: 90 });
    const [crumbs, setCrumbs] = useState<{ id: number, x: number, y: number }[]>([]);

    // Physics / Drag Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const bearRef = useRef<HTMLDivElement>(null);
    const mouthRef = useRef<HTMLDivElement>(null);
    const foodRef = useRef<HTMLDivElement>(null);

    // Counter for unique keys
    const crumbIdCounter = useRef(0);

    // Mutable state for the loop
    const dragRef = useRef({
        active: false,
        offset: { x: 0, y: 0 },
        foodPos: { x: 0, y: 0 },
        startPos: { x: 0, y: 0 }
    });

    const eatTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Helper: px string
    const px = (n: number) => `${n}px`;

    // Initialize position
    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            dragRef.current.startPos = {
                x: width / 2 - 36,
                y: height - (height > 400 ? 200 : 100)
            };
            dragRef.current.foodPos = { ...dragRef.current.startPos };

            if (foodRef.current) {
                foodRef.current.style.transform = `translate(${px(dragRef.current.foodPos.x)}, ${px(dragRef.current.foodPos.y)})`;
            }
        }
    }, []);

    // Drag Logic
    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isEating || isGrowing) return;

        const clientX = e.clientX;
        const clientY = e.clientY;

        dragRef.current.active = true;
        dragRef.current.offset = {
            x: clientX - dragRef.current.foodPos.x,
            y: clientY - dragRef.current.foodPos.y
        };

        if (foodRef.current) {
            foodRef.current.style.cursor = 'grabbing';
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragRef.current.active || isGrowing) return;

        e.preventDefault();
        const clientX = e.clientX;
        const clientY = e.clientY;

        const newX = clientX - dragRef.current.offset.x;
        const newY = clientY - dragRef.current.offset.y;

        dragRef.current.foodPos = { x: newX, y: newY };

        if (foodRef.current) {
            foodRef.current.style.transform = `translate(${px(newX)}, ${px(newY)})`;
        }

        checkCollision();
    };

    const handlePointerUp = () => {
        dragRef.current.active = false;
        if (foodRef.current) {
            foodRef.current.style.cursor = 'grab';
        }
    };

    const checkCollision = useCallback(() => {
        if (!mouthRef.current || !foodRef.current || isGrowing) return;

        const mouthRect = mouthRef.current.getBoundingClientRect();
        const foodRect = foodRef.current.getBoundingClientRect();

        const mouthCenter = {
            x: mouthRect.left + mouthRect.width / 2,
            y: mouthRect.top + mouthRect.height / 2
        };
        const foodCenter = {
            x: foodRect.left + foodRect.width / 2,
            y: foodRect.top + foodRect.height / 2
        };

        const dist = Math.sqrt(
            Math.pow(mouthCenter.x - foodCenter.x, 2) +
            Math.pow(mouthCenter.y - foodCenter.y, 2)
        );

        if (dist < 50) {
            startEating();
        } else {
            stopEating();
        }
    }, [isGrowing]);

    const startEating = () => {
        if (eatTimerRef.current || isGrowing) return;

        setIsEating(true);
        setShowMessage(false);

        eatTimerRef.current = setInterval(() => {
            setFoodEatenLevel(prev => {
                const next = prev + 1;

                // Spawn Crumb with Unique ID
                crumbIdCounter.current += 1;
                const newId = crumbIdCounter.current;

                setCrumbs(c => [...c, {
                    id: newId,
                    x: dragRef.current.foodPos.x + Math.random() * 40,
                    y: dragRef.current.foodPos.y + Math.random() * 40
                }]);

                // Remove crumb after animation
                setTimeout(() => {
                    setCrumbs(c => c.filter(x => x.id !== newId));
                }, 1000);

                if (next >= 5) {
                    finishEating();
                    return 5;
                }
                return next;
            });
        }, 500);
    };

    const stopEating = () => {
        if (eatTimerRef.current) {
            clearInterval(eatTimerRef.current);
            eatTimerRef.current = null;
        }
        setIsEating(false);
    };

    const finishEating = () => {
        if (eatTimerRef.current) {
            clearInterval(eatTimerRef.current);
            eatTimerRef.current = null;
        }

        setIsEating(false);
        setIsGrowing(true); // Hides donut, triggers cheek shrink

        // Trigger bear expansion simultaneously with cheek shrink
        setBearSize(prev => ({ w: prev.w + 20, h: prev.h + 10 }));

        // Reset food IMMEDIATELY while it is hidden
        // This prevents the "ghost piece" from appearing at the old location
        resetFood();

        // Wait for animations (approx 0.5s transition + buffer)
        setTimeout(() => {
            setIsGrowing(false); // Show fresh donut (triggers sparkle)
        }, 600);
    };

    const resetFood = () => {
        setFoodEatenLevel(0);

        // Reset Position
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            const yPos = height - (height > 400 ? 200 : 100);
            const xPos = width / 2 - 36;

            dragRef.current.foodPos = { x: xPos, y: yPos };
            // Style update will happen on re-mount or we can force it here just in case it's visible (it shouldn't be)
        }
    };

    return (
        <div
            ref={containerRef}
            className={`bear-wrapper relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden touch-none select-none ${tiny5.className}`}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <style jsx>{`
                .bear-wrapper {
                    --brown: #57280f;
                }
                .bear-wrapper.show-message::after {
                    position: absolute;
                    content: 'drag the donut and feed the bear';
                    top: 20px;
                    font-style: italic;
                    color: #57280f;
                    font-size: 1.2em;
                    z-index: 10;
                    opacity: 0.8;
                }

                .bear-object {
                    position: absolute;
                    image-rendering: pixelated;
                }

                .bear-round {
                    background-image: ${ROUND_BG};
                    image-rendering: pixelated;
                    background-size: cover;
                }

                /* Bear Styles */
                .bear-character {
                    position: relative;
                    /* Map CSS vars to component state for stable animation */
                    width: var(--w);
                    height: var(--h);
                    
                    --bg: ${BEAR_BG};
                    border-image: var(--bg) 5 fill / 12px / 0 stretch;
                    transition: width 0.5s, height 0.5s;
                    
                    /* Prevent flex child from stretching weirdly */
                    flex-shrink: 0;
                    flex-grow: 0;
                }

                .bear-ears {
                    position: absolute;
                    width: 120%;
                    left: -10%;
                    top: -16px;
                }
                .bear-inner-ears {
                    display: flex;
                    justify-content: space-evenly;
                    width: 100%;
                    max-width: 200px;
                    margin: 0 auto;
                }
                .bear-ear { width: 18px; height: 18px; }

                /* Face Animation */
                .bear-face {
                    position: absolute;
                    top: 24px;
                    width: 100%;
                }
                .bear-character.eating .bear-ears,
                .bear-character.eating .bear-face {
                    animation: bear-face-eat infinite 0.4s;
                }

                @keyframes bear-face-eat {
                    0%, 100% { top: 22px; }
                    50% { top: 24px; }
                }
                @keyframes bear-ears-eat {
                    0%, 100% { top: -14px; }
                    50% { top: -16px; }
                }
                .bear-character.eating .bear-ears {
                    animation: bear-ears-eat infinite 0.4s;
                }

                .bear-inner-face {
                    width: 100%;
                    max-width: 140px;
                    display: flex;
                    justify-content: space-evenly;
                    align-items: center;
                    margin: 0 auto;
                }
                .bear-eye {
                    background-color: var(--brown);
                    width: 4px;
                    height: 8px;
                    z-index: 1;
                }
                .bear-nose {
                    background-image: ${NOSE_BG};
                    image-rendering: pixelated;
                    background-size: cover;
                    width: 32px;
                    height: 16px;
                    margin-bottom: -16px;
                }

                /* Cheeks & Mouth */
                .bear-cheeks {
                    position: absolute;
                    bottom: -10px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    height: 0;
                }
                .bear-cheek {
                    width: 0; height: 0;
                }
                .bear-character.eating .bear-cheek {
                    animation: bear-cheek-eat infinite 0.4s;
                    animation-play-state: running;
                }
                @keyframes bear-cheek-eat {
                    0%, 100% { width: 30px; height: 30px; }
                    50% { width: 40px; height: 40px; }
                }
                
                /* Synced Shrink Animation */
                .bear-character.grow .bear-cheek {
                     animation: bear-cheek-shrink 0.5s forwards;
                }
                @keyframes bear-cheek-shrink {
                    0% { width: 40px; height: 40px; }
                    100% { width: 0; height: 0; }
                }

                .bear-mouth-wrapper {
                    width: 16px; height: 4px;
                    margin-top: -5px; z-index: 1;
                }
                .bear-mouth {
                    --bg: ${MOUTH_BG};
                    border-image: var(--bg) 4 fill / 10px 9px / 0 stretch;
                    width: 20px; height: 0;
                }
                .bear-character.eating .bear-mouth-wrapper {
                    background-image: none; width: 0; height: 0;
                }
                .bear-character.eating .bear-mouth {
                    animation: bear-mouth-eat infinite 0.4s;
                }
                @keyframes bear-mouth-eat {
                    0%, 100% { width: 20px; height: 0; }
                    50% { width: 40px; height: 30px; }
                }

                /* Limbs */
                .bear-limbs {
                    position: absolute;
                    width: 100%; height: 40px;
                    bottom: -10px;
                    display: flex; flex-direction: column; justify-content: space-between;
                }
                .bear-character.eating .bear-limbs {
                    animation: bear-limbs-eat infinite 0.4s;
                }
                @keyframes bear-limbs-eat {
                    0%, 100% { height: 40px; }
                    50% { height: 42px; }
                }
                
                .bear-hands, .bear-feet { display: flex; justify-content: space-around; }
                .bear-hand {
                    background-image: ${HAND_BG};
                    width: 10px; height: 12px;
                    image-rendering: pixelated; background-size: cover;
                }
                .bear-hand.flip { transform: scale(-1, 1); }
                .bear-foot { width: 18px; height: 18px; }

                /* Food */
                .bear-food {
                    width: 72px; height: 54px;
                    cursor: grab;
                    position: absolute;
                    top: 0; left: 0;
                    z-index: 50;
                    image-rendering: pixelated;
                    background-size: cover;
                    background-repeat: no-repeat;
                }
                .bear-food:active { cursor: grabbing; }

                .bear-donut { background-image: ${DONUT_STAGES[0]}; }
                .bear-donut-1 { background-image: ${DONUT_STAGES[1]}; }
                .bear-donut-2 { background-image: ${DONUT_STAGES[2]}; }
                .bear-donut-3 { background-image: ${DONUT_STAGES[3]}; }
                .bear-donut-4 { background-image: ${DONUT_STAGES[4]}; }
                .bear-donut-5 { background-image: ${DONUT_STAGES[5]}; }

                /* Sparkle Effect - Applied to the donut (which respawns) */
                .bear-donut::after {
                    position: absolute;
                    content: '';
                    width: 40px; height: 40px;
                    --bg: ${SPARKLE_BG};
                    border-image: var(--bg) 5 fill / 20px / 0 stretch;
                    image-rendering: pixelated;
                    animation: bear-sparkle 0.5s forwards;
                    pointer-events: none;
                    top: -10px; left: -10px;
                }
                @keyframes bear-sparkle {
                    0% { width: 40px; height: 40px; transform: translate(16px, 4px); }
                    95% { width: 80px; height: 80px; transform: translate(-2px, -10px); opacity: 1; }
                    100% { opacity: 0; }
                }

                /* Crumbs */
                .bear-crumbs {
                    position: absolute;
                    width: 0; height: 0;
                    --bg: ${CRUMBS_BG};
                    border-image: var(--bg) 2 fill / 4px / 0 stretch;
                    animation: bear-crumbs-spread 1s forwards;
                    pointer-events: none;
                    z-index: 40;
                }
                @keyframes bear-crumbs-spread {
                    0% { width: 0; height: 0; }
                    100% { width: 40px; height: 40px; opacity: 0; }
                }

                .bear-flex-center { display: flex; justify-content: center; align-items: center; }
            `}</style>

            {/* The Bear */}
            <div
                ref={bearRef}
                className={`bear-character bear-object ${isEating ? 'eating' : ''} ${isGrowing ? 'grow' : ''} flex-none`}
                style={{
                    '--w': px(bearSize.w),
                    '--h': px(bearSize.h),
                } as React.CSSProperties}
            >
                <div className="bear-ears">
                    <div className="bear-inner-ears">
                        <div className="bear-ear bear-round"></div>
                        <div className="bear-ear bear-round"></div>
                    </div>
                </div>

                <div className="bear-face">
                    <div className="bear-inner-face">
                        <div className="bear-eye"></div>
                        <div className="bear-nose"></div>
                        <div className="bear-eye"></div>
                    </div>
                    <div className="bear-cheeks">
                        <div className="bear-cheek-wrapper bear-flex-center">
                            <div className="bear-cheek bear-round bear-object"></div>
                        </div>
                        <div className="bear-mouth-wrapper bear-flex-center">
                            <div ref={mouthRef} className="bear-mouth bear-object bear-flex-center"></div>
                        </div>
                        <div className="bear-cheek-wrapper bear-flex-center">
                            <div className="bear-cheek bear-round bear-object"></div>
                        </div>
                    </div>
                </div>

                <div className="bear-limbs">
                    <div className="bear-hands">
                        <div className="bear-hand"></div>
                        <div className="bear-hand flip"></div>
                    </div>
                    <div className="bear-feet">
                        <div className="bear-foot bear-round"></div>
                        <div className="bear-foot bear-round"></div>
                    </div>
                </div>
            </div>

            {/* The Food */}
            {!isGrowing && (
                <div
                    ref={foodRef}
                    className={`bear-food ${foodEatenLevel === 0 ? 'bear-donut' : `bear-donut-${foodEatenLevel}`}`}
                    style={{
                        transform: `translate(${px(dragRef.current.foodPos.x)}, ${px(dragRef.current.foodPos.y)})`
                    }}
                    onPointerDown={handlePointerDown}
                />
            )}

            {/* Crumbs Particles */}
            {crumbs.map(c => (
                <div
                    key={c.id}
                    className="bear-crumbs"
                    style={{
                        left: px(c.x),
                        top: px(c.y)
                    }}
                />
            ))}

            {showMessage && (
                <div className="absolute top-8 text-[#57280f]/80 italic text-lg z-0 pointer-events-none">
                    drag the donut and feed the bear
                </div>
            )}
        </div>
    );
}
