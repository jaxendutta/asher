"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { tiny5 } from '@/lib/fonts';

const Cat: React.FC = () => {
    const catWrapperRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const catRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const legsRef = useRef<NodeListOf<HTMLDivElement> | null>(null);

    const [isFirstPose, setIsFirstPose] = useState(true);
    const [isFaceLeft, setIsFaceLeft] = useState(false);
    const [isFaceRight, setIsFaceRight] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [isWalking, setIsWalking] = useState(false);
    const [isMeowing, setIsMeowing] = useState(false);
    const [isPurring, setIsPurring] = useState(false);
    const [catPosition, setCatPosition] = useState({ left: 100, top: -30 });
    const [isAutoMode, setIsAutoMode] = useState(false);

    const posRef = useRef({ x: null as number | null, y: null as number | null });
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
    const autoWalkTimerRef = useRef<NodeJS.Timeout | null>(null);
    const meowTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Meow function
    const meow = () => {
        if (isMeowing) return;
        setIsMeowing(true);

        setTimeout(() => {
            setIsMeowing(false);

            // Schedule next meow randomly
            const nextMeowDelay = Math.random() * 1000 + 1000; // 1-2 seconds
            meowTimerRef.current = setTimeout(meow, nextMeowDelay);
        }, 1000); // Meow displays for 1 second
    };

    // Purr function - triggered by clicking
    const purr = () => {
        if (isPurring || isMeowing) return; // Don't purr if already purring or meowing

        setIsPurring(true);

        setTimeout(() => {
            setIsPurring(false);
        }, 1500); // Purr displays for 1.5 seconds
    };

    // Handle cat click
    const handleCatClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling
        purr();
    };

    useEffect(() => {
        legsRef.current = document.querySelectorAll('.leg');

        const walk = () => {
            setIsFirstPose(false);
            setIsWalking(true);
        };

        const resetInactivityTimer = () => {
            // Clear existing timer
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
            // Stop auto mode when user interacts
            setIsAutoMode(false);
            // Set new inactivity timer
            inactivityTimerRef.current = setTimeout(() => {
                setIsAutoMode(true);
            }, 2000);
        };

        const handleMouseMotion = (e: MouseEvent) => {
            posRef.current.x = e.clientX;
            posRef.current.y = e.clientY;
            walk();
            resetInactivityTimer();
        };

        const handleTouchMotion = (e: TouchEvent) => {
            if (!e.targetTouches) return;
            const touch = e.targetTouches[0];
            posRef.current.x = touch.clientX;
            posRef.current.y = touch.clientY;
            walk();
            resetInactivityTimer();
        };

        const decideTurnDirection = () => {
            if (!catRef.current || posRef.current.x === null) return;
            const catX = catRef.current.getBoundingClientRect().x;
            const targetX = posRef.current.x;
            const currentLeft = catRef.current.offsetLeft;
            if (catX < targetX) {
                const newLeft = targetX - 90;
                setCatPosition(prev => ({ ...prev, left: newLeft }));
                setIsFaceLeft(false);
                setIsFaceRight(true);
                // Only walk if we're not at the target yet
                if (Math.abs(currentLeft - newLeft) > 5) {
                    setIsWalking(true);
                }
            } else if (catX > targetX) {
                const newLeft = targetX + 10;
                setCatPosition(prev => ({ ...prev, left: newLeft }));
                setIsFaceRight(false);
                setIsFaceLeft(true);
                // Only walk if we're not at the target yet
                if (Math.abs(currentLeft - newLeft) > 5) {
                    setIsWalking(true);
                }
            }
        };

        const headMotion = () => {
            if (!wrapperRef.current || !headRef.current || posRef.current.y === null) return;
            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const relativeY = posRef.current.y - wrapperRect.top;
            if (relativeY > 250) {
                setCatPosition(prev => ({ ...prev, top: -15 }));
            } else {
                setCatPosition(prev => ({ ...prev, top: -30 }));
            }
        };

        const decideStop = () => {
            if (!catRef.current || posRef.current.x === null) return;
            const currentLeft = catRef.current.offsetLeft;
            const targetLeft = isFaceRight ? posRef.current.x - 90 : posRef.current.x + 10;
            // Stop walking when within 5 pixels of target
            if (Math.abs(currentLeft - targetLeft) < 5) {
                setIsWalking(false);
            }
        };

        const jump = () => {
            if (!wrapperRef.current || posRef.current.y === null) return;

            setIsJumping(false);
            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const relativeY = posRef.current.y - wrapperRect.top;

            if (relativeY < 80) {
                setTimeout(() => {
                    setIsJumping(true);
                }, 100);
            }
        };

        const motionInterval = setInterval(() => {
            if (!posRef.current.x || !posRef.current.y) return;
            decideTurnDirection();
            headMotion();
            decideStop();
        }, 100);

        const jumpInterval = setInterval(() => {
            if (!posRef.current.x || !posRef.current.y) return;
            jump();
        }, 1000);

        document.addEventListener('mousemove', handleMouseMotion);
        document.addEventListener('touchmove', handleTouchMotion);

        // Start inactivity timer and initial meow timer
        resetInactivityTimer();

        // Start meowing after a longer delay
        const initialMeowDelay = Math.random() * 1000 + 5000; // 5-6 seconds
        meowTimerRef.current = setTimeout(meow, initialMeowDelay);

        return () => {
            clearInterval(motionInterval);
            clearInterval(jumpInterval);

            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }

            if (autoWalkTimerRef.current) {
                clearTimeout(autoWalkTimerRef.current);
            }

            if (meowTimerRef.current) {
                clearTimeout(meowTimerRef.current);
            }

            document.removeEventListener('mousemove', handleMouseMotion);
            document.removeEventListener('touchmove', handleTouchMotion);
        };
    }, [isFaceLeft, isFaceRight, isMeowing]);

    // Trigger auto-walk when entering auto mode
    useEffect(() => {
        if (isAutoMode) {
            // Start continuous auto-walking
            const autoWalk = () => {
                if (!isAutoMode || !wrapperRef.current || !catRef.current) return;
                const maxX = window.innerWidth - 150;
                const minX = 100;
                const randomX = Math.random() * (maxX - minX) + minX;
                const wrapperRect = wrapperRef.current.getBoundingClientRect();
                const randomY = wrapperRect.top + Math.random() * wrapperRect.height;
                // Set new target position
                posRef.current.x = randomX;
                posRef.current.y = randomY;
                const nextDelay = Math.random() * 3000 + 2000; // 2-5 seconds between walks
                autoWalkTimerRef.current = setTimeout(autoWalk, nextDelay);
            };

            // Start first auto-walk immediately
            autoWalk();
        } else {
            if (autoWalkTimerRef.current) {
                clearTimeout(autoWalkTimerRef.current);
            }
        }
        return () => {
            if (autoWalkTimerRef.current) {
                clearTimeout(autoWalkTimerRef.current);
            }
        };
    }, [isAutoMode]);

    return (
        <>
            {/* Cat tree in bottom right corner */}
            <Image
                src="/images/objects/cat_tree.png"
                alt="Cat Tree"
                className="fixed bottom-2 right-0 z-40 pointer-events-none brightness-105"
                width={105}
                height={105}
            />

            <style>{`
        * {
          box-sizing: border-box;
        }
        
        .cat-outer-wrapper {
          position: fixed;
          width: 100%;
          height: 400px;
          bottom: 0;
          left: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 50;
        }

        .cat-wrapper-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          pointer-events: none;
        }
        
        .cat-ground {
          display: none;
        }
        
        .cat {
          position: absolute;
          bottom: 20px;
          height: 30px;
          width: 60px;
          transition: 1.5s;
          transform-origin: center;
          background-color: transparent;
        }
        
        .cat-body {
          position: absolute;
          height: 30px;
          width: 60px;
          pointer-events: auto;
          cursor: pointer;
        }
        
        .face_left .cat-body { 
          animation: turn_body_left forwards 0.5s;
        }
        
        @keyframes turn_body_left {
          0%,100% { transform: scale(1); }
          50% { transform: scale(0.5, 1); }
        }
        
        .face_right .cat-body {
          animation: turn_body_right forwards 0.5s;
        }
        
        @keyframes turn_body_right {
          0%,100% { transform: scale(1); }
          50% { transform: scale(0.5, 1); }
        }
        
        .cat-head {
          position: absolute;
          height: 40px;
          width: 48px;
          right: -10px;
          transition: 0.5s;
          z-index: 50;
          pointer-events: auto;
          cursor: pointer;
        }
        
        .first_pose .cat-head,
        .face_left .cat-head{ 
          right: 22px;
        }
        
        .cat-tail {
          position: absolute;
          top: -25px;
          height: 36px;
          width: 15px;
          animation: tail_motion forwards 2s;
          transform-origin: bottom right;
        }
        
        @keyframes tail_motion {
          0%,100% { 
            left: -5px;
            transform: rotate(0deg) scale(1); 
          }
          50% { 
            left: -10px;
            transform: rotate(-50deg) scale(-1,1); 
          }
        }
        
        .first_pose .cat-tail,
        .face_left .cat-tail {
          left: 45px;
          animation: tail_motion_alt forwards 2s;
        }
        
        @keyframes tail_motion_alt {
          0%,100% { 
            left: 45px;
            transform: rotate(0deg) scale(1); 
          }
          50% { 
            left: 40px;
            transform: rotate(50deg) scale(-1,1); 
          }
        }
        
        .leg {
          position: absolute;
          height: 20px;
          width: 10px;
          transform-origin: top center;
        }
        
        .front-legs,
        .back-legs {
          position: absolute;
          height: 30px;
          transition: 0.7s;
        }
        
        .front-legs {
          width: 30px;
          right: 0;
        }
        
        .back-legs {
          width: 25px;
          left: 0; 
        }
        
        .face_left .leg svg {
          transform: scale(-1,1);
        }
        
        .face_right .front-legs {
          right: 0;
        }

        .first_pose .front-legs,
        .face_left .front-legs { 
          right: 30px; 
        }

        .face_right .back-legs {
          left: 0;
        }
        
        .first_pose .back-legs,
        .face_left .back-legs {
          left: 35px; 
        }
        
        .leg.one,
        .leg.three  {
          bottom: -15px;
          right: 0;
        }
        
        .leg.two, 
        .leg.four {
          bottom: -15px;
          left: 0px;
        }
        
        .leg.one.walk, 
        .leg.three.walk {
          animation: infinite 0.3s walk;
        }
        
        .leg.two.walk, 
        .leg.four.walk {
          animation: infinite 0.3s walk_alt;
        }
        
        @keyframes walk {
          0%,100% {transform: rotate(-10deg);}
          50% {transform: rotate(10deg);}
        }
        
        @keyframes walk_alt {
          0%,100% {transform: rotate(10deg);}
          50% {transform: rotate(-10deg);}
        }
        
        .cat_wrapper {
          position: absolute;
          bottom: 0;
        }
        
        .cat_wrapper.jump .leg.one { 
          animation: infinite 0.3s walk;
        }
        
        .cat_wrapper.jump .leg.two { 
          animation: infinite 0.3s walk_alt;
        }
        
        .cat_wrapper.jump .leg.three,
        .cat_wrapper.jump .leg.four {
          animation: none;
        }
        
        .cat_wrapper.jump .cat.face_right .back-legs {
          transform-origin: center;
          transform: rotate(50deg);
        }
       
        .cat_wrapper.jump .cat.face_left .back-legs {
          transform-origin: center;
          transform: rotate(-50deg);
        }
        
        .cat_wrapper.jump .cat.face_right .front-legs {
          transform-origin: center;
          transform: rotate(-60deg);
        }
        
        .cat_wrapper.jump .cat.face_left .front-legs {
          transform-origin: center;
          transform: rotate(60deg);
        }
        
        .cat_wrapper.jump{
          animation: jump forwards 1s;
        }
        
        @keyframes jump {
          0%, 100%  {bottom: 0px;}
          50% {bottom: 200px;}
        }
        
        .jump .face_left{ 
          animation: forwards 0.5s body_stand_left;
          transform-origin: right bottom;
        }
        
        .jump .face_right{ 
          animation: forwards 0.5s body_stand_right;
          transform-origin: left bottom;
        }
        
        @keyframes body_stand_right {
          0% {transform: rotate(0deg);}
          100% {transform: rotate(-45deg);}
        }
        
        @keyframes body_stand_left {
          0% {transform: rotate(0deg);}
          100% {transform: rotate(45deg);}
        }
        
        .cat-svg {
          height: 100%;
          width: 100%;
        }
        
        .cat-svg polygon,
        .cat-svg path {
          fill: #ffa962ff;
        }
        
        .cat-svg .cat-head-fill {
          fill: #ffa962ff;
          stroke: #d17020ff;
          stroke-width: 0.25;
        }
        
        .cat-svg .cat-body-fill {
          fill: #ffa962ff;
          stroke: #d17020ff;
          stroke-width: 0.25;
        }
        
        .cat-svg .cat-stripe {
          fill: #d68742;
        }
        
        .cat-svg .cat-inner-ear {
          fill: #ffb3ba;
        }
        
        .cat-svg .cat-mouth {
          stroke:#000;
          stroke-width: 3;
          fill: none;
        }
        
        .cat-svg polygon.cat-eyes {
          fill: #2d2d2d;
        }

        /* Speech bubble for cat */
        .cat-speech-anchor {
          position: absolute;
          left: 50%;
          top: -35px;
          transform: translateX(-50%);
          width: 0px;
          height: 0px;
          display: flex;
          justify-content: center;
          align-items: end;
        }

        .cat-speech-bubble {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #FFF;
          padding: 3px 10px 1px 10px;
          border: 1px dashed #000;
          border-radius: 8px;
          font-size: 14px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          z-index: 999;
        }

        .cat-speech-bubble::after {
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

        .cat-speech-bubble::before {
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

        .cat_wrapper.meow .cat-speech-bubble.meow-bubble {
          opacity: 1;
          animation: fade-in-cat 0.2s;
        }

        .cat_wrapper.purr .cat-speech-bubble.purr-bubble {
          opacity: 1;
          animation: fade-in-cat 0.2s;
        }

        @keyframes fade-in-cat {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        .yarn-ball {
          position: fixed;
          bottom: 10px;
          left: 12px;
          width: 40px;
          height: 40px;
          z-index: 50;
          pointer-events: none;
        }
        
        .yarn-ball svg {
          width: 100%;
          height: 100%;
        }
      `}</style>
            {/* Cat Component */}
            <div className="cat-outer-wrapper">
                <div className="cat-wrapper-container" ref={wrapperRef}>
                    <div className={`cat_wrapper ${isJumping ? 'jump' : ''} ${isMeowing ? 'meow' : ''} ${isPurring ? 'purr' : ''}`} ref={catWrapperRef}>
                        <div
                            className={`cat ${isFirstPose ? 'first_pose' : ''} ${isFaceLeft ? 'face_left' : ''} ${isFaceRight ? 'face_right' : ''}`}
                            ref={catRef}
                            style={{ left: `${catPosition.left}px` }}
                        >
                            <div className="cat-speech-anchor">
                                <div className={`cat-speech-bubble meow-bubble ${tiny5.className}`}>meow</div>
                                <div className={`cat-speech-bubble purr-bubble ${tiny5.className}`}>purr</div>
                            </div>
                            <div
                                className="cat-head"
                                ref={headRef}
                                style={{ top: `${catPosition.top}px` }}
                                onClick={handleCatClick}
                            >
                                <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 76.4 61.2">
                                    <rect className="cat-eyes" x="0" y="30" width="75" height="20" />
                                    <path d="M15.3,45.9h5.1V35.7h-5.1C15.3,35.7,15.3,45.9,15.3,45.9z M45.8,56.1V51H30.6v5.1H45.8z M61.1,35.7H56v10.2h5.1
                    V35.7z M10.2,61.2v-5.1H5.1V51H0V25.5h5.1V15.3h5.1V5.1h5.1V0h5.1v5.1h5.1v5.1h5.1v5.1c0,0,15.2,0,15.2,0v-5.1h5.1V5.1H56V0h5.1v5.1
                    h5.1v10.2h5.1v10.2h5.1l0,25.5h-5.1v5.1h-5.1v5.1H10.2z"/>


                                    {/* Stripes on head */}
                                    <rect className="cat-stripe" x="29.6" y="15" width="4" height="10.4" />
                                    <rect className="cat-stripe" x="37.3" y="15" width="4" height="10.4" />
                                    <rect className="cat-stripe" x="45.9" y="15" width="4" height="10.4" />

                                    {/* Inner ears (pink) */}
                                    <rect className="cat-inner-ear" x="15.3" y="10.2" width="5.1" height="5.1" />
                                    <rect className="cat-inner-ear" x="56" y="10.2" width="5.1" height="5.1" />

                                    {/* W-shaped mouth */}
                                    <path
                                        className="cat-mouth"
                                        d="M38,48 v6 l-3,2 m3,-2 l3,2"
                                        fill="none"
                                        stroke="#000"
                                        strokeWidth="1"
                                        strokeLinecap="square"
                                    />
                                </svg>
                            </div>
                            <div className="cat-body" onClick={handleCatClick}>
                                <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 91.7 40.8">
                                    {/* Body with border */}
                                    <path className="cat-body-fill" d="M91.7,40.8H0V10.2h5.1V5.1h5.1V0h66.2v5.1h10.2v5.1h5.1L91.7,40.8z" />

                                    {/* Stripes on the back */}
                                    <rect className="cat-stripe" x="20.4" y="5.1" width="5.1" height="30.6" />
                                    <rect className="cat-stripe" x="35.7" y="5.1" width="5.1" height="30.6" />
                                    <rect className="cat-stripe" x="51" y="5.1" width="5.1" height="30.6" />
                                    <rect className="cat-stripe" x="66.3" y="5.1" width="5.1" height="30.6" />
                                </svg>
                                <div className="cat-tail">
                                    <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 25.5 61.1">
                                        <polygon points="10.2,56 10.2,50.9 5.1,50.9 5.1,40.7 0,40.7 0,20.4 5.1,20.4 5.1,10.2 10.2,10.2 10.2,5.1 15.3,5.1 
                      15.3,0 25.5,0 25.5,10.2 20.4,10.2 20.4,15.3 15.3,15.3 15.3,20.4 10.2,20.4 10.2,40.7 15.3,40.7 15.3,45.8 20.4,45.8 20.4,50.9 
                      25.5,50.9 25.5,61.1 15.3,61.1 15.3,56 " stroke="#d17020ff" strokeWidth="0.25" />
                                    </svg>
                                </div>
                            </div>
                            <div className="front-legs">
                                <div className={`leg one ${isWalking ? 'walk' : ''}`}>
                                    <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                                        <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0" stroke="#d17020ff" strokeWidth="0.25" />
                                    </svg>
                                </div>
                                <div className={`leg two ${isWalking ? 'walk' : ''}`}>
                                    <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                                        <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0" stroke="#d17020ff" strokeWidth="0.25" />
                                    </svg>
                                </div>
                            </div>
                            <div className="back-legs">
                                <div className={`leg three ${isWalking ? 'walk' : ''}`}>
                                    <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                                        <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0" stroke="#d17020ff" strokeWidth="0.25" />
                                    </svg>
                                </div>
                                <div className={`leg four ${isWalking ? 'walk' : ''}`}>
                                    <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                                        <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0" stroke="#d17020ff" strokeWidth="0.25" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cat-ground"></div>
            </div>

            {/* Yarn ball in bottom left corner */}
            <div className="yarn-ball">
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    {/* Main ball body */}
                    <rect x="6" y="4" width="8" height="2" fill="#d64545" />
                    <rect x="4" y="6" width="12" height="2" fill="#d64545" />
                    <rect x="3" y="8" width="14" height="2" fill="#c93636" />
                    <rect x="2" y="10" width="16" height="2" fill="#d64545" />
                    <rect x="3" y="12" width="14" height="2" fill="#c93636" />
                    <rect x="4" y="14" width="12" height="2" fill="#d64545" />
                    <rect x="6" y="16" width="8" height="2" fill="#c93636" />
                    {/* Yarn strand wrapping */}
                    <rect x="8" y="4" width="2" height="2" fill="#e85555" />
                    <rect x="10" y="6" width="2" height="2" fill="#e85555" />
                    <rect x="12" y="8" width="2" height="2" fill="#e85555" />
                    <rect x="5" y="10" width="2" height="2" fill="#e85555" />
                    <rect x="7" y="12" width="2" height="2" fill="#e85555" />
                    <rect x="9" y="14" width="2" height="2" fill="#e85555" />
                    {/* Loose yarn strand */}
                    <rect x="15" y="18" width="2" height="2" fill="#d64545" />
                    <rect x="17" y="16" width="2" height="2" fill="#d64545" />
                    <rect x="16" y="14" width="2" height="2" fill="#d64545" />
                </svg>
            </div>
        </>
    );
};

export default Cat;
