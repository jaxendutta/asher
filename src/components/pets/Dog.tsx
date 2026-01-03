"use client";

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { tiny5 } from '@/lib/fonts';

interface Position {
    x: number;
    y: number;
}

const Dog: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dogRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
    const [isBarkingSpontaneous, setIsBarkingSpontaneous] = useState<boolean>(false);
    const [isBarkingClick, setIsBarkingClick] = useState<boolean>(false);
    const [barkMessage, setBarkMessage] = useState<'woof' | 'bark'>('woof');
    const dogDataRef = useRef<any>(null);
    const isAutoMovingRef = useRef<boolean>(false);
    const barkTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastMouseMoveRef = useRef<number>(Date.now());
    const movementIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const animationFrames = {
        rotate: [[0], [1], [2], [3], [5], [3, 'f'], [2, 'f'], [1, 'f']]
    };

    const directionConversions: Record<number, string> = {
        360: 'up',
        45: 'upright',
        90: 'right',
        135: 'downright',
        180: 'down',
        225: 'downleft',
        270: 'left',
        315: 'upleft',
    };

    const angles = [360, 45, 90, 135, 180, 225, 270, 315];
    const defaultEnd = 4;

    const partPositions = [
        {
            leg1: { x: 26, y: 43 },
            leg2: { x: 54, y: 43 },
            leg3: { x: 26, y: 75 },
            leg4: { x: 54, y: 75 },
            tail: { x: 40, y: 70, z: 1 },
        },
        {
            leg1: { x: 33, y: 56 },
            leg2: { x: 55, y: 56 },
            leg3: { x: 12, y: 72 },
            leg4: { x: 32, y: 74 },
            tail: { x: 20, y: 64, z: 1 },
        },
        {
            leg1: { x: 59, y: 62 },
            leg2: { x: 44, y: 60 },
            leg3: { x: 25, y: 64 },
            leg4: { x: 11, y: 61 },
            tail: { x: 4, y: 44, z: 1 },
        },
        {
            leg1: { x: 39, y: 63 },
            leg2: { x: 60, y: 56 },
            leg3: { x: 12, y: 52 },
            leg4: { x: 28, y: 50 },
            tail: { x: 7, y: 21, z: 0 },
        },
        {
            leg1: { x: 23, y: 54 },
            leg2: { x: 56, y: 54 },
            leg3: { x: 24, y: 25 },
            leg4: { x: 54, y: 25 },
            tail: { x: 38, y: 2, z: 0 },
        },
        {
            leg1: { x: 21, y: 58 },
            leg2: { x: 41, y: 64 },
            leg3: { x: 53, y: 50 },
            leg4: { x: 69, y: 53 },
            tail: { x: 72, y: 22, z: 0 },
        },
        {
            leg1: { x: 22, y: 59 },
            leg2: { x: 30, y: 64 },
            leg3: { x: 56, y: 60 },
            leg4: { x: 68, y: 62 },
            tail: { x: 78, y: 40, z: 0 },
        },
        {
            leg1: { x: 47, y: 45 },
            leg2: { x: 24, y: 53 },
            leg3: { x: 68, y: 68 },
            leg4: { x: 47, y: 73 },
            tail: { x: 65, y: 65, z: 1 },
        },
    ];

    const nearestN = (x: number, n: number) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n);
    const px = (num: number) => `${num}px`;
    const radToDeg = (rad: number) => Math.round(rad * (180 / Math.PI));
    const degToRad = (deg: number) => deg / (180 / Math.PI);

    const overlap = (a: number, b: number) => {
        const buffer = 20;
        return Math.abs(a - b) < buffer;
    };

    const distanceBetween = (a: Position, b: Position) => {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    };

    const rotateCoord = ({ angle, origin, x, y }: { angle: number; origin: Position; x: number; y: number }) => {
        const a = degToRad(angle);
        const aX = x - origin.x;
        const aY = y - origin.y;
        return {
            x: (aX * Math.cos(a)) - (aY * Math.sin(a)) + origin.x,
            y: (aX * Math.sin(a)) + (aY * Math.cos(a)) + origin.y,
        };
    };

    const targetAngle = (dog: any) => {
        if (!dog) return;
        const targetPos = isAutoMovingRef.current ? dog.autoTarget : mousePos;
        const angle = radToDeg(Math.atan2(dog.pos.y - targetPos.y, dog.pos.x - targetPos.x)) - 90;
        const adjustedAngle = angle < 0 ? angle + 360 : angle;
        return nearestN(adjustedAngle, 45);
    };

    const reachedTheGoalYeah = (x: number, y: number) => {
        const targetPos = isAutoMovingRef.current && dogDataRef.current ? dogDataRef.current.autoTarget : mousePos;
        return overlap(targetPos.x, x) && overlap(targetPos.y, y);
    };

    // Check if dog is in viewport and get visible bounds
    const getVisibleBounds = () => {
        if (!containerRef.current) return null;

        const containerRect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate visible portion of container
        const visibleTop = Math.max(0, -containerRect.top);
        const visibleBottom = Math.min(containerRect.height, viewportHeight - containerRect.top);

        return {
            top: visibleTop,
            bottom: visibleBottom,
            left: 0,
            right: containerRect.width,
            height: visibleBottom - visibleTop
        };
    };

    const isDogInViewport = () => {
        if (!dogRef.current || !containerRef.current) return true;

        const dogRect = dogRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Check if dog is visible in viewport
        return dogRect.top < viewportHeight && dogRect.bottom > 0;
    };

    const getRandomTarget = () => {
        if (!containerRef.current) return { x: 0, y: 0 };

        const visibleBounds = getVisibleBounds();
        if (!visibleBounds) return { x: 0, y: 0 };

        const margin = 100;

        // Generate random position within visible viewport area
        return {
            x: Math.random() * (visibleBounds.right - margin * 2) + margin,
            y: Math.random() * (visibleBounds.height - margin * 2) + visibleBounds.top + margin
        };
    };

    const positionLegs = (dog: HTMLDivElement, frame: number) => {
        const legs = dog.querySelectorAll('.leg-wrapper');
        legs.forEach((legWrapper, i) => {
            const legKey = `leg${i + 1}` as 'leg1' | 'leg2' | 'leg3' | 'leg4';
            const { x, y } = partPositions[frame][legKey];
            (legWrapper as HTMLElement).style.transform = `translate(${px(x)}, ${px(y)})`;
        });
    };

    const moveLegs = (dog: HTMLDivElement) => {
        const legs = dog.querySelectorAll('.leg-wrapper');
        [0, 3].forEach(i => {
            const leg = legs[i].querySelector('.leg');
            leg?.classList.add('walk-1');
        });
        [1, 2].forEach(i => {
            const leg = legs[i].querySelector('.leg');
            leg?.classList.add('walk-2');
        });
    };

    const stopLegs = (dog: HTMLDivElement) => {
        const legs = dog.querySelectorAll('.leg');
        legs.forEach(leg => {
            leg.classList.remove('walk-1');
            leg.classList.remove('walk-2');
        });
    };

    const positionTail = (dog: HTMLDivElement, frame: number) => {
        const tailWrapper = dog.querySelector('.tail-wrapper') as HTMLElement;
        const tail = tailWrapper?.querySelector('.tail') as HTMLElement;
        if (tailWrapper && tail) {
            tailWrapper.style.transform = `translate(${px(partPositions[frame].tail.x)}, ${px(partPositions[frame].tail.y)})`;
            tailWrapper.style.zIndex = String(partPositions[frame].tail.z);
            tail.classList.add('wag');
        }
    };

    const animateDog = ({
        target,
        frameW,
        currentFrame,
        end,
        data,
        part,
        speed,
        direction
    }: any) => {
        const offset = direction === 'clockwise' ? 1 : -1;

        target.style.transform = `translateX(${px(data.animation[currentFrame][0] * -frameW)})`;

        if (part === 'body' && dogRef.current) {
            positionLegs(dogRef.current, currentFrame);
            moveLegs(dogRef.current);
            positionTail(dogRef.current, currentFrame);
        } else {
            target.parentElement?.classList.add('happy');
        }

        data.angle = angles[currentFrame];
        data.index = currentFrame;

        if (data.animation[currentFrame][1] === 'f') {
            target.parentElement?.classList.add('flip');
        } else {
            target.parentElement?.classList.remove('flip');
        }

        let nextFrame = currentFrame + offset;
        nextFrame = nextFrame === -1
            ? data.animation.length - 1
            : nextFrame === data.animation.length
                ? 0
                : nextFrame;

        if (currentFrame !== end) {
            data.timer[part] = setTimeout(() => animateDog({
                target, data, part, frameW,
                currentFrame: nextFrame, end, direction,
                speed,
            }), speed || 150);
        } else if (part === 'body') {
            data.walk = true;
            setTimeout(() => {
                if (dogRef.current) stopLegs(dogRef.current);
            }, 200);
            setTimeout(() => {
                document.querySelector('.happy')?.classList.remove('happy');
            }, 5000);
        }
    };

    const triggerDogAnimation = ({
        target,
        frameW,
        start,
        end,
        data,
        speed,
        part,
        direction
    }: any) => {
        if (data.timer[part]) {
            clearTimeout(data.timer[part]);
        }
        data.timer[part] = setTimeout(() => animateDog({
            target, data, part, frameW,
            currentFrame: start, end, direction,
            speed,
        }), speed || 150);
    };

    const getDirection = ({ pos, facing, target }: { pos: Position; facing: Position; target: Position }) => {
        const dx2 = facing.x - pos.x;
        const dy1 = pos.y - target.y;
        const dx1 = target.x - pos.x;
        const dy2 = pos.y - facing.y;
        return dx2 * dy1 > dx1 * dy2 ? 'anti-clockwise' : 'clockwise';
    };

    const turnDog = ({ dog, start, end, direction }: any) => {
        if (!dogRef.current) return;

        const headWrapper = dogRef.current.querySelector('.head-wrapper');
        const head = headWrapper?.querySelector('.head') as HTMLElement;

        if (head) {
            triggerDogAnimation({
                target: head,
                frameW: 31 * 2,
                start, end,
                data: dog,
                speed: 100,
                direction,
                part: 'head'
            });
        }

        setTimeout(() => {
            if (!dogRef.current) return;
            const bodyWrapper = dogRef.current.querySelector('.body-wrapper');
            const body = bodyWrapper?.querySelector('.body') as HTMLElement;

            if (body) {
                triggerDogAnimation({
                    target: body,
                    frameW: 48 * 2,
                    start, end,
                    data: dog,
                    speed: 100,
                    direction,
                    part: 'body'
                });
            }
        }, 200);
    };

    const checkBoundaryAndUpdateDogPos = (x: number, y: number, dog: HTMLDivElement, dogData: any) => {
        const lowerLimit = -40;
        const upperLimit = 40;

        if (containerRef.current) {
            const visibleBounds = getVisibleBounds();
            if (visibleBounds) {
                // Keep dog within visible viewport bounds
                if (x > lowerLimit && x < (visibleBounds.right - upperLimit)) {
                    dogData.pos.x = x + 48;
                    dogData.actualPos.x = x;
                }
                if (y > visibleBounds.top + lowerLimit && y < (visibleBounds.bottom - upperLimit)) {
                    dogData.pos.y = y + 48;
                    dogData.actualPos.y = y;
                }
            }
        }

        dog.style.left = px(x);
        dog.style.top = px(y);
    };

    // Random barking function (like duck quacking)
    const barkSpontaneously = () => {
        setIsBarkingSpontaneous(true);
        setBarkMessage(prev => prev === 'woof' ? 'bark' : 'woof');

        setTimeout(() => {
            setIsBarkingSpontaneous(false);

            // Schedule next bark randomly (3-9 seconds like ducks)
            const nextBarkDelay = Math.random() * 6000 + 3000;
            barkTimerRef.current = setTimeout(barkSpontaneously, nextBarkDelay);
        }, 1000); // Bark displays for 1 second
    };

    // Main movement loop - runs continuously like ducks
    const startMovementLoop = () => {
        if (movementIntervalRef.current) {
            clearInterval(movementIntervalRef.current);
        }

        movementIntervalRef.current = setInterval(() => {
            if (!dogRef.current || !dogDataRef.current || !containerRef.current) return;

            const dogData = dogDataRef.current;
            const { left, top } = dogRef.current.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const dogPos = {
                x: left - containerRect.left + 48,
                y: top - containerRect.top + 48
            };

            // Check if dog is in viewport
            if (!isDogInViewport() && !isAutoMovingRef.current) {
                // Dog is out of viewport, bring it back into view
                isAutoMovingRef.current = true;
                dogData.autoTarget = getRandomTarget();
            }

            // Check if we should start wandering (like ducks)
            const timeSinceLastMove = Date.now() - lastMouseMoveRef.current;
            const distanceToMouse = distanceBetween(dogPos, mousePos);

            // If close to mouse and mouse hasn't moved in 2 seconds, start wandering
            if (distanceToMouse < 80 && timeSinceLastMove > 2000 && !isAutoMovingRef.current) {
                isAutoMovingRef.current = true;
                dogData.autoTarget = getRandomTarget();
            }

            const targetPos = isAutoMovingRef.current ? dogData.autoTarget : mousePos;
            const fullDistance = distanceBetween(dogPos, targetPos);

            // If reached target
            if (fullDistance < 80) {
                // When we reach the target while wandering, pick a new random target in viewport
                if (isAutoMovingRef.current && containerRef.current) {
                    dogData.autoTarget = getRandomTarget();
                    // Fall through to continue moving to new target
                } else {
                    stopLegs(dogRef.current);
                    return;
                }
            }

            // Calculate movement
            let { x, y } = dogData.actualPos;
            const start = angles.indexOf(dogData.angle);
            const end = angles.indexOf(targetAngle(dogData) || 0);
            const targetAngleValue = targetAngle(dogData) || 0;
            const dir = directionConversions[targetAngleValue] || 'down';
            const distance = 30;

            if (dir !== 'up' && dir !== 'down') x += (dir.includes('left')) ? -distance : distance;
            if (dir !== 'left' && dir !== 'right') y += (dir.includes('up')) ? -distance : distance;

            const { x: x2, y: y2 } = rotateCoord({
                angle: dogData.angle,
                origin: dogData.pos,
                x: dogData.pos.x,
                y: dogData.pos.y - 100,
            });
            dogData.facing.x = x2;
            dogData.facing.y = y2;

            if (start === end) {
                dogData.turning = false;
            }

            if (!dogData.turning && dogData.walk) {
                if (start !== end) {
                    dogData.turning = true;
                    const direction = getDirection({
                        pos: dogData.pos,
                        facing: dogData.facing,
                        target: targetPos,
                    });
                    turnDog({
                        dog: dogData,
                        start, end, direction,
                    });
                } else {
                    checkBoundaryAndUpdateDogPos(x, y, dogRef.current, dogData);
                    moveLegs(dogRef.current);
                }
            }
        }, 200);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const dogData = dogDataRef.current;
        if (!dogData || !dogRef.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const newMousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        setMousePos(newMousePos);

        // Update last mouse move time and stop wandering
        lastMouseMoveRef.current = Date.now();
        isAutoMovingRef.current = false;

        dogData.walk = false;
        const direction = getDirection({
            pos: dogData.pos,
            facing: dogData.facing,
            target: newMousePos,
        });
        const start = angles.indexOf(dogData.angle);
        const end = angles.indexOf(targetAngle(dogData) || 0);
        turnDog({
            dog: dogData,
            start, end, direction
        });
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (!containerRef.current) return;

        // Set new target position where user clicked
        const rect = containerRef.current.getBoundingClientRect();
        const clickPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        setMousePos(clickPos);

        // Update interaction time and stop auto-movement
        lastMouseMoveRef.current = Date.now();
        isAutoMovingRef.current = false;
    };

    const handleDogClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        // Trigger bark on click
        setIsBarkingClick(true);
        setBarkMessage(prev => prev === 'woof' ? 'bark' : 'woof');

        // Hide speech after 1 second
        setTimeout(() => {
            setIsBarkingClick(false);
        }, 1000);
    };

    useEffect(() => {
        if (!dogRef.current || !containerRef.current) return;

        const dog = dogRef.current;
        const container = containerRef.current;

        // Center the dog initially
        const centerX = container.clientWidth / 2 - 48;
        const centerY = container.clientHeight / 2 - 48;

        dog.style.left = px(centerX);
        dog.style.top = px(centerY);
        positionLegs(dog, 0);

        const index = 0;
        const dogData = {
            timer: {
                head: null,
                body: null,
                all: null,
            },
            pos: {
                x: centerX + 48,
                y: centerY + 48,
            },
            actualPos: {
                x: centerX,
                y: centerY,
            },
            facing: {
                x: centerX + 48,
                y: centerY + 48 + 30,
            },
            animation: animationFrames.rotate,
            angle: 360,
            index,
            autoTarget: { x: 0, y: 0 }
        };

        dogDataRef.current = dogData;
        turnDog({
            dog: dogData,
            start: index,
            end: defaultEnd,
            direction: 'clockwise'
        });
        positionTail(dog, 0);

        // Initialize mouse position to center
        setMousePos({ x: centerX + 48, y: centerY + 48 });

        // Start continuous movement loop
        startMovementLoop();

        // Start random barking after initial delay (2-6 seconds like ducks)
        const initialBarkDelay = Math.random() * 4000 + 2000;
        barkTimerRef.current = setTimeout(barkSpontaneously, initialBarkDelay);

        return () => {
            if (dogData.timer.head) clearTimeout(dogData.timer.head);
            if (dogData.timer.body) clearTimeout(dogData.timer.body);
            if (movementIntervalRef.current) clearInterval(movementIntervalRef.current);
            if (barkTimerRef.current) clearTimeout(barkTimerRef.current);
        };
    }, []);

    return (
        <>
            <style>{`
        .dog-container {
          height: 100%;
          width: 100%;
          overflow: hidden;
          z-index: 30;
        }
        
        .dog-container .leg {
          position: absolute;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAAXNSR0IArs4c6QAAAElJREFUKFNjZICC/////4exQTQjIyMjmAYR6JIwhSBFjLMiLP6nLj+OrBnOnh1pyTBSFIA8jS0sQGGQtuIEJDhhipBDCyQJ4gMALug8VaRjkWwAAAAASUVORK5CYII=);
          width: 16px;
          height: 24px;
          background-size: 16px 24px;
          background-repeat: no-repeat;
          image-rendering: pixelated;
          transition: 0.15s;
        }
        
        .dog-container .body {
          position: absolute;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAAAwCAYAAACxIqevAAAAAXNSR0IArs4c6QAABSpJREFUeF7tm32a1CAMxqe30pvoAfRQegC9id5qfPBZlGELJOQL2nf/2t0pkPySvA20czzwAwIgAAJBBI6gdbEsCIAACDwgQEgCEACBMAIQoDD0WBgEQAAChBwAARB4fPv04UnF8PXnbzXdUJuIajyuAwEQWINAKTpffvwiG/X988d/10rFCAJExo4LQeA6BJL4cESn5XkSI4kIQYCuk1PwBARIBLTEJy8mESEIEClkuAgErkFAW3ykIgQBukZewQsQIBGAAJEw4SIQAAFtAlbiI+mC0AFpRxnzgcCiBCBAiwYGZvkRGL1vInmi4ufFnitBgPaMG6xWIJCFZ/ToN79jAiFSgF5N8Xw+yS8bzq5+HAdrV8W6eNYojLsvAarw1IQ0X3a7L/1XzyFAyIRbEdBq+dEVydNGKxYjS7jvBKEDGhHF59MEtO+4EKLpUPz9rtdo+zs/+/+RECANiphDTEBbfEqDIoQoFfDZudTZ/3vXZj/quVpjxIF4m+DyAjR6ulGDXPWQkerHqvZrJaxknlWTXepTGl/GPedK/b/0dy0oPYHJn1mK0KoxEW3BZr9NmwK5wiGjxP6czBF3Y0kheYz1SvacRx43g1okzkRjJDo9wcpxsRIhr5i4bcE0HeIaLS2i2SczvXU9faB2aT17LYvWcvt15pMH+1IYer9TOv16PGWMJOc1a5ViByceUx2QhUMcoykQWtdY2F52QxaFbSGYNR/u+xsRfCNvAL1znRzzUQd01uVQx6ya89IbAluAdizgMvDWTwI0hdRDeLSFyDI/RkWoyb5eSypAZdd6dmZkuQXzjgknDrcRIK8gcOD3CsrL3jMbJN1QpN3JF4ntI4Hb9XPvmHBq4BYC5BkADvzVtjHZHkkRe7Ju8ZPYv6vIrHQz49QAS4A8kotjPCVZPGwu7ZDa722vdhGvYL80BmdMemc1nEPl1lYsrdna5lHyHAIkpfQ2XjN5IopBan+EzZrbsBXsl8ZAIkC9s5zRgTMEaCAiHsmllTwetkqfALQS3fqgnHKvmN3GRHHX7EIhQJQMaV/DqWHyFswzsTgOtDB4v4uS7NCw25Nzi53Ujwj2HgJU82o9fm9tp9ABvc84CJBM7F9GSws3J250ByT1I1pEpfZHdUCKqfhuKq+YcNlfUoC8YFvcdSNsr7OVm0QrbiVnt5AtEaAeQvfOgPINJl/j+YVUr7zi5g4ESOm2wwXfS/TdO6CyCCN80YqFUmosMQ0EiBEGaQJ5wc4uSe0t0XjbfhaWnf3RtJ2Rsltcap1bM+zRASmkzgz43rLWiTJy2cKftKZHN6Rt+4jVbp/n95A0Y5GYp5+Z70FCgIQZZJHwkQJk4Y/HlkxSBMIU2HK4hhBpMIcACdNH+7CzLFavrsFiK9k749L0S6MIhCmw9fAZIdJkDgESpI9lt+ApRJoJRcVZfiVhZjsQYTPVtx2vK+Mxsn9mq9WaEwI0ot343EN8yqWlBVu7kQt4du8+ia07jFoEmgVg4QfmpBMgC1Ca0uNsQquwLd/G1bKRHqbXK6mF2pofBTxLHuO0CVxWgKzEMlp8tBMA84FAJIHLCpBFxwbxiUxVrH1FAiwBsijqEqpFgc+c8rfOS7B1uWIJwKdIApcXoAx35hAXT1oiUxNr34EAW4CsuiCL7qcVQOohLjqeO5QAfIwkMCVA2iLkKT6RsLE2CIDAK4FpAcoilKfjvky24nsoSA4QAAFfAiIBKk2lbmvyGGxvfAON1UBgRQJqArSic7AJBEBgbQJ/AOoMmm0ZeBaqAAAAAElFTkSuQmCC);
          width: 576px;
          height: 96px;
          background-size: 576px 96px;
          background-repeat: no-repeat;
          image-rendering: pixelated;
        }
        
        .dog-container .dog {
          position: absolute;
          width: 96px;
          height: 96px;
          animation: fade-in forwards 1s;
          transition: 0.5s;
          cursor: pointer;
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .dog-container .head {
          position: absolute;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALoAAAAgCAYAAACl82LUAAAAAXNSR0IArs4c6QAAA+hJREFUeF7tmtuV1DAMhiddQSdQABS1FACdQFezx4cVR2h1+X1LnJXnaSbjRLfPkhz7eOzP9kACDxwJbNwmbg88bgP6y5dPz++//txG383WWh64BTgF8m8/fz9+fP382LCvBdBdtNmgN0Rqteqymj4NLp1+CwR6rSNrx3tWUjanMVdn9dWqy2r69BJbyw46PgRdOrL8towpbcVox3N5pX0pnwK7/F6u0Wdke0PyqXWydJghuzzT8rdm/0i7e4FtuX8ma1Wgk3M9IwjCEZlXZnMpl8viuhH0FHiCpQYEDjivJlKO9ImU3Rrwcl/kbz7hKQHU2Nii28x7OOiR7TzhIay5oGttg6fAKMdrkGkOtkC3xiIQeLI1+yx/IM6XeqJ2WxOPrh/HESawmcC2PHs2a6pDrJklA21lWBmImqBHWbwmu2r6ebCjstFAjrA78rmlSyTb6m21695Yq2VDe+ezWHsH+uhgczCjjFojuya7IjrUyEZBR9sJS3ZNxaqtYlo7Z12jtRePnwcy/RfBfqbP/wN9luCzQdMWqx50V9pd9JoFemQzB1iDU4Kq/S4yvAngVQOkD69JKnysrGgfHnQKtgwId8qVoEeQR/14BILVwnAAve/y+VpVlvej91wC+uxge1k9q2wkm7eCLquaBBTp0aOMTrpZE4Xs02TPhFxj7V9Gzwrbqna3LkK1iaFl9V7QqZ9vaV2u8PkG/e0cTdQCRP/T+3MvU8nXfl7Ae0H3+tXIltn/b9Ane9jKbCPKqAe6tWt7RcAnuxh6vLcuKQ+oiUfkd2qbUmV0bSPlTNi0Ml8TVIQiHnhvl9rrv2sWl1YLY/Xn5frz+VSPkSBVUfoguodingZ0bwNlFuzRTnGrXCu4vHLwszDRmxIJpda/I9fQxasFujWRNbuQSV/GvAPdm2noQ5Fx1vZ0a9ARmWXMFaCTXNJRA6426PyZ3vGDDfpfry+V0SmjjC7jfBJE5z9mTzTudK7XLLmUBa3daN5yyImIZG+tNUEzemSzthBHr3Hf8uS2zIbRTNijcx/knCgAaPXQxnkTrVeutRNsTa4I0lGge/6qeeNkHYXw3ky5O6MfDbYoq2mBoEw3qrqgOvTKlX17NLnRxShPAlavb7Vm1rt6JLFYfTnSr2u2m6cXizIjgo0GWpbzHvktMiX0PeBZrxORitAjl/fv0QE6RJczxvTaK1uV8luzPTyP3mtsj8PJCXT4CNWlR6aX5RH5I2VrfbSlw0i5iJ2jx1ivKb21BHUgVkXhOt7ugP5oB+/n5fDABj1HnNNbuUFPj0AOB2zQc8Q5vZUb9PQI5HDABj1HnNNbuUFPj0AOB7wCKr30XX1N2MUAAAAASUVORK5CYII=);
          width: 372px;
          height: 64px;
          background-size: 372px 64px;
          image-rendering: pixelated;
        }
        
        .dog-container .head-wrapper.happy > .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALoAAAAgCAYAAACl82LUAAAAAXNSR0IArs4c6QAABCpJREFUeF7tmtlx3DAMQFddxZ0kBSS/Hlfi8W9cQNJJ0tV6qAl2YAgnRVBSyP2yJYq4HkHwWG7zNz0wgAeWAWycJk4P3C4D+s+vX+4/fv+9jL6TrXN54BLgFMi///pze//2dJuwnwugq2gzQa+I1Nlml7PpU+HS9E9coEcdGW2vWQnZHNocndXPNrucTZ+9xEbZ8bY3QaeOLP9LxpSyorXjsbxSvpRfgZ3+XZ7Br2V5A/KhdJJ0yJBd+pT8zdnf0u69wNZ8n8laCHRwrmYEQNgi89JsTuViWVg3gB4CD7BEQMCA49mEyqE+obJrA16+s/yNBzwkgIiNNbplfoNBt2zHCc/Dmgo6VzZoCrRyPAcZ52AJdKmtBwJNNmef5A+P86meXrulgQfPl2UxE1gmsDV9Z7PGOkQaWTTQUoalgYgE3crikezK6afB7pXtDWQLuy2fS7pYsqXalnuutZVKNm/t3Iu1Deitg43BtDJqRHYku3p0iMj2gu4tJyTZkRkrOotx5Zz0DNZeOH4ayPDOgr2nzz+BniW4N2jcYlWD7ki7i15ZoFs2Y4A5OCmo3P9FhjYAtNnAU4dHkgpuS2e0/x50CPa6uHt+vb2/vWwOnY4E3YLcqsctEKQSBgOo/U3752Zl+r33m0NAzw62ltV7yF6z/PPrqgaGvYdsK7NyAa8pzWhGw1uQFFBPjW5ldJAnDRSYrTjZmZBzrD0y+pEB7ymbm2p7Ox0Dou3a7NGLlm+tQYd6vqZ06RlvsHs40LOyC+yfa3DSbT8t4LW7LdFFqVX6ZLyfoGd4FfXJ1autnK6BLp3atpJtuc3aarS+b/1eW5esa6l/J+AeuZbfh8zo3EFKT9h6lE048NoptVZ/RxaXUgkj1efl+f1+Z6+ReGZFCr/1DcR8mNJFy2pZsFsnxbVypeDimUNbiHIQagtKbVFZs7UogS5lcM4uT7YvbTagayPN26mnnXQ8XRt0j0xt1wOCGJkuvTJBLm5P1wjRoOM+PQtZz/YiBZnbkfE88+7SRG1uCno2aBBszfFZsOGRLUGaab+0tZk1yHDG1xIL9QW+BOfZpbHA1rYwI3emYHBzF+isfjY1epbTsTOtRVEWbJZc0DFL/iNQSQdWm5Ng5ryAQu2t0bFvLPglsLnkEtlxgkRRzj+s26NSQj3VXZfWgw0ym3XHBgcCFletZhesgwbCXrmfpvdOoEO8wH/WQOAGm1Z+QXs46FsTxtvLo5vIzVHx9mLprUWwj4CtRiYXhFofSNuJntp+L/C4ho8McI9uGW0se3HZB6Bbg4Oz27yPvte4Pc4GJ8DlI68ue2RK0+wRsvHWnSW/tc2WvNbvrW1KbdaQ3mEdL3dBv7WDZ39jeGCCPkach7dygj48AmM4YII+RpyHt3KCPjwCYzhggj5GnIe3coI+PAJjOOADdCQTbGUe9fwAAAAASUVORK5CYII=);
        }
        
        .dog-container .head-wrapper.happy {
          animation: infinite 0.5s pant;
        }
        
        @keyframes pant {
          0%, 100% { transform: translateY(-1px); }
          50% { transform: translateY(1px); }
        }
        
        .dog-container .head-wrapper.flip.happy {
          animation: infinite 0.5s pant-flip;
        }
        
        @keyframes pant-flip {
          0%, 100% { transform: translateY(-1px) scale(-1, 1); }
          50% { transform: translateY(1px) scale(-1, 1); }
        }
        
        .dog-container .tail {
          position: absolute;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAADZJREFUKFNjZICCWREW/2FsEJ224gQjiAYTIMnU5ceR5RlmR1qCFTFik4SpBCmihwKCjiTkTQB1sCqti9mJ/QAAAABJRU5ErkJggg==);
          width: 16px;
          height: 16px;
          background-size: 16px;
          background-repeat: no-repeat;
          image-rendering: pixelated;
        }
        
        .dog-container .tail-wrapper {
          position: absolute;
          width: 16px;
          height: 16px;
          transition: 0.15s;
        }
        
        .dog-container .body-wrapper {
          position: absolute;
          width: 96px;
          height: 96px;
          overflow: hidden;
        }
        
        .dog-container .body-wrapper,
        .dog-container .head-wrapper {
          z-index: 1;
        }
        
        .dog-container .walk-1 {
          animation: infinite 0.4s walking;
          animation-delay: 0s;
        }
        
        .dog-container .walk-2 {
          animation: infinite 0.4s walking;
          animation-delay: 0.2s;
        }
        
        @keyframes walking {
          0%, 100% { transform: translateY(-4px); }
          50% { transform: translateY(0); }
        }
        
        .dog-container .wag {
          animation: infinite 0.5s wag;
        }
        
        @keyframes wag {
          0%, 100% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
        }
        
        .dog-container .head-wrapper {
          position: absolute;
          top: 6px;
          left: 16px;
          width: 62px;
          height: 64px;
          overflow: hidden;
        }
        
        .dog-container .flip {
          transform: scale(-1, 1);
        }
        
        .dog-container .leg-wrapper {
          position: absolute;
          width: 16px;
          height: 24px;
          transition: 0.15s;
        }
        
        .dog-speech-anchor {
          position: absolute;
          left: 50%;
          top: -4px;
          transform: translateX(-50%);
          width: 0px;
          height: 0px;
          display: flex;
          justify-content: center;
          align-items: end;
          z-index: 999;
        }

        .dog-speech-bubble {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #FFF;
          padding: 2px 10px;
          border: 1px dashed #000;
          border-radius: 8px;
          font-size: 16px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          z-index: 999;
        }

        .dog-speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px dashed transparent;
          border-right: 6px dashed transparent;
          border-top: 6px dashed #000;
        }

        .dog-speech-bubble::before {
          content: '';
          position: absolute;
          bottom: -4.5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px dashed transparent;
          border-right: 5px dashed transparent;
          border-top: 5px dashed #FFF;
          z-index: 1;
        }

        .dog.bark .dog-speech-bubble {
          opacity: 1;
          animation: fade-in-dog 0.2s;
        }

        @keyframes fade-in-dog {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(3px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
            <div
                ref={containerRef}
                className="dog-container"
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            >
                <div
                    ref={dogRef}
                    className={`dog ${isBarkingSpontaneous || isBarkingClick ? 'bark' : ''}`}
                    onClick={handleDogClick}
                >
                    <div className="dog-speech-anchor">
                        <div className={`dog-speech-bubble ${tiny5.className}`}>{barkMessage}</div>
                    </div>
                    <div className="body-wrapper">
                        <div className="body"></div>
                    </div>
                    <div className="head-wrapper">
                        <div className="head"></div>
                    </div>
                    <div className="leg-wrapper">
                        <div className="leg one"></div>
                    </div>
                    <div className="leg-wrapper">
                        <div className="leg two"></div>
                    </div>
                    <div className="leg-wrapper">
                        <div className="leg three"></div>
                    </div>
                    <div className="leg-wrapper">
                        <div className="leg four"></div>
                    </div>
                    <div className="tail-wrapper">
                        <div className="tail"></div>
                    </div>
                </div>
                <Image
                    src="/images/objects/dog_bone.svg"
                    alt="Dog Bone"
                    width={50}
                    height={50}
                    style={{ imageRendering: 'pixelated' }}
                    className="absolute bottom-6 right-6 pointer-events-none select-none -z-10"
                />
            </div>
        </>
    );
};

export default Dog;
