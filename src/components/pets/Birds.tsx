"use client";

import React, { useEffect, useRef, useState, createContext, useContext } from 'react';

interface BirdBranchContextType {
    registerBranch: (id: string, element: HTMLElement) => void;
    unregisterBranch: (id: string) => void;
}

const BirdBranchContext = createContext<BirdBranchContextType | null>(null);

interface BirdBranchProps {
    id: string;
    className?: string;
    size?: 's' | 'm';
}

export function BirdBranch({ id, className = '', size = 'm' }: BirdBranchProps) {
    const ref = useRef<HTMLDivElement>(null);
    const context = useContext(BirdBranchContext);

    useEffect(() => {
        if (ref.current && context) {
            context.registerBranch(id, ref.current);
            return () => context.unregisterBranch(id);
        }
    }, [id, context]);

    return (
        <div
            ref={ref}
            className={`bird-perch box ${size} ${className}`}
        />
    );
}

interface BirdsProps {
    birdCount?: number;
    children: React.ReactNode;
}

interface BirdState {
    id: number;
    pos: { x: number; y: number };
    dirClasses: string[];
    isFlying: boolean;
    isHopping: boolean;
    isTweeting: boolean;
    hopCount: number;
    zone: number;
    twitchPos: number;
    color: string;
    hopInterval: NodeJS.Timeout | null;
    twitchInterval: NodeJS.Timeout | null;
    animationTimer: NodeJS.Timeout | null;
}

const dirConfig: Record<number, string[]> = {
    0: ['up'],
    360: ['up'],
    45: ['d-up', 'right'],
    90: ['side', 'right'],
    135: ['d-down', 'right'],
    180: ['down'],
    225: ['d-down', 'left'],
    270: ['side', 'left'],
    315: ['d-up', 'left'],
};

