"use client";

import { tiny5 } from '@/lib/fonts';
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

export default function Birds({ birdCount = 6, children }: BirdsProps) {
  const [birds, setBirds] = useState<BirdState[]>([]);
  const branchesRef = useRef<Map<string, HTMLElement>>(new Map());
  const birdsRef = useRef<BirdState[]>([]);
  const branchAssignments = useRef<Map<number, number>>(new Map());
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

          setTimeout(() => {
            if (!currentBird.isFlying && !currentBird.isHopping) {
              const rand = Math.random();
              if (rand < 0.5) {
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

        setTimeout(() => {
          if (!currentBird.isFlying && !currentBird.isHopping) {
            const rand = Math.random();
            const branches = Array.from(branchesRef.current.values());
            const box = branches[currentBird.zone];

            if (rand < 0.5) {
              twitch(currentBird);
            } else if (rand < 0.8 && box) {
              hop(currentBird, box);
            } else {
              tweet(currentBird);
            }
          }
        }, Math.random() * 1500 + 500);
      }
    }, 1000);
  };

  const twitch = (bird: BirdState) => {
    if (bird.twitchInterval) clearInterval(bird.twitchInterval);

    let twitchCount = 0;
    const maxTwitches = Math.floor(Math.random() * 5) + 3;

    const interval = setInterval(() => {
      const currentBird = birdsRef.current[bird.id];
      if (currentBird) {
        currentBird.twitchPos = randomN(3);
        setBirds([...birdsRef.current]);
        twitchCount++;

        if (twitchCount >= maxTwitches) {
          clearInterval(interval);
          currentBird.twitchInterval = null;

          setTimeout(() => {
            if (!currentBird.isFlying && !currentBird.isHopping) {
              const rand = Math.random();
              const branches = Array.from(branchesRef.current.values());
              const box = branches[currentBird.zone];

              if (rand < 0.4 && box) {
                hop(currentBird, box);
              } else if (rand < 0.7) {
                tweet(currentBird);
              } else {
                twitch(currentBird);
              }
            }
          }, Math.random() * 2000 + 500);
        }
      }
    }, 800);

    bird.twitchInterval = interval;
  };

  const flyToPos = (bird: BirdState, branchIndex: number, alwaysFly = false) => {
    const branches = Array.from(branchesRef.current.values());
    if (bird.isFlying || bird.isHopping || !branches[branchIndex]) return;

    const occupyingBirdId = branchAssignments.current.get(branchIndex);
    if (occupyingBirdId !== undefined && occupyingBirdId !== bird.id) {
      return;
    }

    const box = branches[branchIndex];

    let top = box.offsetTop;
    let left = box.offsetLeft;
    let element = box.offsetParent as HTMLElement;

    while (element && !element.classList.contains('birds-wrapper')) {
      top += element.offsetTop;
      left += element.offsetLeft;
      element = element.offsetParent as HTMLElement;
    }

    const newPos = {
      x: left + box.offsetWidth / 2,
      y: top - 17,
    };

    if (!alwaysFly && bird.pos.y === newPos.y) {
      bird.isHopping = true;
      bird.animationTimer = setTimeout(() => {
        const rand = Math.random();
        const currentBird = birdsRef.current[bird.id];
        if (!currentBird) return;

        if (rand < 0.7) {
          twitch(currentBird);
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

    if (bird.twitchInterval) {
      clearInterval(bird.twitchInterval);
      bird.twitchInterval = null;
    }

    if (bird.zone >= 0 && bird.zone !== branchIndex) {
      const previousOccupant = branchAssignments.current.get(bird.zone);
      if (previousOccupant === bird.id) {
        branchAssignments.current.delete(bird.zone);
      }
    }

    bird.dirClasses = faceDirection(bird, newPos);
    bird.pos = newPos;
    bird.isFlying = true;
    bird.zone = branchIndex;

    branchAssignments.current.set(branchIndex, bird.id);

    setBirds([...birdsRef.current]);

    if (bird.animationTimer) clearTimeout(bird.animationTimer);
    bird.animationTimer = setTimeout(() => {
      const currentBird = birdsRef.current[bird.id];
      if (currentBird) {
        currentBird.isFlying = false;
        currentBird.dirClasses = dirConfig[[135, 180, 225][Math.floor(Math.random() * 3)]];
        setBirds([...birdsRef.current]);

        const behaviorDelay = Math.random() * 1000 + 500;
        setTimeout(() => {
          const rand = Math.random();
          if (rand < 0.3) {
            twitch(currentBird);
          } else if (rand < 0.6) {
            hop(currentBird, box);
          } else {
            tweet(currentBird);
          }
        }, behaviorDelay);
      }
    }, 2000);
  };

  useEffect(() => {
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
      hopInterval: null,
      twitchInterval: null,
      animationTimer: null,
    }));

    birdsRef.current = initialBirds;
    setBirds(initialBirds);

    setTimeout(() => {
      const branches = Array.from(branchesRef.current.values());
      if (branches.length > 0) {
        branchAssignments.current.clear();

        initialBirds.forEach((bird, i) => {
          if (i < branches.length) {
            flyToPos(bird, i);
          }
        });
      }
    }, 200);

    const scrollInterval = setInterval(() => {
      if (settingsRef.current.isResizing) return;

      const branches = Array.from(branchesRef.current.values());
      if (branches.length === 0) return;

      const scrollY = window.scrollY;
      const viewportTop = scrollY;
      const viewportBottom = scrollY + window.innerHeight;

      const visibleBranches: number[] = [];
      branches.forEach((branch, i) => {
        const rect = branch.getBoundingClientRect();
        const branchY = rect.top + scrollY;

        if (branchY >= viewportTop && branchY <= viewportBottom) {
          visibleBranches.push(i);
        }
      });

      birdsRef.current.forEach((bird) => {
        const isOnVisibleBranch = bird.zone >= 0 && visibleBranches.includes(bird.zone);

        if (isOnVisibleBranch && !bird.isFlying) {
          return;
        }

        if (!bird.isFlying) {
          const shouldMoveNow = Math.random() < 0.6;

          if (shouldMoveNow) {
            let targetBranch = -1;
            for (const branchIndex of visibleBranches) {
              const occupyingBird = branchAssignments.current.get(branchIndex);
              if (occupyingBird === undefined || occupyingBird === bird.id) {
                targetBranch = branchIndex;
                break;
              }
            }

            if (targetBranch !== -1 && targetBranch !== bird.zone) {
              flyToPos(bird, targetBranch);
            }
          }
        }
      });
    }, 1000);

    const handleResize = () => {
      settingsRef.current.isResizing = true;
      if (settingsRef.current.resizeTimer) {
        clearTimeout(settingsRef.current.resizeTimer);
      }

      birdsRef.current.forEach((bird) => {
        bird.isHopping = false;
        bird.isFlying = false;
        if (bird.animationTimer) clearTimeout(bird.animationTimer);

        const branches = Array.from(branchesRef.current.values());
        if (bird.zone >= 0 && bird.zone < branches.length) {
          flyToPos(bird, bird.zone, true);
        }
      });

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
            }}
          >
            <div className="bird">
              <div className="anchor">
                <div className={`bird-speech-bubble ${tiny5.className}`}>tweet</div>
              </div>
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
            z-index: 3;
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
            --w: 18px;
            --h: 14px;
            width: calc(var(--m) * 1px);
            height: calc(var(--m) * 1px);
            top: calc(var(--m) * 6px);
            left: calc(var(--m) * 2px);
            z-index: 1;
            background-color: #fff;
            box-shadow:
              /* Row 1 (top) - 6 pixels */
              calc(var(--m) * 6px) calc(var(--m) * 0px) 0  #fff,
              calc(var(--m) * 7px) calc(var(--m) * 0px) 0  #fff,
              calc(var(--m) * 8px) calc(var(--m) * 0px) 0  #fff,
              calc(var(--m) * 9px) calc(var(--m) * 0px) 0  #fff,
              calc(var(--m) * 10px) calc(var(--m) * 0px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 0px) 0 #fff,
              /* Row 2 - 10 pixels */
              calc(var(--m) * 4px) calc(var(--m) * 1px) 0  #fff,
              calc(var(--m) * 5px) calc(var(--m) * 1px) 0  #fff,
              calc(var(--m) * 6px) calc(var(--m) * 1px) 0  #fff,
              calc(var(--m) * 7px) calc(var(--m) * 1px) 0  #fff,
              calc(var(--m) * 8px) calc(var(--m) * 1px) 0  #fff,
              calc(var(--m) * 9px) calc(var(--m) * 1px) 0  #fff,
              calc(var(--m) * 10px) calc(var(--m) * 1px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 1px) 0 #fff,
              calc(var(--m) * 12px) calc(var(--m) * 1px) 0 #fff,
              calc(var(--m) * 13px) calc(var(--m) * 1px) 0 #fff,
              /* Row 3 - 14 pixels */
              calc(var(--m) * 2px) calc(var(--m) * 2px) 0  #fff,
              calc(var(--m) * 3px) calc(var(--m) * 2px) 0  #fff,
              calc(var(--m) * 4px) calc(var(--m) * 2px) 0  #fff,
              calc(var(--m) * 5px) calc(var(--m) * 2px) 0  #fff,
              calc(var(--m) * 6px) calc(var(--m) * 2px) 0  #fff,
              calc(var(--m) * 7px) calc(var(--m) * 2px) 0  #fff,
              calc(var(--m) * 8px) calc(var(--m) * 2px) 0  #fff,
              calc(var(--m) * 9px) calc(var(--m) * 2px) 0  #fff,
              calc(var(--m) * 10px) calc(var(--m) * 2px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 2px) 0 #fff,
              calc(var(--m) * 12px) calc(var(--m) * 2px) 0 #fff,
              calc(var(--m) * 13px) calc(var(--m) * 2px) 0 #fff,
              calc(var(--m) * 14px) calc(var(--m) * 2px) 0 #fff,
              calc(var(--m) * 15px) calc(var(--m) * 2px) 0 #fff,
              /* Row 4 - 16 pixels */
              calc(var(--m) * 1px) calc(var(--m) * 3px) 0  #fff,
              calc(var(--m) * 2px) calc(var(--m) * 3px) 0  #fff,
              calc(var(--m) * 3px) calc(var(--m) * 3px) 0  #fff,
              calc(var(--m) * 4px) calc(var(--m) * 3px) 0  #fff,
              calc(var(--m) * 5px) calc(var(--m) * 3px) 0  #fff,
              calc(var(--m) * 6px) calc(var(--m) * 3px) 0  #fff,
              calc(var(--m) * 7px) calc(var(--m) * 3px) 0  #fff,
              calc(var(--m) * 8px) calc(var(--m) * 3px) 0  #fff,
              calc(var(--m) * 9px) calc(var(--m) * 3px) 0  #fff,
              calc(var(--m) * 10px) calc(var(--m) * 3px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 3px) 0 #fff,
              calc(var(--m) * 12px) calc(var(--m) * 3px) 0 #fff,
              calc(var(--m) * 13px) calc(var(--m) * 3px) 0 #fff,
              calc(var(--m) * 14px) calc(var(--m) * 3px) 0 #fff,
              calc(var(--m) * 15px) calc(var(--m) * 3px) 0 #fff,
              calc(var(--m) * 16px) calc(var(--m) * 3px) 0 #fff,
              /* Row 5 - 18 pixels (widest) */
              calc(var(--m) * 0px) calc(var(--m) * 4px) 0  #fff,
              calc(var(--m) * 1px) calc(var(--m) * 4px) 0  #fff,
              calc(var(--m) * 2px) calc(var(--m) * 4px) 0  #fff,
              calc(var(--m) * 3px) calc(var(--m) * 4px) 0  #fff,
              calc(var(--m) * 4px) calc(var(--m) * 4px) 0  #fff,
              calc(var(--m) * 5px) calc(var(--m) * 4px) 0  #fff,
              calc(var(--m) * 6px) calc(var(--m) * 4px) 0  #fff,
              calc(var(--m) * 7px) calc(var(--m) * 4px) 0  #fff,
              calc(var(--m) * 8px) calc(var(--m) * 4px) 0  #fff,
              calc(var(--m) * 9px) calc(var(--m) * 4px) 0  #fff,
              calc(var(--m) * 10px) calc(var(--m) * 4px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 4px) 0 #fff,
              calc(var(--m) * 12px) calc(var(--m) * 4px) 0 #fff,
              calc(var(--m) * 13px) calc(var(--m) * 4px) 0 #fff,
              calc(var(--m) * 14px) calc(var(--m) * 4px) 0 #fff,
              calc(var(--m) * 15px) calc(var(--m) * 4px) 0 #fff,
              calc(var(--m) * 16px) calc(var(--m) * 4px) 0 #fff,
              calc(var(--m) * 17px) calc(var(--m) * 4px) 0 #fff,
              /* Row 6 - 18 pixels */
              calc(var(--m) * 0px) calc(var(--m) * 5px) 0  #fff,
              calc(var(--m) * 1px) calc(var(--m) * 5px) 0  #fff,
              calc(var(--m) * 2px) calc(var(--m) * 5px) 0  #fff,
              calc(var(--m) * 3px) calc(var(--m) * 5px) 0  #fff,
              calc(var(--m) * 4px) calc(var(--m) * 5px) 0  #fff,
              calc(var(--m) * 5px) calc(var(--m) * 5px) 0  #fff,
              calc(var(--m) * 6px) calc(var(--m) * 5px) 0  #fff,
              calc(var(--m) * 7px) calc(var(--m) * 5px) 0  #fff,
              calc(var(--m) * 8px) calc(var(--m) * 5px) 0  #fff,
              calc(var(--m) * 9px) calc(var(--m) * 5px) 0  #fff,
              calc(var(--m) * 10px) calc(var(--m) * 5px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 5px) 0 #fff,
              calc(var(--m) * 12px) calc(var(--m) * 5px) 0 #fff,
              calc(var(--m) * 13px) calc(var(--m) * 5px) 0 #fff,
              calc(var(--m) * 14px) calc(var(--m) * 5px) 0 #fff,
              calc(var(--m) * 15px) calc(var(--m) * 5px) 0 #fff,
              calc(var(--m) * 16px) calc(var(--m) * 5px) 0 #fff,
              calc(var(--m) * 17px) calc(var(--m) * 5px) 0 #fff,
              /* Row 7 - 18 pixels */
              calc(var(--m) * 0px) calc(var(--m) * 6px) 0  #fff,
              calc(var(--m) * 1px) calc(var(--m) * 6px) 0  #fff,
              calc(var(--m) * 2px) calc(var(--m) * 6px) 0  #fff,
              calc(var(--m) * 3px) calc(var(--m) * 6px) 0  #fff,
              calc(var(--m) * 4px) calc(var(--m) * 6px) 0  #fff,
              calc(var(--m) * 5px) calc(var(--m) * 6px) 0  #fff,
              calc(var(--m) * 6px) calc(var(--m) * 6px) 0  #fff,
              calc(var(--m) * 7px) calc(var(--m) * 6px) 0  #fff,
              calc(var(--m) * 8px) calc(var(--m) * 6px) 0  #fff,
              calc(var(--m) * 9px) calc(var(--m) * 6px) 0  #fff,
              calc(var(--m) * 10px) calc(var(--m) * 6px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 6px) 0 #fff,
              calc(var(--m) * 12px) calc(var(--m) * 6px) 0 #fff,
              calc(var(--m) * 13px) calc(var(--m) * 6px) 0 #fff,
              calc(var(--m) * 14px) calc(var(--m) * 6px) 0 #fff,
              calc(var(--m) * 15px) calc(var(--m) * 6px) 0 #fff,
              calc(var(--m) * 16px) calc(var(--m) * 6px) 0 #fff,
              calc(var(--m) * 17px) calc(var(--m) * 6px) 0 #fff,
              /* Row 8 - 18 pixels */
              calc(var(--m) * 0px) calc(var(--m) * 7px) 0  #fff,
              calc(var(--m) * 1px) calc(var(--m) * 7px) 0  #fff,
              calc(var(--m) * 2px) calc(var(--m) * 7px) 0  #fff,
              calc(var(--m) * 3px) calc(var(--m) * 7px) 0  #fff,
              calc(var(--m) * 4px) calc(var(--m) * 7px) 0  #fff,
              calc(var(--m) * 5px) calc(var(--m) * 7px) 0  #fff,
              calc(var(--m) * 6px) calc(var(--m) * 7px) 0  #fff,
              calc(var(--m) * 7px) calc(var(--m) * 7px) 0  #fff,
              calc(var(--m) * 8px) calc(var(--m) * 7px) 0  #fff,
              calc(var(--m) * 9px) calc(var(--m) * 7px) 0  #fff,
              calc(var(--m) * 10px) calc(var(--m) * 7px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 7px) 0 #fff,
              calc(var(--m) * 12px) calc(var(--m) * 7px) 0 #fff,
              calc(var(--m) * 13px) calc(var(--m) * 7px) 0 #fff,
              calc(var(--m) * 14px) calc(var(--m) * 7px) 0 #fff,
              calc(var(--m) * 15px) calc(var(--m) * 7px) 0 #fff,
              calc(var(--m) * 16px) calc(var(--m) * 7px) 0 #fff,
              calc(var(--m) * 17px) calc(var(--m) * 7px) 0 #fff,
              /* Row 9 - 16 pixels */
              calc(var(--m) * 1px) calc(var(--m) * 8px) 0  #fff,
              calc(var(--m) * 2px) calc(var(--m) * 8px) 0  #fff,
              calc(var(--m) * 3px) calc(var(--m) * 8px) 0  #fff,
              calc(var(--m) * 4px) calc(var(--m) * 8px) 0  #fff,
              calc(var(--m) * 5px) calc(var(--m) * 8px) 0  #fff,
              calc(var(--m) * 6px) calc(var(--m) * 8px) 0  #fff,
              calc(var(--m) * 7px) calc(var(--m) * 8px) 0  #fff,
              calc(var(--m) * 8px) calc(var(--m) * 8px) 0  #fff,
              calc(var(--m) * 9px) calc(var(--m) * 8px) 0  #fff,
              calc(var(--m) * 10px) calc(var(--m) * 8px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 8px) 0 #fff,
              calc(var(--m) * 12px) calc(var(--m) * 8px) 0 #fff,
              calc(var(--m) * 13px) calc(var(--m) * 8px) 0 #fff,
              calc(var(--m) * 14px) calc(var(--m) * 8px) 0 #fff,
              calc(var(--m) * 15px) calc(var(--m) * 8px) 0 #fff,
              calc(var(--m) * 16px) calc(var(--m) * 8px) 0 #fff,
              /* Row 10 - 14 pixels */
              calc(var(--m) * 2px) calc(var(--m) * 9px) 0  #fff,
              calc(var(--m) * 3px) calc(var(--m) * 9px) 0  #fff,
              calc(var(--m) * 4px) calc(var(--m) * 9px) 0  #fff,
              calc(var(--m) * 5px) calc(var(--m) * 9px) 0  #fff,
              calc(var(--m) * 6px) calc(var(--m) * 9px) 0  #fff,
              calc(var(--m) * 7px) calc(var(--m) * 9px) 0  #fff,
              calc(var(--m) * 8px) calc(var(--m) * 9px) 0  #fff,
              calc(var(--m) * 9px) calc(var(--m) * 9px) 0  #fff,
              calc(var(--m) * 10px) calc(var(--m) * 9px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 9px) 0 #fff,
              calc(var(--m) * 12px) calc(var(--m) * 9px) 0 #fff,
              calc(var(--m) * 13px) calc(var(--m) * 9px) 0 #fff,
              calc(var(--m) * 14px) calc(var(--m) * 9px) 0 #fff,
              calc(var(--m) * 15px) calc(var(--m) * 9px) 0 #fff,
              /* Row 11 - 10 pixels */
              calc(var(--m) * 4px) calc(var(--m) * 10px) 0 #fff,
              calc(var(--m) * 5px) calc(var(--m) * 10px) 0 #fff,
              calc(var(--m) * 6px) calc(var(--m) * 10px) 0 #fff,
              calc(var(--m) * 7px) calc(var(--m) * 10px) 0 #fff,
              calc(var(--m) * 8px) calc(var(--m) * 10px) 0 #fff,
              calc(var(--m) * 9px) calc(var(--m) * 10px) 0 #fff,
              calc(var(--m) * 10px) calc(var(--m) * 10px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 10px) 0 #fff,
              calc(var(--m) * 12px) calc(var(--m) * 10px) 0 #fff,
              calc(var(--m) * 13px) calc(var(--m) * 10px) 0 #fff,
              /* Row 12 - 8 pixels */
              calc(var(--m) * 5px) calc(var(--m) * 11px) 0 #fff,
              calc(var(--m) * 6px) calc(var(--m) * 11px) 0 #fff,
              calc(var(--m) * 7px) calc(var(--m) * 11px) 0 #fff,
              calc(var(--m) * 8px) calc(var(--m) * 11px) 0 #fff,
              calc(var(--m) * 9px) calc(var(--m) * 11px) 0 #fff,
              calc(var(--m) * 10px) calc(var(--m) * 11px) 0 #fff,
              calc(var(--m) * 11px) calc(var(--m) * 11px) 0 #fff,
              calc(var(--m) * 12px) calc(var(--m) * 11px) 0 #fff;
            image-rendering: pixelated;
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
            animation: wing-flap 0.2s infinite;
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
            transform: scaleX(-1);
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
          .fly.d-down .left-wing::after,
          .fly.up .left-wing::after,
          .fly.down .left-wing::after {
            animation: wing-flap-side 0.2s steps(1) infinite;
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
            background-color: var(--brown);
            --w: 1px;
            --h: 3px;
            width: calc(var(--m) * var(--w));
            height: calc(var(--m) * var(--h));
            z-index: 3;
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
            z-index: 4;
          }

          .side .left-wing::after {
            --w: 10px;
            --h: 6px;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAADdJREFUGFdjZICCeAue/zA2iF544gsjMh/MQVeETQMjPkUwDSDTiVII0kDQaph74Q7G5gRkDwEAhlgVqe4XPiwAAAAASUVORK5CYII=);
          }

          .d-up .left-wing {
            left: calc(var(--m) * 2px);
            top: calc(var(--m) * 11px);
            z-index: 4;
          }

          .d-up .left-wing::after {
            --w: 8px;
            --h: 7px;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAYAAAA1WQxeAAAAAXNSR0IArs4c6QAAADhJREFUGFdjZGBgYIi34/kPomFg4YkvjDA2I7okuiKcCkAKQSYRVoDNDcjugTsGl1vgCmC60BUCAEivFO6lToiVAAAAAElFTkSuQmCC);
            z-index: 4;
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
            z-index: 4;
          }

          .d-down .right-wing,
          .d-up .right-wing,
          .side .right-wing {
            display: none;
          }

          .fly.up .right-wing,
          .fly.down .right-wing {
            display: flex;
          }

          .fly.d-up .right-wing::after,
          .fly.side .right-wing::after,
          .fly.d-down .right-wing::after,
          .fly.up .right-wing::after,
          .fly.down .right-wing::after {
            animation: wing-flap-side 0.2s steps(1) infinite;
            --w: 9px;
            z-index: 1;
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
            image-rendering: pixelated;
            width: calc(var(--m) * var(--w));
            height: calc(var(--m) * var(--h));
            background-repeat: no-repeat;
            background-size: cover;
          }

          .up .tail {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAGCAYAAAAL+1RLAAAAAXNSR0IArs4c6QAAACZJREFUGFdjZICCeAue/wtPfGEEccEESAAmCZJgRBaASZAgiM1MAHf4EO3J5G9wAAAAAElFTkSuQmCC);
            --w: 10px;
            --h: 6px;
            left: calc(var(--m) * 6px);
            top: calc(var(--m) * 16px);
            z-index: 1;
          }

          .side .tail,
          .hop .tail {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAACCAYAAACUn8ZgAAAAAXNSR0IArs4c6QAAABdJREFUGFdjjLfg+c+AAzDiklx44gsjAIuGBaUigwNFAAAAAElFTkSuQmCC);
            --w: 12px;
            --h: 3px;
            left: calc(var(--m) * 15px);
            top: calc(var(--m) * 11px);
          }
          
          .down .tail,
          .d-down .tail {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAGCAYAAAAPDoR2AAAAAXNSR0IArs4c6QAAADRJREFUGFdjZEAD8RY8/0FCC098YWREloNJwMTgkugScJ3YJEC6GZElQKqRrYFLokuAFAEA55wVqU/qlJAAAAAASUVORK5CYII=);
            --w: 12px;
            --h: 6px;
            rotate: -40deg;
          }

          .down .tail {
            left: calc(var(--m) * 9px);
            top: calc(var(--m) * 7px);
          }

          .d-up .tail {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAGCAYAAAAPDoR2AAAAAXNSR0IArs4c6QAAADRJREFUGFdjZEAD8RY8/0FCC098YWREloNJwMTgkugScJ3YJEC6GZElQKqRrYFLokuAFAEA55wVqU/qlJAAAAAASUVORK5CYII=);
            --w: 10px;
            --h: 6px;
            rotate: 90deg;
            left: calc(var(--m) * 13px);
            top: calc(var(--m) * 13px);
            z-index: 2;
          }

          .d-down .tail {
            left: calc(var(--m) * 14px);
            top: calc(var(--m) * 6px);
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

          .bird-speech-bubble {
            position: absolute;
            bottom: calc(var(--m) * 6px);
            left: 50%;
            transform: translateX(-20%);
            background-color: #fff;
            padding: 2px 8px;
            border: 1px dashed #000;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            z-index: 999;
            border-radius: 8px;
          }

          .bird-speech-bubble::after {
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

          .bird-speech-bubble::before {
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

          .tweet .bird-speech-bubble {
            opacity: 1;
            animation: fade-in 0.1s;
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(calc(var(--m) * 2px));
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
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
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAECAYAAABcDxXOAAAAAXNSR0IArs4c6QAAACNJREFUGFdjZGBgYIi34/kPorGBhSe+MDLiUwDTRJwiYqwDAFHXC0mhFNqMAAAAAElFTkSuQmCC);
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