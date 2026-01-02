"use client";

import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { Tiny5 } from 'next/font/google';

const tiny5 = Tiny5({ weight: '400', subsets: ['latin'] });

interface MonkeyBarContextType {
    registerBar: (id: string, element: HTMLDivElement) => void;
    unregisterBar: (id: string) => void;
}

const MonkeyBarContext = createContext<MonkeyBarContextType | null>(null);

interface MonkeyBarProps {
    id: string;
    className?: string;
}

export const MonkeyBar: React.FC<MonkeyBarProps> = ({ id, className = '' }) => {
    const barRef = useRef<HTMLDivElement>(null);
    const context = useContext(MonkeyBarContext);

    useEffect(() => {
        if (barRef.current && context) {
            context.registerBar(id, barRef.current);
            return () => context.unregisterBar(id);
        }
    }, [id, context]);

    return (
        <div ref={barRef} className={`monkey-bar ${className}`}>
            <div
                className="w-5 h-5"
                style={{
                    backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAADpJREFUKFNjZEACnPqK/5H53y/eZ4Tx4Qx0RTAFMMVghbgUIStmJKQIbvUAKiTaMzDHEhU8uBQjBzgAXjoda3RhMkUAAAAASUVORK5CYII=)`,
                    backgroundSize: '20px',
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'pixelated'
                }}
            />
        </div>
    );
};

interface MonkeyProps {
    children: React.ReactNode;
}

interface BarPosition {
    x: number;
    y: number;
}

const Monkey: React.FC<MonkeyProps> = ({ children }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const barsRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const barPositionsRef = useRef<BarPosition[]>([]);
    const currentIndexRef = useRef(0);
    const nearestIndexRef = useRef(0);
    const updatePendingRef = useRef(false);

    const [monkeyState, setMonkeyState] = useState({
        x: 0,
        y: 0,
        isReverse: false,
        isAlternate: false,
        isJumping: false,
        jumpHeight: '-50px',
        isChittering: false,
        chitterMessage: 'chitter' as 'chitter' | 'chatter'
    });

    const updateBarPositions = () => {
        if (updatePendingRef.current || !wrapperRef.current) return;
        updatePendingRef.current = true;

        requestAnimationFrame(() => {
            const positions: BarPosition[] = [];

            barsRef.current.forEach((bar) => {
                let top = bar.offsetTop;
                let left = bar.offsetLeft;
                let element = bar.offsetParent as HTMLElement;

                while (element && !element.classList.contains('monkey-wrapper')) {
                    top += element.offsetTop;
                    left += element.offsetLeft;
                    element = element.offsetParent as HTMLElement;
                }

                positions.push({
                    x: left + bar.offsetWidth / 2,
                    y: top + 5
                });
            });

            barPositionsRef.current = positions;

            if (positions.length > 0 && monkeyState.x === 0 && monkeyState.y === 0) {
                setMonkeyState(prev => ({
                    ...prev,
                    x: positions[0].x,
                    y: positions[0].y
                }));
            }

            updatePendingRef.current = false;
        });
    };

    const registerBar = (id: string, element: HTMLDivElement) => {
        barsRef.current.set(id, element);
        setTimeout(updateBarPositions, 50);
    };

    const unregisterBar = (id: string) => {
        barsRef.current.delete(id);
        setTimeout(updateBarPositions, 50);
    };

    useEffect(() => {
        const handleResize = () => updateBarPositions();
        window.addEventListener('resize', handleResize);
        setTimeout(updateBarPositions, 300);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const positions = barPositionsRef.current;
            if (positions.length === 0) return;

            const scrollY = window.scrollY + window.innerHeight / 2;
            const nearest = positions
                .map((pos, i) => ({ i, diff: Math.abs(pos.y - scrollY) }))
                .sort((a, b) => a.diff - b.diff)[0];

            if (nearest && nearest.i !== nearestIndexRef.current) {
                nearestIndexRef.current = nearest.i;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        setTimeout(handleScroll, 400);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const positions = barPositionsRef.current;
            const nearest = nearestIndexRef.current;
            const current = currentIndexRef.current;

            if (current === nearest || positions.length === 0) return;

            if (current > nearest && current > 0) {
                currentIndexRef.current--;
            } else if (current < nearest && current < positions.length - 1) {
                currentIndexRef.current++;
            }

            const targetPos = positions[currentIndexRef.current];
            if (!targetPos) return;

            setMonkeyState(prev => {
                const newIsReverse = prev.x > targetPos.x;
                const newIsAlternate = !prev.isAlternate;
                const jumpHeightCalc = (prev.y - targetPos.y) > 80
                    ? `${targetPos.y - prev.y - 10}px`
                    : '-50px';

                return {
                    ...prev,
                    x: targetPos.x,
                    y: targetPos.y,
                    isReverse: newIsReverse,
                    isAlternate: newIsAlternate,
                    isJumping: true,
                    jumpHeight: jumpHeightCalc
                };
            });

            setTimeout(() => {
                setMonkeyState(prev => ({ ...prev, isJumping: false }));
            }, 500);
        }, 700);

        return () => clearInterval(interval);
    }, []);

    // Random chittering effect
    useEffect(() => {
        const chitterInterval = setInterval(() => {
            // Random chance to chitter (similar rate to ducks)
            if (Math.random() < 0.3) {
                setMonkeyState(prev => ({
                    ...prev,
                    isChittering: true,
                    chitterMessage: prev.chitterMessage === 'chitter' ? 'chatter' : 'chitter'
                }));

                setTimeout(() => {
                    setMonkeyState(prev => ({ ...prev, isChittering: false }));
                }, 1500);
            }
        }, 3000);

        return () => clearInterval(chitterInterval);
    }, []);

    // Handle click to chitter
    const handleMonkeyClick = () => {
        setMonkeyState(prev => ({
            ...prev,
            isChittering: true,
            chitterMessage: prev.chitterMessage === 'chitter' ? 'chatter' : 'chitter'
        }));

        setTimeout(() => {
            setMonkeyState(prev => ({ ...prev, isChittering: false }));
        }, 1500);
    };

    return (
        <MonkeyBarContext.Provider value={{ registerBar, unregisterBar }}>
            <div ref={wrapperRef} className="monkey-wrapper relative min-h-screen">
                <div
                    className={`monkey ${monkeyState.isReverse ? 'reverse' : ''} ${monkeyState.isAlternate ? 'alternate' : ''
                        } ${monkeyState.isJumping ? 'jump' : ''} ${monkeyState.isChittering ? 'chitter' : ''}`}
                    style={{
                        transform: `translate(${monkeyState.x}px, ${monkeyState.y}px)`,
                    }}
                >
                    <div className="swing-wrapper">
                        <div className="body" onClick={handleMonkeyClick} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
                            <div className="anchor">
                                <div className={`speech-bubble ${tiny5.className}`}>
                                    {monkeyState.chitterMessage}
                                </div>
                            </div>
                            <div className="head">
                                <div
                                    className="face"
                                    style={{
                                        backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAAAAXNSR0IArs4c6QAAAHVJREFUOE+1k9sOwCAIQ9f//2gWiBCCuO7ifMKIB2gKjnRERPKdxQDgORY8BdQCCsRXSHT0C0hHvitTzY3Rkm4U1uXuB6loW0ZjnmHvSx913a06Nh95pc4GWdRh3KkxZ1yC2DhDV2ME6M2qTLtWKzO3Z4D/PQHES1jzyue2wwAAAABJRU5ErkJggg==)',
                                        backgroundSize: '10px 9px',
                                        backgroundRepeat: 'no-repeat',
                                        imageRendering: 'pixelated' as const
                                    }}
                                ></div>
                            </div>
                            <div className="shoulder">
                                <div className="joint left">
                                    <div className="arm">
                                        <div className="joint"></div>
                                        <div className="joint elbow">
                                            <div className="arm"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="joint right">
                                    <div className="arm">
                                        <div className="joint"></div>
                                        <div className="joint elbow">
                                            <div className="arm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="waist">
                                <div className="joint">
                                    <div className="thigh">
                                        <div className="joint knee">
                                            <div className="leg"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tail-joint">
                                    <div className="tail">
                                        <div className="joint">
                                            <div className="tail">
                                                <div className="joint">
                                                    <div className="tail">
                                                        <div className="joint">
                                                            <div className="tail"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="joint right-leg">
                                    <div className="thigh">
                                        <div className="joint knee">
                                            <div className="leg"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {children}

                <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          .monkey-wrapper {
            position: relative;
            width: 100%;
          }

          .monkey-bar {
            display: inline-block;
          }

          .monkey {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 50;
            pointer-events: none;
            transition: 0.7s;
            width: 10px;
            height: 10px;
            transform: translateX(44px);
            --m: 1;
            --left-shoulder-angle: 40deg;
            --right-shoulder-angle: -170deg;
            --left-shoulder-pos: 0px;
            --right-shoulder-pos: calc(var(--m) * 30px);
            --left-elbow-angle: -50deg;
            --right-elbow-angle: -20deg;
            --waist-joint-angle: -45deg;
            --tail-angle: 12deg;
            --tail-base-angle: 40deg;
            --jump-height: 50px;
          }

          .monkey.reverse:not(.alternate) {
            --left-shoulder-angle: 10deg;
            --right-shoulder-angle: 140deg;
            --left-elbow-angle: 50deg;
            --right-elbow-angle: 30deg;
            --waist-joint-angle: 45deg;
            --tail-angle: -12deg;
            --tail-base-angle: -40deg;
          }

          .monkey.alternate {
            --left-shoulder-angle: -140deg;
            --right-shoulder-angle: -20deg;
            --left-elbow-angle: -30deg;
            --right-elbow-angle: -20deg;
          }

          .monkey.alternate.reverse {
            --left-shoulder-angle: 170deg;
            --right-shoulder-angle: -40deg;
            --left-elbow-angle: 20deg;
            --right-elbow-angle: 50deg;
            --waist-joint-angle: 45deg;
            --tail-angle: -12deg;
            --tail-base-angle: -40deg;
          }

          .swing-wrapper {
            width: 10px;
            height: 10px;
            animation: swing ease-in-out infinite 3s;
          }

          @keyframes swing {
            0%, 100% {
              transform: rotate(-3deg);
            }
            50% {
              transform: rotate(3deg);
            }
          }

          .monkey * {
            position: absolute;
            transition: 0.7s;
            background-size: calc(var(--w) * var(--m)) calc(var(--h) * var(--m)) !important;
            width: calc(var(--w) * var(--m));
            height: calc(var(--h) * var(--m));
            background-repeat: no-repeat !important;
            image-rendering: pixelated;
          }

          .monkey .speech-bubble,
          .monkey .anchor {
            transition: none;
            background-size: 100%;
            width: auto;
            height: auto;
            background-repeat: repeat;
            image-rendering: none;
          }

          .left {
            rotate: var(--left-shoulder-angle);
            translate: var(--left-shoulder-pos) 0;
            z-index: 5;
          }

          .reverse .left {
            z-index: -5;
          }

          .reverse .right {
            z-index: 5;
          }

          .right {
            rotate: var(--right-shoulder-angle);
            translate: var(--right-shoulder-pos) 0;
            z-index: -5;
          }

          .elbow {
            bottom: 0;
          }

          .left .elbow {
            rotate: var(--left-elbow-angle);
          }

          .right .elbow {
            rotate: var(--right-elbow-angle);
          }

          .waist > .joint {
            rotate: var(--waist-joint-angle);
          }

          .knee {
            bottom: 0;
            rotate: calc(var(--waist-joint-angle) * -2);
          }

          .body {
            --w: 30px;
            --h: 30px;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAIZJREFUSEtjZEADG1rN/qOLUYMfUH2KEdkcOIdWFqI7GuYAsMX0shTmCJDlA2cxvX0L8zXjqMXUyDrEmDEa1MSEElXUjAY1VYKRGENGg5qYUKKKmtGgpkowEmPICAzqkdfmGlAf09NylHb1gFpMD8uRuzEo/RlaWo6z74Rc2lC7rY1uKcguAOOsW5NYqXbPAAAAAElFTkSuQmCC);
          }

          .anchor {
            position: absolute;
            left: 50%;
            top: -30px;
            transform: translateX(-50%);
            width: 0px;
            height: 0px;
            display: flex;
            align-items: end;
            z-index: 999;
          }

          .speech-bubble {
            position: absolute;
            bottom: calc(var(--m) * 20px);
            left: 50%;
            transform: translateX(-50%);
            background-color: #FFF;
            padding: 3px 12px 1px 12px;
            border: 1.5px dashed #000;
            border-radius: 8px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            z-index: 999;
          }

          .speech-bubble::after {
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

          .speech-bubble::before {
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

          .monkey.chitter .speech-bubble {
            opacity: 1;
            animation: fade-in-monkey 0.1s;
          }

          @keyframes fade-in-monkey {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(3px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }

          .head {
            top: calc(var(--m) * -12px);
            left: calc(var(--m) * 6px);
            --w: 22px;
            --h: 22px;
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            image-rendering: pixelated;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAGtJREFUSEtjZMACNrSa/ccmjkssoPoUI7ocigCpBqIbhmwB3GBKDYVZAjMcbDC1DEU2nJHahsIMHzUYnlBGg2I0KDCLpyGYKmhWCNHUYGoajlIew+KU0iIUaw2CnGBItYBgnUeO4dgMBZkDAArwRQ8BLYjYAAAAAElFTkSuQmCC);
          }

          .face {
            top: calc(var(--m) * 4px);
            left: calc(var(--m) * 5px);
            --w: 18px;
            --h: 14px;
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            image-rendering: pixelated;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAGtJREFUSEtjZMACNrSa/ccmjkssoPoUI7ocigCpBqIbhmwB3GBKDQVZAjMcbDC1DEU2nJHahsIMHzUYnlBGg2I0KDCLpyGYKmhWCNHUYGoajlIew+KU0iIUaw2CnGBItYBgnUeO4dgMBZkDAArwRQ8BLYjYAAAAAElFTkSuQmCC);
          }

          .reverse .face {
            left: 0px;
          }

          .shoulder {
            width: calc(100% + (calc(var(--m) * 10px)));
            top: 0;
            left: calc(var(--m) * -5px);
            height: calc(var(--m) * 10px);
          }

          .waist {
            height: calc(var(--m) * 10px);
            bottom: 0;
            width: 100%;
          }

          .right-leg {
            right: 0;
          }

          .thigh,
          .leg {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAUCAYAAAC07qxWAAAAAXNSR0IArs4c6QAAADhJREFUOE9jZICCDa1m/2FsZDqg+hQjiA8mcCmCaQApZiSkCKZ4VCG28IaLjQYPlYKH6IRLbFYAAGcMNrX4mA6GAAAAAElFTkSuQmCC);
            --w: 10px;
            --h: 20px;
          }

          .joint {
            width: calc(var(--m) * 10px);
            height: calc(var(--m) * 10px);
          }

          .arm {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAZCAYAAAAIcL+IAAAAAXNSR0IArs4c6QAAADpJREFUOE9jZICCDa1m/2FsZDqg+hQjiA8mcCmCaQApZiSkCKZ4VCG28IaLjQbPaPBghADxuZDYfA0AXddCzD8VHloAAAAASUVORK5CYII=);
            --w: 10px;
            --h: 25px;
          }

          .monkey.jump .body {
            animation: jump-up forwards 0.35s;
          }

          @keyframes jump-up {
            0%, 100% {
              translate: 0;
            }
            70% {
              translate: 0 calc(var(--m) * var(--jump-height));
            }
          }

          .monkey .body {
            top: calc(var(--m) * 30px);
            left: calc(var(--m) * -28px);
          }

          .monkey.alternate .body {
            top: calc(var(--m) * 28px);
            left: calc(var(--m) * -10px);
          }

          .monkey.reverse .body {
            top: calc(var(--m) * 28px);
            left: calc(var(--m) * -15px);
          }

          .monkey.reverse.alternate .body {
            top: calc(var(--m) * 30px);
            left: calc(var(--m) * 0px);
          }

          .tail-joint {
            width: calc(4px * var(--m));
            height: calc(4px * var(--m));
            bottom: 0;
            left: 2px;
            transform: rotate(var(--tail-base-angle));
          }

          .tail-joint .joint {
            width: calc(4px * var(--m));
            height: calc(4px * var(--m));
            bottom: 0;
            transform: rotate(var(--tail-angle));
          }

          .reverse .tail-joint {
            left: calc(28px * var(--m));
          }

          .tail {
            width: calc(4px * var(--m));
            height: calc(12px * var(--m));
            background-color: #b08536;
          }
        `}</style>
            </div>
        </MonkeyBarContext.Provider>
    );
};

export default Monkey;