export default function Birds({ birdCount = 4, children }: BirdsProps) {
    const [birds, setBirds] = useState<BirdState[]>([]);
    const branchesRef = useRef<Map<string, HTMLElement>>(new Map());
    const birdsRef = useRef<BirdState[]>([]);
    const branchAssignments = useRef<Map<number, number>>(new Map()); // branch index -> bird id
    const settingsRef = useRef({ isResizing: false, resizeTimer: null as NodeJS.Timeout | null });

    const registerBranch = (id: string, element: HTMLElement) => {
        branchesRef.current.set(id, element);
    };

    const unregisterBranch = (id: string) => {
        branchesRef.current.delete(id);
    };

    const radToDeg = (rad: number) => Math.round(rad * (180 / Math.PI));
    const nearestN = (x: number, n: number) => (x === 0 ? 0 : x - 1 + Math.abs(((x - 1) % n) - n));
    const randomN = (max: number) => Math.ceil(Math.random() * max);

    const elAngle = (bird: BirdState, newPos: { x: number; y: number }) => {
        const angle = radToDeg(Math.atan2(bird.pos.y - newPos.y, bird.pos.x - newPos.x)) - 90;
        const adjustedAngle = angle < 0 ? angle + 360 : angle;
        return Math.round(adjustedAngle);
    };

    const faceDirection = (bird: BirdState, newPos: { x: number; y: number }) => {
        const angle = nearestN(elAngle(bird, newPos), 45);
        return dirConfig[angle] || ['down'];
    };

    const isFacingRight = (dirClasses: string[]) => dirClasses.includes('right');

    const isNearEdge = (bird: BirdState, box: HTMLElement) => {
        const buffer = 30;
        const rect = box.getBoundingClientRect();
        const isFacing = isFacingRight(bird.dirClasses);
        return isFacing
            ? Math.abs(bird.pos.x - rect.right) < buffer
            : Math.abs(bird.pos.x - rect.left) < buffer;
    };

    const turn = (dirClasses: string[]) => {
        return dirClasses.map(d => {
            if (d === 'right') return 'left';
            if (d === 'left') return 'right';
            return d;
        });
    };

    const hop = (bird: BirdState, box: HTMLElement) => {
        if (bird.isHopping || bird.isFlying) return;

        bird.isHopping = true;
        bird.hopCount = 0;

        if (isNearEdge(bird, box)) {
            bird.dirClasses = turn(bird.dirClasses);
        }

        bird.dirClasses = ['side', isFacingRight(bird.dirClasses) ? 'right' : 'left'];
        setBirds([...birdsRef.current]);

        const interval = setInterval(() => {
            const currentBird = birdsRef.current[bird.id];
            if (!currentBird) return;

            if (currentBird.hopCount % 2 === 0) {
                currentBird.pos.x += isFacingRight(currentBird.dirClasses) ? 10 : -10;
                setBirds([...birdsRef.current]);
            }

            currentBird.hopCount++;

            if (currentBird.hopCount === 5) {
                clearInterval(interval);
                currentBird.hopInterval = null;

                currentBird.animationTimer = setTimeout(() => {
                    currentBird.dirClasses = currentBird.dirClasses.map(d => {
                        return d === 'side'
                            ? ['d-up', 'd-down', 'side'][Math.floor(Math.random() * 3)]
                            : d;
                    });
                    currentBird.isHopping = false;
                    setBirds([...birdsRef.current]);

                    // Start next behaviour after random delay
                    setTimeout(() => {
                        if (!currentBird.isFlying && !currentBird.isHopping) {
                            const rand = Math.random();
                            if (rand < 0.6) {
                                twitch(currentBird);
                            } else {
                                tweet(currentBird);
                            }
                        }
                    }, Math.random() * 2000 + 500);
                }, 200);
            }
        }, 100);

        bird.hopInterval = interval;
    };

    const tweet = (bird: BirdState) => {
        if (bird.isTweeting) return;

        bird.isTweeting = true;
        setBirds([...birdsRef.current]);

        setTimeout(() => {
            const currentBird = birdsRef.current[bird.id];
            if (currentBird) {
                currentBird.isTweeting = false;
                setBirds([...birdsRef.current]);

                // Start next behavior after random delay
                setTimeout(() => {
                    if (!currentBird.isFlying && !currentBird.isHopping) {
                        const rand = Math.random();
                        const branches = Array.from(branchesRef.current.values());
                        const box = branches[currentBird.zone];

                        if (rand < 0.6) {
                            twitch(currentBird);
                        } else if (rand < 0.9 && box) {
                            hop(currentBird, box);
                        } else {
                            tweet(currentBird);
                        }
                    }
                }, Math.random() * 2000 + 1000);
            }
        }, 1000);
    };

    const twitch = (bird: BirdState) => {
        if (bird.twitchInterval) clearInterval(bird.twitchInterval);

        let twitchCount = 0;
        const maxTwitches = Math.floor(Math.random() * 5) + 3; // 3-7 twitches

        const interval = setInterval(() => {
            const currentBird = birdsRef.current[bird.id];
            if (currentBird) {
                currentBird.twitchPos = randomN(3);
                setBirds([...birdsRef.current]);
                twitchCount++;

                if (twitchCount >= maxTwitches) {
                    clearInterval(interval);
                    currentBird.twitchInterval = null;

                    // Start next behaviour after random delay
                    setTimeout(() => {
                        if (!currentBird.isFlying && !currentBird.isHopping) {
                            const rand = Math.random();
                            const branches = Array.from(branchesRef.current.values());
                            const box = branches[currentBird.zone];

                            if (rand < 0.5 && box) {
                                hop(currentBird, box);
                            } else if (rand < 0.8) {
                                tweet(currentBird);
                            } else {
                                twitch(currentBird);
                            }
                        }
                    }, Math.random() * 2000 + 1000);
                }
            }
        }, 800);

        bird.twitchInterval = interval;
    };

    const flyToPos = (bird: BirdState, branchIndex: number, alwaysFly = false) => {
        const branches = Array.from(branchesRef.current.values());
        if (bird.isFlying || bird.isHopping || !branches[branchIndex]) return;

        // Check if this branch is already occupied by another bird
        const occupyingBirdId = branchAssignments.current.get(branchIndex);
        if (occupyingBirdId !== undefined && occupyingBirdId !== bird.id) {
            console.log(`Branch ${branchIndex} occupied by bird ${occupyingBirdId}, bird ${bird.id} cannot land`);
            return; // Branch is occupied by another bird
        }

        const box = branches[branchIndex];

        // Calculate absolute position within birds-wrapper
        let top = box.offsetTop;
        let left = box.offsetLeft;
        let element = box.offsetParent as HTMLElement;

        // Traverse up to birds-wrapper
        while (element && !element.classList.contains('birds-wrapper')) {
            top += element.offsetTop;
            left += element.offsetLeft;
            element = element.offsetParent as HTMLElement;
        }

        const newPos = {
            x: left + box.offsetWidth / 2,
            y: top - 17,
        };

        // If on same level, just hop instead of fly
        if (!alwaysFly && bird.pos.y === newPos.y) {
            bird.isHopping = true;
            bird.animationTimer = setTimeout(() => {
                const rand = Math.random();
                const currentBird = birdsRef.current[bird.id];
                if (!currentBird) return;

                if (rand < 0.9) {
                    twitch(currentBird);
                } else if (rand < 0.7) {
                    hop(currentBird, box);
                } else {
                    tweet(currentBird);
                }

                clearTimeout(currentBird.animationTimer!);
                currentBird.animationTimer = setTimeout(() => {
                    currentBird.isHopping = false;
                }, 1000);
            }, randomN(200));
            return;
        }

        // Clear existing intervals
        if (bird.twitchInterval) {
            clearInterval(bird.twitchInterval);
            bird.twitchInterval = null;
        }

        // Clear previous branch assignment
        if (bird.zone >= 0 && bird.zone !== branchIndex) {
            const previousOccupant = branchAssignments.current.get(bird.zone);
            if (previousOccupant === bird.id) {
                console.log(`Bird ${bird.id} leaving branch ${bird.zone}`);
                branchAssignments.current.delete(bird.zone);
            }
        }

        bird.dirClasses = faceDirection(bird, newPos);
        bird.pos = newPos;
        bird.isFlying = true;
        bird.zone = branchIndex;

        // Claim this branch
        console.log(`Bird ${bird.id} claiming branch ${branchIndex}`);
        branchAssignments.current.set(branchIndex, bird.id);

        setBirds([...birdsRef.current]);

        // Land after flying animation
        if (bird.animationTimer) clearTimeout(bird.animationTimer);
        bird.animationTimer = setTimeout(() => {
            const currentBird = birdsRef.current[bird.id];
            if (currentBird) {
                currentBird.isFlying = false;
                currentBird.dirClasses = dirConfig[[135, 180, 225][Math.floor(Math.random() * 3)]];
                setBirds([...birdsRef.current]);

                // Start behaviors with random delay
                const behaviorDelay = Math.random() * 1000 + 500;
                setTimeout(() => {
                    const rand = Math.random();
                    if (rand < 0.4) {
                        twitch(currentBird);
                    } else if (rand < 0.7) {
                        hop(currentBird, box);
                    } else {
                        tweet(currentBird);
                    }
                }, behaviorDelay);
            }
        }, 2000);
    };

    const getIndex = () => {
        const branches = Array.from(branchesRef.current.entries());
        if (branches.length === 0) return undefined;

        const scrollY = window.scrollY;
        const viewportMiddle = scrollY + window.innerHeight / 2;

        const positions = branches.map(([id, el], i) => ({
            i,
            y: el.getBoundingClientRect().top + scrollY,
        }));

        return positions.find(b => b.y < viewportMiddle)?.i;
    };

    useEffect(() => {
        // Initialize birds
        const brightColors = ['#FF6B9D', '#4ECDC4', '#FFD93D', '#95E1D3']; // Bright pink, teal, yellow, mint

        const initialBirds: BirdState[] = Array.from({ length: birdCount }, (_, i) => ({
            id: i,
            pos: { x: -100, y: 100 },
            dirClasses: ['down'],
            isFlying: false,
            isHopping: false,
            isTweeting: false,
            hopCount: 0,
            zone: -1,
            twitchPos: 0,
            color: brightColors[i % brightColors.length],
            hopInterval: null,
            twitchInterval: null,
            animationTimer: null,
        }));

        birdsRef.current = initialBirds;
        setBirds(initialBirds);

        // Initial positioning
        setTimeout(() => {
            const branches = Array.from(branchesRef.current.values());
            if (branches.length > 0) {
                // Clear all branch assignments
                branchAssignments.current.clear();

                // Assign each bird to a unique branch from the top
                initialBirds.forEach((bird, i) => {
                    if (i < branches.length) {
                        console.log(`Initial: Assigning bird ${i} to branch ${i}`);
                        flyToPos(bird, i);
                    }
                });
            }
        }, 200);

        // Scroll interval
        const scrollInterval = setInterval(() => {
            if (settingsRef.current.isResizing) return;

            const branches = Array.from(branchesRef.current.values());
            if (branches.length === 0) return;

            // Calculate which branches are currently visible
            const scrollY = window.scrollY;
            const viewportTop = scrollY;
            const viewportBottom = scrollY + window.innerHeight;

            const visibleBranches: number[] = [];
            branches.forEach((branch, i) => {
                const rect = branch.getBoundingClientRect();
                const branchY = rect.top + scrollY;

                // Branch is visible if it's within the viewport
                if (branchY >= viewportTop && branchY <= viewportBottom) {
                    visibleBranches.push(i);
                }
            });

            console.log('Visible branches:', visibleBranches);

            // Assign birds to visible branches
            birdsRef.current.forEach((bird, birdIndex) => {
                const isOnVisibleBranch = bird.zone >= 0 && visibleBranches.includes(bird.zone);

                // If bird is on a visible branch and not flying, let it stay
                if (isOnVisibleBranch && !bird.isFlying) {
                    return;
                }

                // Bird needs to move - find an unoccupied visible branch
                if (!bird.isFlying) {
                    // Add random chance to delay movement for more natural behavior
                    const shouldMoveNow = Math.random() < 0.6; // 60% chance to move immediately

                    if (shouldMoveNow) {
                        let targetBranch = -1;
                        for (const branchIndex of visibleBranches) {
                            const occupyingBird = branchAssignments.current.get(branchIndex);
                            if (occupyingBird === undefined || occupyingBird === bird.id) {
                                targetBranch = branchIndex;
                                break;
                            }
                        }

                        // If we found an available branch and it's different from current
                        if (targetBranch !== -1 && targetBranch !== bird.zone) {
                            console.log(`Moving bird ${bird.id} from branch ${bird.zone} to branch ${targetBranch}`);
                            flyToPos(bird, targetBranch);
                        }
                    }
                }
            });
        }, 1000);

        // Resize handler
        const handleResize = () => {
            settingsRef.current.isResizing = true;
            if (settingsRef.current.resizeTimer) {
                clearTimeout(settingsRef.current.resizeTimer);
            }

            const index = getIndex();
            if (index !== undefined) {
                birdsRef.current.forEach((bird) => {
                    bird.isHopping = false;
                    bird.isFlying = false;
                    if (bird.animationTimer) clearTimeout(bird.animationTimer);

                    const branches = Array.from(branchesRef.current.values());
                    if (bird.zone < branches.length) {
                        flyToPos(bird, bird.zone, true);
                    }
                });
            }

            settingsRef.current.resizeTimer = setTimeout(() => {
                settingsRef.current.isResizing = false;
            }, 100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(scrollInterval);
            window.removeEventListener('resize', handleResize);
            birdsRef.current.forEach(bird => {
                if (bird.hopInterval) clearInterval(bird.hopInterval);
                if (bird.twitchInterval) clearInterval(bird.twitchInterval);
                if (bird.animationTimer) clearTimeout(bird.animationTimer);
            });
        };
    }, [birdCount]);

    return (
        <BirdBranchContext.Provider value={{ registerBranch, unregisterBranch }}>
            <div className="birds-wrapper">
                {birds.map(bird => (
                    <div
                        key={bird.id}
                        className={`bird-wrapper ${bird.isFlying ? 'fly' : ''} ${bird.isHopping ? 'hop' : ''} ${bird.isTweeting ? 'tweet' : ''
                            } ${bird.twitchPos ? `pos-${bird.twitchPos}` : ''} ${bird.dirClasses.join(' ')}`}
                        style={{
                            transform: `translate(${bird.pos.x}px, ${bird.pos.y}px)`,
                            '--bird-color': bird.color,
                        } as React.CSSProperties}
                    >
                        <div className="bird">
                            <div className="anchor"></div>
                            <div className="head"></div>
                            <div className="body"></div>
                            <div className="wing left-wing"></div>
                            <div className="wing right-wing"></div>
                            <div className="legs">
                                <div className="leg left-leg"></div>
                                <div className="leg right-leg"></div>
                            </div>
                            <div className="tail"></div>
                        </div>
                    </div>
                ))}

                {children}

                <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          :root {
            --brown: #5f380c;
          }

          .birds-wrapper {
            position: relative;
            width: 100%;
          }

          .bird-perch {
            height: 12px;
            background-color: #f7d992;
            margin: 0 auto;
          }

          .bird-perch.s {
            width: 70px;
          }

          .bird-perch.m {
            width: 90px;
          }

          @media (min-width: 640px) {
            .bird-perch.s {
              width: 100px;
            }

            .bird-perch.m {
              width: 130px;
            }
          }

          .bird-wrapper {
            position: absolute;
            transition: 1.5s;
            z-index: 999;
            top: 0;
            left: 0;
            pointer-events: none;
          }

          .bird {
            position: relative;
            --m: 1.5;
            --w: 21px;
            --h: 18px;
            width: calc(var(--m) * var(--w));
            height: calc(var(--m) * var(--h));
            margin-top: calc(var(--m) * var(--h) * -0.5);
            margin-left: calc(var(--m) * var(--w) * -0.5);
            --flip: scale(1);
          }

          @media (min-width: 640px) {
            .bird {
              --m: 2;
            }
          }

          .head {
            position: absolute;
            --w: 19px;
            --h: 15px;
            width: calc(var(--m) * var(--w));
            height: calc(var(--m) * var(--h));
            background-size: calc(var(--m) * var(--w) * 5) calc(var(--m) * var(--h) * 6);
            background-repeat: no-repeat;
            image-rendering: pixelated;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABaCAYAAADegYpGAAAAAXNSR0IArs4c6QAABYlJREFUeF7tXVF2FDEM6/7DfeA0cDQ4DdwH/peX95piTBJJjjOz3Uk/O7NaW1YSR5NOby/75zQGbqd98xN/8ZdPH+7ff/6G3A5vuN/vd8/R7XaDoI/OK0tONA8Wv0lki/SsInjsaDFnhVEIKjlVhc7iFSwV4z/yGeJrIRTiEC6LhXBKbAxWIf/bj1+UuBFeNKZ/yGdAIiOAxc1IkhUGGxMq5gzOcvKV4DITHWHZmL5+/vjCjICWMNTcfExv5EeAGJWpuD31qziXJz9CmCWtLorld16dRyvWFzOam8VpKh8l5q9nqtUnWQuwyX+dZ2bJR8XNml97U09UtTauKEZT+b0+tfx+RNaoQykBtj4bwYski2Kj+szXm7IEYXHgJqsQVX/s0EdtYfnMaM62iTNYI3FE2l8Wj4mNEUYLh7IK2O2yoqR978sLRf4mag0Dm/w1vFKom3yKpthNaLq+pKVsqUQExWj/22yMfH3Y7fS+nOkC/GdVy3WUeBbWyN1cneNlLWW21ext1BhhoXZ6uauZmSTTT9eEkWorFtptI/JnYlpOvhJcZqIsFkN+D0vNzeNc3lJWFlQ/mh6a/EhwXh2XczUZNdjhuspSvqSfX8hHc+Es+aqzmTGKqqgysKIYdmR3F1xPTo8sxrZVbOXMUcTExozy5QuuDaJV1WotV1sZtXJWZf6zrYQVPETY0VjMKAhbyjXZyFY88hlE7rNc38baiZXc5G/yT2TgxK++vKWczb2yxh1qKbdMNrYzaZEUtZU9Qb1uRY1NjecpLWVkqpXr+5SykzNSGtNPW8isTdYqnHdjKavEj9SvePm1mEsPTUWSGwUW9VFskuyhq9GiOSIN+VdoFEU5qzHtg7JCu7PsrKatIjLVZg/KIteUGeKsahkslv9DyLfB9M5qoiFp28qWsbYtZXdcMDKHoU6AcTSZQrb2CEixKDb0eRTXLF/LN1lMgKjFtCRk4mVhRXG2sabIP/neTX4yoQrcJl9hK/neTX4yodOu5mh3qiyOyXmlwikkKV+s4C7vdnzgvjOIFlO1b30c+8UXhhG2CNG2zpLfOwXXUziKLRrTcldT2RxlJFkJPAqLIb4X03LyleBKkKt3pV4MR3tENr/Ln1J+WvJV1fvhecmDskgNGZbyqH3zU0/reSuKcTT3z4pCWcdaeUoPU5C/rx5uRcT5p1nlL/oyCBvtX5hefpmf36tmJSpySjnyhw1qIZURpLqj9v6shzLNBbcXWI981MpZlSlKH5HJql+JDSmewWLiauFQ3o6yZW7tJJkXfCISnvE6Rf4zJv4IOW3yT6zC5cmfmVJHdWNwL3tKuZLDkKQODu+Ydg271oXo6o2CnLWBUavIdCYWA7mbKl6vXe/hPOUpZZY0RmTI7GM3brDVZINBmw8/AlhcRBqLwxCmHJbNclo9ziUtZTs9oA1gFdLSHa6iKq/sLGWMFBuJL9OqaMU2G9NSPz8SnE3ykpYy6lrK9dl3L4y+49KWsie3RdQs+ewp5dqHz44i1KYygjvMUm55+DVA9rW+o45Ctagj5K9ei2Zjos/tsE+vWm0mc0wctZlsP820mdlYTBFgn4+GXmQrvnIbj+J99OuXN9bOLNAm/0T2N/nJ5CtT82Ut5WTO3+CmyY+u3kxCWaeUrT+jGn37xReuUpmtJtNu7hdfiAVgRiQzChTiUSGVmN6VpWynByXJWgDkarJ2cq8AszEtdTV787JqqpX7mf9f2MId+fBnkG8L+fAvvijB7oOy5n/Hsj5PGZY9dc26mqxqs55A+aknMuX46RBOO+ig7GhBsq6mnzpY8hUTTJ12mNa4t4Cnkj+an1WiPGGsSjM7iyOwIgWQTin31MH25Uxbx2KxCziLx5DHYEVxtrejzj2J92/yE8lUof4AX4lUtcFJ+m8AAAAASUVORK5CYII=);
            top: calc(var(--m) * -2px);
            left: calc(var(--m) * 1px);
            z-index: 2;
            --tweet-offset: 0;
            --bw: 0;
            --bh: calc(0 - var(--tweet-offset));
            background-position: calc(var(--m) * var(--w) * var(--bw))
              calc(var(--m) * var(--h) * var(--bh));
          }

          .pos-1 .head {
            --bh: calc(0 - var(--tweet-offset));
          }
          .pos-2 .head {
            --bh: calc(-1 - var(--tweet-offset));
          }
          .pos-3 .head {
            --bh: calc(-2 - var(--tweet-offset));
          }

          .body {
            position: absolute;
            --w: 21px;
            --h: 14px;
            width: calc(var(--m) * var(--w));
            height: calc(var(--m) * var(--h));
            top: calc(var(--m) * 5px);
            left: 0;
            z-index: 1;
            background-color: #8b6f47;
            border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
            box-shadow: inset 0 -2px 3px rgba(0,0,0,0.2);
          }

          .fly .bird {
            --bop-start: -100px;
            --bop-middle: -10px;
            --bop-end: 0px;
            animation: fly-arc forwards 2s ease-in-out;
          }

          .fly.up .wing,
          .fly.down .wing {
            top: calc(var(--m) * 9px);
            animation: infinite wing-flap 0.2s;
          }

          .fly.up .wing::after,
          .fly.down .wing::after {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAADZJREFUGFdjZEAD8RY8/5GFFp74wgjigwkQQFeArhisEJ8imAZGYhTBrSakGOROuBtxOQHmGQAV0hNL7bdGpQAAAABJRU5ErkJggg==);
            --w: 10px;
            --h: 6px;
          }

          .wing {
            position: absolute;
            width: 0px;
            height: 0px;
            top: calc(var(--m) * 9px);
            display: flex;
            align-items: center;
            z-index: 2;
          }

          .fly.down .wing {
            z-index: 0;
          }

          .wing::after {
            position: absolute;
            content: '';
            --w: 7px;
            --h: 4px;
            background-size: cover;
            image-rendering: pixelated;
            width: calc(var(--m) * var(--w));
            height: calc(var(--m) * var(--h));
          }

          .up .wing::after,
          .down .wing::after {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAANklEQVR4AUzJsQ0AIAwDQXDNQGzDbGzDQPSgRxQfyZFzSfkzejsO/J4gh4OFZXTPXLsSIx27AAAA///Y5+gzAAAABklEQVQDAEQqEpFoMrQzAAAAAElFTkSuQmCC);
          }

          .right-wing {
            right: calc(var(--m) * 2px);
            --f: -1;
            justify-content: start;
          }

          .right-wing::after {
            transform: scale(-1, 1);
          }

          .left-wing {
            left: calc(var(--m) * 2px);
            --f: 1;
            justify-content: end;
          }

          .fly .left-wing {
            left: calc(var(--m) * 3px);
          }

          .fly .right-wing {
            right: calc(var(--m) * 3px);
          }

          .up .wing,
          .down .wing {
            --wing-start: rotate(calc(-45deg * var(--f)));
            --wing-end: rotate(calc(45deg * var(--f)));
            transform: rotate(calc(-90deg * var(--f)));
          }

          .fly.d-up .left-wing::after,
          .fly.side .left-wing::after,
          .fly.d-down .left-wing::after {
            animation: infinite wing-flap-side 0.2s steps(1);
            --w: 9px;
            z-index: 1;
          }

          .legs {
            position: absolute;
            bottom: 0;
            --h: 2px;
            width: calc(var(--m) * var(--w));
            height: calc(var(--m) * var(--h));
            justify-content: space-between;
            padding: 0 calc(var(--m) * 5px);
            display: none;
          }

          .down .legs {
            display: flex;
          }

          .leg {
            background-color: var(--bird-color, var(--brown));
            --w: 1px;
            --h: 3px;
            width: calc(var(--m) * var(--w));
            height: calc(var(--m) * var(--h));
            z-index: 1;
          }

          .up .head {
            --bw: -4;
          }
          .d-up .head {
            --bw: -3;
            left: calc(var(--m) * -1px);
          }
          .side .head {
            --bw: -2;
            left: calc(var(--m) * -1px);
          }
          .d-down .head {
            --bw: -1;
            left: calc(var(--m) * -1px);
          }
          .down .head {
            --bw: 0;
          }

          .right .bird {
            transform: scale(-1, 1);
            --flip: scale(-1, 1);
          }

          .up .legs {
            z-index: 0;
          }

          .side .left-wing {
            left: calc(var(--m) * 6px);
            top: calc(var(--m) * 10px);
            z-index: 2;
          }

          .side .left-wing::after {
            --w: 10px;
            --h: 6px;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAADdJREFUGFdjZICCeAue/zA2iF544gsjMh/MQVeETQMjPkUwDSDTiVII0kDQaph74Q7G5gRkDwEAhlgVqe4XPiwAAAAASUVORK5CYII=);
          }

          .d-up .left-wing {
            left: calc(var(--m) * 2px);
            top: calc(var(--m) * 11px);
            z-index: 2;
          }

          .d-up .left-wing::after {
            --w: 8px;
            --h: 7px;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAYAAAA1WQxeAAAAAXNSR0IArs4c6QAAADhJREFUGFdjZGBgYIi34PkPomFg4YkvjDA2I7okuiKcCkAKQSYRVoDNDcjugTsGl1vgCmC60BUCAEivFO6lToiVAAAAAElFTkSuQmCC);
            z-index: 2;
          }

          .side .left-wing,
          .d-down .left-wing,
          .d-up .left-wing {
            justify-content: start;
            align-items: start;
          }

          .d-down .left-wing {
            left: calc(var(--m) * 11px);
            top: calc(var(--m) * 11px);
          }

          .d-down .left-wing::after {
            --w: 8px;
            --h: 6px;
          }

          .d-down .wing::after {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAAXNSR0IArs4c6QAAACxJREFUGFdjZEAC8RY8/2HchSe+MILYYAJZAlkDWAE+SZAp5CvA6waYJMgNANQvFamdLq05AAAAAElFTkSuQmCC);
            z-index: 2;
          }

          .d-down .right-wing,
          .d-up .right-wing,
          .side .right-wing {
            display: none;
          }

          .hop {
            transition: 0.2s;
          }

          .hop .bird {
            --bop-start: 0px;
            --bop-middle: calc(var(--m) * -1px);
            --bop-end: 0px;
            animation: bop infinite 0.2s;
          }

          .tweet .head {
            animation: tweet infinite 0.2s steps(2);
          }

          .tail {
            position: absolute;
            width: calc(var(--m) * var(--w));
            height: calc(var(--m) * var(--h));
            --m: 2;
            background-color: var(--bird-color, var(--brown));
            opacity: 0.8;
          }

          .up .tail {
            --w: 5px;
            --h: 6px;
            left: calc(var(--m) * 8px);
            top: calc(var(--m) * 15px);
            z-index: 1;
            border-radius: 0 0 50% 50%;
          }

          .side .tail {
            --w: 7px;
            --h: 2px;
            left: calc(var(--m) * 19px);
            top: calc(var(--m) * 12px);
            border-radius: 0 50% 50% 0;
          }

          .hop .tail,
          .d-down .tail {
            --w: 7px;
            --h: 6px;
            border-radius: 50%;
          }

          .hop .tail {
            top: calc(var(--m) * 8px);
          }

          .d-up .tail {
            --w: 6px;
            --h: 4px;
            left: calc(var(--m) * 17px);
            top: calc(var(--m) * 14px);
            z-index: 1;
            border-radius: 50% 50% 0 0;
          }

          .d-down .tail {
            left: calc(var(--m) * 17px);
            top: calc(var(--m) * 7px);
          }

          .anchor {
            position: absolute;
            left: -6px;
            width: 0px;
            height: 0px;
            display: flex;
            justify-content: center;
            align-items: end;
          }

          .up .anchor,
          .down .anchor {
            left: 50%;
            top: -12px;
            transform: translateX(-50%);
          }

          @keyframes tweet {
            0% {
              --tweet-offset: 3;
            }
            100% {
              --tweet-offset: 0;
            }
          }

          @keyframes bop {
            0% {
              transform: translateY(calc(var(--m) * var(--bop-start))) var(--flip);
            }
            50% {
              transform: translateY(calc(var(--m) * var(--bop-middle))) var(--flip);
            }
            100% {
              transform: translateY(calc(var(--m) * var(--bop-end))) var(--flip);
            }
          }

          @keyframes fly-arc {
            0% {
              transform: translateY(calc(var(--m) * var(--bop-end))) var(--flip);
            }
            25% {
              transform: translateY(calc(var(--m) * var(--bop-start))) var(--flip);
            }
            75% {
              transform: translateY(calc(var(--m) * var(--bop-middle))) var(--flip);
            }
            100% {
              transform: translateY(calc(var(--m) * var(--bop-end))) var(--flip);
            }
          }

          @keyframes wing-flap-side {
            0%,
            100% {
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAYAAACtWacbAAAAAXNSR0IArs4c6QAAADVJREFUKFNjZEAC8RY8/2HchSe+MMLYcAayAnSFYEXYFCArJE4RPlPgbhqMiogOAlwKYaEOAHB1IDa+c4RSAAAAAElFTkSuQmCC);
              --h: 11px;
              top: calc(var(--m) * -8px);
              z-index: 100;
            }
            25%,
            75% {
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAECAYAAABcDxXOAAAAAXNSR0IArs4c6QAAACNJREFUGFdjZGBgYIi34PkPorGBhSe+MDLiUwDTRJwiYqwDAFHXC0mhFNqMAAAAAElFTkSuQmCC);
              --h: 4px;
              top: calc(var(--m) * 0px);
            }
            50% {
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAYAAACtWacbAAAAAXNSR0IArs4c6QAAADVJREFUKFNjZEAC8RY8/2HchSe+MMLYcAayAnSFYEXYFCArJE4RPlPgbhqMiogOAlwKYaEOAHB1IDa+c4RSAAAAAElFTkSuQmCC);
              --h: 11px;
              top: calc(var(--m) * 0px);
              transform: scale(1, -1);
            }
          }

          @keyframes wing-flap {
            0%,
            100% {
              transform: var(--wing-start);
            }
            50% {
              transform: var(--wing-end);
            }
          }
        `}</style>
            </div>
        </BirdBranchContext.Provider>
    );
}
