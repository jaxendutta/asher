"use client";

import React, { useEffect, useRef, useState } from 'react';

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
    const [catPosition, setCatPosition] = useState({ left: 100, top: -30 });

    const posRef = useRef({ x: null as number | null, y: null as number | null });

    useEffect(() => {
        legsRef.current = document.querySelectorAll('.leg');

        const walk = () => {
            setIsFirstPose(false);
            setIsWalking(true);
        };

        const handleMouseMotion = (e: MouseEvent) => {
            posRef.current.x = e.clientX;
            posRef.current.y = e.clientY;
            walk();
        };

        const handleTouchMotion = (e: TouchEvent) => {
            if (!e.targetTouches) return;
            const touch = e.targetTouches[0];
            posRef.current.x = touch.clientX;
            posRef.current.y = touch.clientY;
            walk();
        };

        const decideTurnDirection = () => {
            if (!catRef.current || posRef.current.x === null) return;

            const catX = catRef.current.getBoundingClientRect().x;
            if (catX < posRef.current.x) {
                setCatPosition(prev => ({ ...prev, left: posRef.current.x! - 90 }));
                setIsFaceLeft(false);
                setIsFaceRight(true);
            } else {
                setCatPosition(prev => ({ ...prev, left: posRef.current.x! + 10 }));
                setIsFaceRight(false);
                setIsFaceLeft(true);
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

            if ((isFaceRight && posRef.current.x - 90 === catRef.current.offsetLeft) ||
                (isFaceLeft && posRef.current.x + 10 === catRef.current.offsetLeft)) {
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

        return () => {
            clearInterval(motionInterval);
            clearInterval(jumpInterval);
            document.removeEventListener('mousemove', handleMouseMotion);
            document.removeEventListener('touchmove', handleTouchMotion);
        };
    }, [isFaceLeft, isFaceRight]);

    return (
        <>
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
          z-index: 1000;
        }
        .cat-wrapper-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          pointer-events: all;
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
        .face_right .front-legs{ right: 0; }
        .first_pose .front-legs,
        .face_left .front-legs{ right: 30px; }
        .face_right .back-legs{ left: 0; }
        .first_pose .back-legs,
        .face_left .back-legs{ left: 35px; }
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
          fill: #e89b5c;
        }
        .cat-svg polygon.cat-eyes {
          fill: #2d2d2d;
        }
      `}</style>

            <div className="cat-outer-wrapper">
                <div className="cat-wrapper-container" ref={wrapperRef}>
                    <div
                        className={`cat_wrapper ${isJumping ? 'jump' : ''}`}
                        ref={catWrapperRef}
                    >
                        <div
                            className={`cat ${isFirstPose ? 'first_pose' : ''} ${isFaceLeft ? 'face_left' : ''} ${isFaceRight ? 'face_right' : ''}`}
                            ref={catRef}
                            style={{ left: `${catPosition.left}px` }}
                        >
                            <div
                                className="cat-head"
                                ref={headRef}
                                style={{ top: `${catPosition.top}px` }}
                            >
                                <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 76.4 61.2">
                                    <polygon className="cat-eyes" points="63.8,54.1 50.7,54.1 50.7,59.6 27.1,59.6 27.1,54.1 12.4,54.1 12.4,31.8 63.8,31.8 " />
                                    <path d="M15.3,45.9h5.1V35.7h-5.1C15.3,35.7,15.3,45.9,15.3,45.9z M45.8,56.1V51H30.6v5.1H45.8z M61.1,35.7H56v10.2h5.1
                    V35.7z M10.2,61.2v-5.1H5.1V51H0V25.5h5.1V15.3h5.1V5.1h5.1V0h5.1v5.1h5.1v5.1h5.1v5.1c0,0,15.2,0,15.2,0v-5.1h5.1V5.1H56V0h5.1v5.1
                    h5.1v10.2h5.1v10.2h5.1l0,25.5h-5.1v5.1h-5.1v5.1H10.2z"/>
                                </svg>
                            </div>

                            <div className="cat-body">
                                <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 91.7 40.8">
                                    <path d="M91.7,40.8H0V10.2h5.1V5.1h5.1V0h66.2v5.1h10.2v5.1h5.1L91.7,40.8z" />
                                </svg>
                                <div className="cat-tail">
                                    <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 25.5 61.1">
                                        <polygon points="10.2,56 10.2,50.9 5.1,50.9 5.1,40.7 0,40.7 0,20.4 5.1,20.4 5.1,10.2 10.2,10.2 10.2,5.1 15.3,5.1 
                      15.3,0 25.5,0 25.5,10.2 20.4,10.2 20.4,15.3 15.3,15.3 15.3,20.4 10.2,20.4 10.2,40.7 15.3,40.7 15.3,45.8 20.4,45.8 20.4,50.9 
                      25.5,50.9 25.5,61.1 15.3,61.1 15.3,56 "/>
                                    </svg>
                                </div>
                            </div>

                            <div className="front-legs">
                                <div className={`leg one ${isWalking ? 'walk' : ''}`}>
                                    <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                                        <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " />
                                    </svg>
                                </div>
                                <div className={`leg two ${isWalking ? 'walk' : ''}`}>
                                    <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                                        <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " />
                                    </svg>
                                </div>
                            </div>

                            <div className="back-legs">
                                <div className={`leg three ${isWalking ? 'walk' : ''}`}>
                                    <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                                        <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " />
                                    </svg>
                                </div>
                                <div className={`leg four ${isWalking ? 'walk' : ''}`}>
                                    <svg className="cat-svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5">
                                        <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cat-ground"></div>
            </div>
        </>
    );
};

export default Cat;