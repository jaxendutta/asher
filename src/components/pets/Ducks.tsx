"use client";

import React, { useEffect, useRef, useState } from 'react';
import { micro_5, tiny5 } from '@/lib/fonts';

interface Position {
  x: number;
  y: number;
}

interface Duck {
  x: number;
  y: number;
  angle: number;
  direction: string;
  offset: Position;
  hit?: boolean;
  isQuacking?: boolean;
}

interface DucklingTarget {
  x: number;
  y: number;
  timer: NodeJS.Timeout | null;
  offset: number;
}

const directionConversions: Record<number, string> = {
  360: 'up',
  45: 'up right',
  90: 'right',
  135: 'down right',
  180: 'down',
  225: 'down left',
  270: 'left',
  315: 'up left',
};

const px = (num: number) => `${num}px`;
const radToDeg = (rad: number) => Math.round(rad * (180 / Math.PI));
const degToRad = (deg: number) => deg / (180 / Math.PI);
const nearestN = (x: number, n: number) => (x === 0 ? 0 : x - 1 + Math.abs(((x - 1) % n) - n));
const randomN = (max: number) => Math.ceil(Math.random() * max);
const overlap = (a: number, b: number, buffer: number = 20) => Math.abs(a - b) < buffer;

const Ducks: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const motherDuckRef = useRef<HTMLDivElement>(null);
  const [ducklings, setDucklings] = useState<Duck[]>([]);
  const [motherDuck, setMotherDuck] = useState<Duck>({
    x: 0,
    y: 0,
    angle: 0,
    direction: 'down',
    offset: { x: 20, y: 14 },
    isQuacking: false,
  });

  const cursorRef = useRef<Position>({ x: 0, y: 0 });
  const targetRef = useRef<Position>({ x: 0, y: 0 });
  const newTargetRef = useRef<Position>({ x: 0, y: 0 });
  const ducklingTargetsRef = useRef<DucklingTarget[]>([]);
  const duckDirectionRef = useRef('down');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wanderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const quackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isWanderingRef = useRef(false);
  const lastMouseMoveRef = useRef<number>(Date.now());

  const offsetPosition = (duck: Duck): Position => ({
    x: duck.x + duck.offset.x,
    y: duck.y + duck.offset.y,
  });

  const checkCollision = (a: Position, b: Position, buffer: number = 40): boolean => {
    return overlap(a.x, b.x, buffer) && overlap(a.y, b.y, buffer);
  };

  const elAngle = (el: Position, pos: Position): number => {
    const { x, y } = pos;
    const angle = radToDeg(Math.atan2(el.y - y, el.x - x)) - 90;
    const adjustedAngle = angle < 0 ? angle + 360 : angle;
    return nearestN(adjustedAngle, 1);
  };

  const rotateCoord = (deg: number, x: number, y: number, offset: Position): Position => {
    const rad = degToRad(deg);
    const nX = x - offset.x;
    const nY = y - offset.y;
    const nSin = Math.sin(rad);
    const nCos = Math.cos(rad);
    return {
      x: Math.round(nCos * nX - nSin * nY + offset.x),
      y: Math.round(nSin * nX + nCos * nY + offset.y),
    };
  };

  const distanceBetween = (a: Position, b: Position): number =>
    Math.round(Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)));

  const getOffsetPos = (x: number, y: number, distance: number, angle: number): Position => ({
    x: x + distance * Math.cos(degToRad(angle - 90)),
    y: y + distance * Math.sin(degToRad(angle - 90)),
  });

  const getNewPosBasedOnTarget = (
    start: Position,
    target: Position,
    distance: number,
    fullDistance: number
  ): Position => {
    const remainingD = fullDistance - distance;
    return {
      x: Math.round((remainingD * start.x + distance * target.x) / fullDistance),
      y: Math.round((remainingD * start.y + distance * target.y) / fullDistance),
    };
  };

  const getDirection = (pos: Position, facing: Position, target: Position): string => {
    const dx2 = facing.x - pos.x;
    const dy1 = pos.y - target.y;
    const dx1 = target.x - pos.x;
    const dy2 = pos.y - facing.y;
    return dx2 * dy1 > dx1 * dy2 ? 'anti-clockwise' : 'clockwise';
  };

  const returnAngleDiff = (angleA: number, angleB: number): number => {
    const diff1 = Math.abs(angleA - angleB);
    const diff2 = 360 - diff1;
    return diff1 > diff2 ? diff2 : diff1;
  };

  const getDirectionClass = (angle: number): string => {
    return directionConversions[nearestN(angle, 45)];
  };

  const updateCursorPos = (e: MouseEvent) => {
    cursorRef.current = { x: e.pageX, y: e.pageY };
    lastMouseMoveRef.current = Date.now();
    isWanderingRef.current = false;
    if (wanderTimeoutRef.current) {
      clearTimeout(wanderTimeoutRef.current);
      wanderTimeoutRef.current = null;
    }
  };

  // Quack function for mother duck
  const quack = () => {
    setMotherDuck(prev => ({ ...prev, isQuacking: true }));
    
    setTimeout(() => {
      setMotherDuck(prev => ({ ...prev, isQuacking: false }));
      
      // Schedule next quack randomly
      const nextQuackDelay = Math.random() * 6000 + 3000; // 3-9 seconds
      quackTimerRef.current = setTimeout(quack, nextQuackDelay);
    }, 1000); // Quack displays for 1 second
  };

  const createDuckling = () => {
    const index = ducklings.length;
    setDucklings((prev) => [
      ...prev,
      {
        x: -100 - (index * 20),
        y: -100 - (index * 20),
        angle: 0,
        direction: 'down',
        offset: { x: 10, y: 7 },
        hit: false,
      },
    ]);
    ducklingTargetsRef.current.push({ x: 0, y: 0, timer: null, offset: 6 });
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => updateCursorPos(e);
    const handleMove = (e: MouseEvent) => updateCursorPos(e);

    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMove);

    // Initialize cursor to center of screen so duck moves there from 0,0
    if (wrapperRef.current) {
      const { width, height } = wrapperRef.current.getBoundingClientRect();
      cursorRef.current = { x: width / 2, y: height / 2 };
    }

    // Create initial ducklings starting behind the mother duck
    const initialDucklings: Duck[] = [];
    for (let i = 0; i < 3; i++) {
      initialDucklings.push({
        x: -50 - (i * 40),
        y: -50 - (i * 40),
        angle: 0,
        direction: 'down',
        offset: { x: 10, y: 7 },
        hit: false,
      });
      ducklingTargetsRef.current.push({ x: 0, y: 0, timer: null, offset: 6 });
    }
    setDucklings(initialDucklings);

    // Start quacking after initial delay
    const initialQuackDelay = Math.random() * 4000 + 2000;
    quackTimerRef.current = setTimeout(quack, initialQuackDelay);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMove);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (wanderTimeoutRef.current) clearTimeout(wanderTimeoutRef.current);
      if (quackTimerRef.current) clearTimeout(quackTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const moveDucklingTargets = (x: number, y: number, angle: number) => {
      ducklingTargetsRef.current.forEach((duckling, i) => {
        if (duckling.timer) clearTimeout(duckling.timer);
        duckling.timer = setTimeout(() => {
          const pos = getOffsetPos(x, y, 60 + 80 * i, angle + 180);
          duckling.x = pos.x;
          duckling.y = pos.y;
        }, 20 + randomN(20));
      });
    };

    const triggerDuckMovement = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setMotherDuck((prevDuck) => {
          const duckPos = offsetPosition(prevDuck);

          // Check if we should start wandering
          const timeSinceLastMove = Date.now() - lastMouseMoveRef.current;
          const fullDistanceToCursor = distanceBetween(duckPos, cursorRef.current);

          // If close to cursor and mouse hasn't moved in 2 seconds, start wandering
          if (fullDistanceToCursor < 80 && timeSinceLastMove > 2000 && !isWanderingRef.current) {
            isWanderingRef.current = true;
            // Generate a random target within viewport
            if (wrapperRef.current) {
              const { width, height } = wrapperRef.current.getBoundingClientRect();
              cursorRef.current = {
                x: Math.random() * (width - 100) + 50,
                y: Math.random() * (height - 100) + 50,
              };
            }
          }

          const fullDistance = distanceBetween(duckPos, cursorRef.current);

          if (!fullDistance || fullDistance < 80) {
            // When we reach the target while wandering, pick a new random target
            if (isWanderingRef.current && wrapperRef.current) {
              const { width, height } = wrapperRef.current.getBoundingClientRect();
              cursorRef.current = {
                x: Math.random() * (width - 100) + 50,
                y: Math.random() * (height - 100) + 50,
              };
              // Fall through to continue moving to new target
            } else {
              return { ...prevDuck, direction: prevDuck.direction.replace(' waddle', '') };
            }
          }

          // Recalculate distance in case we just set a new wander target
          const actualDistance = distanceBetween(duckPos, cursorRef.current);
          const distanceToMove = actualDistance > 80 ? 80 : actualDistance;
          const newTarget = getNewPosBasedOnTarget(duckPos, cursorRef.current, distanceToMove, actualDistance);
          newTargetRef.current = newTarget;
          duckDirectionRef.current = getDirection(duckPos, targetRef.current, newTarget);

          const howMuchMotherDuckNeedsToTurn = returnAngleDiff(
            elAngle(duckPos, targetRef.current),
            elAngle(duckPos, newTarget)
          );
          const maxAngleMotherDuckCanTurn = 60;

          let newDuck: Duck;

          if (howMuchMotherDuckNeedsToTurn > maxAngleMotherDuckCanTurn) {
            const diff = howMuchMotherDuckNeedsToTurn > maxAngleMotherDuckCanTurn
              ? maxAngleMotherDuckCanTurn
              : howMuchMotherDuckNeedsToTurn;

            const rotatedPos = rotateCoord(
              duckDirectionRef.current === 'clockwise' ? diff : -diff,
              targetRef.current.x,
              targetRef.current.y,
              duckPos
            );

            const angle = elAngle(duckPos, rotatedPos);
            const movePos = getOffsetPos(prevDuck.x, prevDuck.y, 50, angle);
            targetRef.current = getOffsetPos(movePos.x, movePos.y, 100, angle);

            const newAngle = elAngle(offsetPosition({ ...prevDuck, ...movePos }), targetRef.current);
            const direction = getDirectionClass(newAngle);

            newDuck = {
              ...prevDuck,
              x: movePos.x,
              y: movePos.y,
              angle: newAngle,
              direction: direction + ' waddle',
            };
          } else {
            const angle = elAngle(duckPos, newTarget);
            const direction = getDirectionClass(angle);
            targetRef.current = getOffsetPos(newTarget.x, newTarget.y, 50, angle);

            newDuck = {
              ...prevDuck,
              x: newTarget.x - prevDuck.offset.x,
              y: newTarget.y - prevDuck.offset.y,
              angle,
              direction: direction + ' waddle',
            };
          }

          moveDucklingTargets(newDuck.x, newDuck.y, newDuck.angle);
          return newDuck;
        });
      }, 500);
    };

    triggerDuckMovement();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (wanderTimeoutRef.current) clearTimeout(wanderTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const moveDucklingsInterval = setInterval(() => {
      setDucklings((prevDucklings) =>
        prevDucklings.map((duckling, i) => {
          // Check collision first with current mother duck state
          if (!duckling.hit && checkCollision(motherDuck, duckling, 40)) {
            const direction = duckling.direction.replace(' waddle', '');
            const x = direction.includes('right') ? -20 : direction.includes('left') ? 20 : 0;
            const y = direction.includes('up') ? 20 : direction.includes('down') ? -20 : 0;

            setTimeout(() => {
              setDucklings((prev) =>
                prev.map((d, idx) => (idx === i ? { ...d, hit: false } : d))
              );
            }, 900);

            return {
              ...duckling,
              x: duckling.x + x,
              y: duckling.y + y,
              hit: true,
            };
          }

          if (duckling.hit) return duckling;

          const target = ducklingTargetsRef.current[i];
          if (!target) return duckling;

          const fullDistance = distanceBetween(duckling, target);

          if (!fullDistance || fullDistance < 40) {
            return { ...duckling, direction: duckling.direction.replace(' waddle', '') };
          }

          const newPos = getNewPosBasedOnTarget(duckling, target, 30, fullDistance);
          const angle = elAngle(offsetPosition(duckling), target);
          const direction = getDirectionClass(angle);

          return {
            ...duckling,
            x: newPos.x,
            y: newPos.y,
            direction: direction + ' waddle',
          };
        })
      );
    }, 150);

    return () => {
      clearInterval(moveDucklingsInterval);
    };
  }, [motherDuck]);

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
        }
        .duck-wrapper {
          position: fixed;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        .duck *,
        .duckling * {
          background-size: calc(var(--w) * var(--m)) calc(var(--h) * var(--m)) !important;
          background-repeat: no-repeat !important;
          image-rendering: pixelated;
        }
        .duck,
        .duckling {
          position: absolute;
          transition: 1s;
          --w: 20;
          --h: 14;
          --m: 2px;
          --neck-w: 16;
          width: calc(var(--w) * var(--m));
          height: calc(var(--h) * var(--m));
          --color: #fff;
          --dark-yellow: #fcc85b;
        }
        .body {
          position: absolute;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAAAXNSR0IArs4c6QAAAFRJREFUOE9jZMAC/v///x+bOLoYIyMjI4YYsgCxBuEzGG4DuYbBDIe5FmwgpYYhG0p9A6nlOrgrR6CBgz+WYbFDaeSgJGxKDUXO0xiZm5QwxVY4AADV9Tf/s/CuJAAAAABJRU5ErkJggg==);
          width: calc(var(--w) * var(--m));
          height: calc(var(--h) * var(--m));
        }
        .tail {
          position: absolute;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAAXNSR0IArs4c6QAAAC1JREFUGFdjZICC/////wcxGRkZGcE0iIAJwhSBJHFLoKuG68IpgdcOZEmYvQA6WRwAeFIlLwAAAABJRU5ErkJggg==);
          --w: 6;
          --h: 7;
          --x: calc(7 * var(--m));
          --y: calc(-2 * var(--m));
          width: calc(var(--w) * var(--m));
          height: calc(var(--h) * var(--m));
          transform: translate(var(--x), var(--y));
          transition: 1s;
          z-index: -10;
        }
        .up .tail {
          --y: calc(-2 * var(--m));
        }
        .right .tail {
          --x: calc(-2 * var(--m));
        }
        .down .tail {
          --y: calc(-4 * var(--m));
        }
        .left .tail {
          --x: calc(15 * var(--m));
        }
        .neck {
          position: absolute;
          background-color: var(--color);
          width: calc(var(--neck-w) * 1px);
          height: calc(8 * var(--m));
          transition: 0.8s;
          bottom: 0;
        }
        .neck-base {
          position: absolute;
          width: calc(8 * var(--m));
          height: calc(8 * var(--m));
          --x: calc(6 * var(--m));
          --y: calc(2 * var(--m));
          transform: translate(var(--x), var(--y));
          transition: 0.3s;
          z-index: 2;
        }
        .up .neck-base {
          --y: calc(2 * var(--m));
        }
        .right .neck-base {
          --x: calc(10 * var(--m));
        }
        .down .neck-base {
          --y: calc(3 * var(--m));
        }
        .left .neck-base {
          --x: calc(2 * var(--m));
        }
        .head {
          position: absolute;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAF9JREFUOE/t1EsKACAIBUDf/Q9tRBhmf7FdLQPHUgsUvBDs0RRkZl4lAzCM7TZ3kE1i4Qa8xQTXaAW9mEU/6J9Kacy7GuazeTs9HBu57C26HGxdwR18/PT8bSmR4b9NAm06MBHW1BzVAAAAAElFTkSuQmCC);
          --w: 20;
          --h: 16;
          width: calc(var(--w) * var(--m));
          height: calc(var(--h) * var(--m));
          margin-top: calc(var(--h) * -2px + 4px);
          margin-left: calc(((var(--w) * 2) - var(--neck-w)) * -0.5px);
        }
        .down.left .head,
        .down.right .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAIRJREFUOE9jZKAyYKSyeQw4Dfz///9/fJYxMjJi1YshSMggdEvQDUYxkFTDYIYjGwo3kFzD0A0dYgZmmUowTDv9Amfk4pOHhSOKl6luICWJHMOFf05EYU3IzOZLCdqDkWxwGQYzCZ+hGAmbkGG4DMWb9QgZymKxjOhCBK4Ql6GkGAbyDQD+hEQRv/jlIAAAAABJRU5ErkJggg==);
        }
        .up.left .head,
        .up.right .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAIFJREFUOE9jZICCPyei/sPYyDSLxTJGbOK4xMCKcRkG00SKoYzYDGM2X0rQUYyMjFhdjuFCYgxDtg3dYLgtIJeSahjMYGRD4Qb+//8fa6QQ9DtUAczQUQOJDTFMdbQPQ5Cd5MY01mQD8wSphuJM2OihQshgvFmP/KjAEjnUNAxkFgC13zgRXycP6gAAAABJRU5ErkJggg==);
        }
        .down .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAJZJREFUOE9jZKAyYKSyeQw4Dfz///9/fJYxMjJi1YshSMggdEvQDUYxkFTDYIYjGwo3kFzD0A0dogZmmUowTDv9Am+KQlcDC0esXqa6geQkdgwXggxBj+m/J6Oxms1svhRFHGuygamAGYrLMJg6mKF4EzZM8Z8TUXizHUwdi8UyjJyGMy8TMhSbYSCL8JY2uAzFZRjIQAA6bUoRLru2rQAAAABJRU5ErkJggg==);
        }
        .up .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAIFJREFUOE/t01EOgCAIBmBZ3anOUuers9SdajgfcGr8NNl6yzfH/BBBCsa6joW18DjvhI7BAMIEQqgKJmyYNuvy4T7XoKEPkJnVMmGJRJVRbXoxSUIFmkEv1qI/aE6KGZTGfPeGKb230+rYSD29aIklA/7lN7iF8jz626CfhDf0Joo7dzsRfj//OAAAAABJRU5ErkJggg==);
        }
        .left .head,
        .right .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAIBJREFUOE9jZKAyYKSyeQw4Dfz///9/fJYxMjJi1YshSMggdEvQDUYxkFTDYIYjGwo3kFzD0A0dOAOzTCUYpp1+gTOeYN4m2oUkG/jnRBTWZMJsvpSopIriQlyGwUwixlC4gYQMI8ZQjGRDyFB8LsSZsEkNQ6KzHlExgEcR1UsbAK27NhEDLz+RAAAAAElFTkSuQmCC);
        }
        .right .head {
          transform: scale(-1, 1);
        }
        .legs {
          position: absolute;
          display: flex;
          justify-content: space-between;
          width: calc(12 * var(--m));
          height: calc(7 * var(--m));
          left: calc(4 * var(--m));
          bottom: calc(-4 * var(--m));
          transition: 1s;
          z-index: -1;
          --angle: 180deg;
        }
        .leg {
          position: relative;
          background-color: var(--dark-yellow);
          width: var(--m);
          height: calc(7 * var(--m));
        }
        .leg:after {
          position: absolute;
          background-color: var(--dark-yellow);
          content: '';
          width: 4px;
          height: 7px;
          left: -1px;
          bottom: 0px;
          transform-origin: bottom center;
          transform: rotate(var(--angle));
        }
        .up .legs {
          --angle: 0deg;
        }
        .up.right .legs {
          --angle: 45deg;
        }
        .right .legs {
          --angle: 90deg;
        }
        .down.right .legs {
          --angle: 135deg;
        }
        .down .legs {
          --angle: 180deg;
        }
        .down.left .legs {
          --angle: 225deg;
        }
        .left .legs {
          --angle: 270deg;
        }
        .up.left .legs {
          --angle: 315deg;
        }
        .waddle .leg {
          animation: waddle 0.3s infinite;
        }
        .leg:nth-child(1) {
          --one: calc(7 * var(--m));
          --two: calc(4 * var(--m));
        }
        .leg:nth-child(2) {
          --one: calc(4 * var(--m));
          --two: calc(7 * var(--m));
        }
        @keyframes waddle {
          0%,
          100% {
            height: var(--one);
          }
          50% {
            height: var(--two);
          }
        }
        .left .legs,
        .right .legs {
          width: calc(10 * var(--m));
          left: calc(5 * var(--m));
        }

        /* Duck speech bubble */
        .duck-speech-anchor {
          position: absolute;
          left: 50%;
          top: -30px;
          transform: translateX(-50%);
          width: 0px;
          height: 0px;
          display: flex;
          justify-content: center;
          align-items: end;
          z-index: 999;
        }

        .duck-speech-bubble {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #FFF;
          padding: 4px 10px;
          border: 1px dashed #000;
          border-radius: 8px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          z-index: 999;
        }

        .duck-speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px dashed transparent;
          border-right: 5px dashed transparent;
          border-top: 6px solid #FFF;
        }

        .duck-speech-bubble::before {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px dashed transparent;
          border-right: 4px dashed transparent;
          border-top: 4px solid #FFF;
          z-index: 1;
        }

        .duck.quack .duck-speech-bubble {
          opacity: 1;
          animation: fade-in-duck 0.2s;
        }

        @keyframes fade-in-duck {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(3px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .duckling {
          --neck-w: 8;
          --m: 1px;
          --color: #fff04d;
          transition: 0.5s;
        }
        .duckling .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAGFJREFUOE9jZKAyYKSyeQw4Dfz/wfc/PssYBTZj1YshSMggdEvQDUYxkFTDYIYjGwo3kFzD0A0dNZD8VAmLGNqFIcht5MY01mQD8yyphuJN2MghSMhgorMe+dEC0Un10gYAfowwEW4KJvUAAAAASUVORK5CYII=);
          margin-left: calc((var(--w) - var(--neck-w)) * -0.5px);
          margin-top: calc(var(--h) * -1px + 2px);
        }
        .duckling.down.left .head,
        .duckling.down.right .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAIVJREFUOE9jZKAyYKSyeQw4Dfz/wfc/PssYBTZj1YshSMggdEvQDUYxkFTDYIYjGwo3kFzD0A2lrYFZLqfAFk7bY4Y1PvDJw7yN4sLBbyAliRzDy39ORGFNyMwanwnag5FscBkGMwmfoRgJm5BhuAzFm/UIGcpisYzoQgSuEJehpBgG8g0Az0pNESONMLcAAAAASUVORK5CYII=);
        }
        .duckling.up.left .head,
        .duckling.up.right .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAIFJREFUOE9jZICCPyei/sPYyDSLxTJGbOK4xMCKcRkG00SKoYzYDGPW+EzQUYwCm7G6HMOFxBiGbBu6wXBbQC4l1TCYwciGwg38/8EXa6QQ9DtUAczQUQOJDTFMdbQPQ5Cd5MY01mQD8wSphuJM2OihQshgvFmP/KjAEjnUNAxkFgDi4TsRTK7K8AAAAABJRU5ErkJggg==);
        }
        .duckling.down .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAJdJREFUOE9jZKAyYKSyeQw4Dfz/wfc/PssYBTZj1YshSMggdEvQDUYxkFTDYIYjGwo3kFzD0A2lj4FZLqfAFk/bY4Y1XrDJw7yN1YWD30ByEjuGl0GGoMf03xu8WM1m1viMIo412cBUwAzFZRhMHcxQvAkbpvjPiSi82Q6mjsViGUZOw5mXCRmKzTCQRXhLG1yG4jIMZCAAfBdQEXRmcAUAAAAASUVORK5CYII=);
        }
        .duckling.up .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAIRJREFUOE9jZMAD/pyI+o9NmsViGSMubTglcBkGMwiXoVgNBBnGrPEZn+MZ/t7gZcBmKIaB/z/4YvUmTi8KbEYxA4VDqmEwSxiRDIUbSK5h6IaOGog3peCVhEUM7cIQZD25MY012cD8Q6qhyIaBzMCZlwkZjG4QPD2SHw3YdeJ0IbkWAQBsyTsRjEgDjwAAAABJRU5ErkJggg==);
        }
        .duckling.left .head,
        .duckling.right .head {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAH9JREFUOE9jZKAyYKSyeQw4Dfz/wfc/PssYBTZj1YshSMggdEvQDUYxkFTDYIYjGwo3kFzD0A0l2sAsl1NgvdP2mGENWpgrh5CBf05EYU0mzBqfiUqqKF7GZRjMJGIMhRtIyDBiDMVINoQMxedCnAmb1DAkOusRFQN4FFG9tAEAKQA+EfjQv5MAAAAASUVORK5CYII=);
        }
        .duckling .body {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAAAXNSR0IArs4c6QAAAFRJREFUOE9jZMAC/n/w/Y9NHF2MUWAzI4YYsgCxBuEzGG4DuYbBDIe5FmwgpYYhG0p9A6nlOrgrR6CBgz+WYbFDaeSgJGxKDUXO0xiZm5QwxVY4AADr4DT71oa+KgAAAABJRU5ErkJggg==);
        }
        .duckling .tail {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAAXNSR0IArs4c6QAAAC1JREFUGFdjZICC/x98/4OYjAKbGcE0iIAJwhSBJHFLoKuG68IpgdcOZEmYqwCKgxp+Dp/FvAAAAABJRU5ErkJggg==);
        }
        .duckling.waddle .leg {
          animation: waddle 0.2s infinite;
        }
        .duckling .leg:after {
          height: 3px;
          width: 2px;
          left: 0;
          bottom: 0px;
        }
        .duckling.hit .waddle {
          animation: waddle 0.1s infinite;
        }
        button.create-duckling {
          position: fixed;
          bottom: 20px;
          right: 20px;
          --size: 60px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAAbpJREFUaEPtmMGNwjAQRYmgAMqgASQK4LoVbAdbEB1QAVcKQNpmVnteiVWQgqLgeP54bGdkPteMx//Nn4xjutWb/bo3410RuHXH6TAdbqwCbOnGDH3BocN0uLEKsKUbM5RDiy2NtvT95+Mei+22F5fFVIuSQKdF8AauAtbCDvCeoGHgVFhv0NmAv47fD7bTdR98tb24TOC5ySu1dC2HBx2pHQM7/Hf7DB5D690vdJKlCpwmrwI8BzuIQaDHwBbRlrW9XtFhCRaBDsGmTu/iwL0wCRpx+FHd7aWbzgJtq1cBjkGjsLk+Q6sBzw0PaGIJQRqXFwGWjihNEUKw1vyxAopDKyTeKkgaWNb8WYGtYqy3qeotTWDNCxuI1QysfjkdVhbc5dCKMVR3eNxWyuK+hGvbeZGWHlRbh1cK7KLAFqdTYa0dBd2WkE1Qt5cEfX7sIEBSTH+b2hzO0QGIxEj75HieNKWnGyMwSEwOICkHgaUKjZ+P/xiYa2kkRrOnNdbkMAKDxFghNOtNwJqNvMQS2IsTpXTQ4VKV9ZKXDntxopQOOlyqsl7y0mEvTpTSQYdLVdZLXjrsxYlSOv4BWdLiPeCnzDQAAAAASUVORK5CYII=);
          width: var(--size);
          height: var(--size);
          border-width: 0;
          background-color: rgb(2, 117, 115);
          background-size: var(--size) !important;
          background-repeat: no-repeat !important;
          border-radius: 50%;
          image-rendering: pixelated;
          cursor: pointer;
          z-index: 100;
        }
        button.create-duckling:hover {
          border: 2px solid white;
          width: calc(var(--size) + 2px);
          height: calc(var(--size) + 2px);
        }
      `}</style>

      <div className="duck-wrapper" ref={wrapperRef}>
        <div
          className={`duck ${motherDuck.direction} ${motherDuck.isQuacking ? 'quack' : ''}`}
          ref={motherDuckRef}
          style={{
            transform: `translate(${px(motherDuck.x)}, ${px(motherDuck.y)})`,
            zIndex: motherDuck.y,
          }}
        >
          <div className="duck-speech-anchor">
            <div className={`duck-speech-bubble ${tiny5.className}`}>quack</div>
          </div>
          <div className="neck-base">
            <div className="neck">
              <div className="head"></div>
            </div>
          </div>
          <div className="tail"></div>
          <div className="body"></div>
          <div className="legs">
            <div className="leg"></div>
            <div className="leg"></div>
          </div>
        </div>

        {ducklings.map((duckling, index) => (
          <div
            key={index}
            className={`duckling ${duckling.direction} ${duckling.hit ? 'hit' : ''}`}
            style={{
              transform: `translate(${px(duckling.x)}, ${px(duckling.y)})`,
              zIndex: duckling.y,
            }}
          >
            <div className="neck-base">
              <div className="neck">
                <div className="head"></div>
              </div>
            </div>
            <div className="tail"></div>
            <div className="body"></div>
            <div className="legs">
              <div className="leg"></div>
              <div className="leg"></div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="create-duckling"
        onClick={createDuckling}
      ></button>
    </>
  );
};

export default Ducks;
