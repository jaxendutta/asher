'use client';

// ============================================================================
// Hamster Component
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import { tiny5 } from '@/lib/fonts';

const Hamster = () => {
    const [speedFactor, setSpeedFactor] = useState(3);
    const [isRunning, setIsRunning] = useState(true);
    const [isSpinning, setIsSpinning] = useState(false);
    const [isSqueaking, setIsSqueaking] = useState(false);
    const energyRef = useRef(1000);

    // Energy depletion effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (isRunning) {
                energyRef.current -= speedFactor * speedFactor;
            }

            if (isRunning && energyRef.current < 0) {
                setIsRunning(false);
                setIsSpinning(true);

                setTimeout(() => {
                    energyRef.current = 1000;
                    setIsRunning(true);
                    setIsSpinning(false);
                }, 6000);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isRunning, speedFactor]);

    // Random squeaking effect (only when not spinning)
    useEffect(() => {
        if (isSpinning) return;

        const randomSqueak = () => {
            const randomDelay = Math.random() * 8000 + 4000; // Random between 4-12 seconds

            const timeout = setTimeout(() => {
                triggerSqueak();
                randomSqueak();
            }, randomDelay);

            return timeout;
        };

        const timeout = randomSqueak();
        return () => clearTimeout(timeout);
    }, [isSpinning]);

    const triggerSqueak = () => {
        if (isSpinning) return;

        setIsSqueaking(true);
        setTimeout(() => {
            setIsSqueaking(false);
        }, 1000);
    };

    const handleHamsterClick = () => {
        triggerSqueak();
    };

    const hamsterSpeed = `${0.75 / speedFactor}s`;
    const wheelSpeed = `${2 / speedFactor}s`;
    const wheelAngle = `${0.4 * speedFactor}deg`;

    return (
        <>
            <div className="hamster-wrapper" style={{
                '--hamster-speed': hamsterSpeed,
                '--wheel-speed': wheelSpeed,
                '--wheel-angle': wheelAngle,
            } as React.CSSProperties}>
                <div className="wheel-frame pix">
                    <div className={`wheel ${isSpinning ? 'spinning' : ''}`}>
                        <div className="wheel-support pix"></div>
                        <div
                            className={`hamster puff pix ${isSqueaking ? 'squeak' : ''}`}
                            onClick={handleHamsterClick}
                        >
                            <div className="hamster-speech-anchor">
                                <div className={`hamster-speech-bubble ${tiny5.className}`}>squeak</div>
                            </div>
                            <div className="ear pix"></div>
                            <div className="head puff pix"></div>
                            <div className="bum puff pix"></div>
                        </div>
                    </div>
                </div>
                <input
                    type="range"
                    name="speed"
                    min="0"
                    max="11"
                    value={speedFactor}
                    onChange={(e) => setSpeedFactor(Number(e.target.value))}
                />
            </div>

            <style>{`
        .hamster-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 100%;
          padding: 20px 0;
        }

        .pix {
          --m: 2;
          position: absolute;
          width: calc(var(--w) * var(--m));
          height: calc(var(--h) * var(--m));
          background-size: 100%;
          background-repeat: no-repeat;
          image-rendering: pixelated;
          pointer-events: none;
        }
        
        .head:after,
        .bum:after {
          --m: 2;
          position: absolute;
          width: calc(var(--w) * var(--m));
          height: calc(var(--h) * var(--m));
          background-size: 100%;
          background-repeat: no-repeat;
          image-rendering: pixelated;
        }

        .puff {
          --w: 15px;
          --h: 14px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAOCAYAAADwikbvAAAAAXNSR0IArs4c6QAAAEhJREFUOE9jZEADjzZk/UcXg/HlAqYxIsvBOfg0oRsGMwSsmRSNyK5gJEcjzIBRzbgiGIf4AAYYRYkE5h1SEgtK8kQOD1IyBgBNBC/ng5m19gAAAABJRU5ErkJggg==);
        }

        .ear {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAAXNSR0IArs4c6QAAACJJREFUGFdjZGBgYHi0Ies/iAYBuYBpjIzIAjAJEgSxmQkAyjQQ9ygpCP0AAAAASUVORK5CYII=);
          --w: 5px;
          --h: 5px;
          top: -4px;
          left: 6px;
        }

        .hamster {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          margin-bottom: 6px;
          z-index: 99;
          animation: up-down infinite var(--hamster-speed);
          cursor: pointer;
          pointer-events: auto;
        }

        .wheel.spinning .hamster {
          cursor: default;
        }

        .hamster-speech-anchor {
          position: absolute;
          left: 50%;
          top: -8px;
          transform: translateX(-50%);
          width: 0px;
          height: 0px;
          display: flex;
          justify-content: center;
          align-items: end;
          pointer-events: none;
        }

        .hamster-speech-bubble {
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
          will-change: opacity;
        }

        .hamster-speech-bubble::after {
          content: '';
          position: absolute;
          top: 25px;
          left: 50%;
          margin-left: -6px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #000;
        }

        .hamster-speech-bubble::before {
          content: '';
          position: absolute;
          bottom: -4.5px;
          left: 50%;
          margin-left: -6px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #FFF;
          z-index: 1;
        }

        .hamster.squeak .hamster-speech-bubble {
          opacity: 1;
          animation: fade-in-hamster 0.2s;
        }

        @keyframes fade-in-hamster {
          from {
            opacity: 0;
            bottom: 4px;
          }
          to {
            opacity: 1;
            bottom: 8px;
          }
        }

        .hamster:before {
          content: '';
          position: absolute;
          background: #693215;
          background-image: none;
          width: 4px;
          height: 4px;
          left: 5px;
          top: 10px;
          image-rendering: auto;
        }

        .hamster:after {
          content: '';
          position: absolute;
          background: #693215;
          background-image: none;
          width: 7px;
          height: 2px;
          bottom: 8px;
          left: -4px;
          image-rendering: auto;
        }

        .ear,
        .hamster:before,
        .hamster:after {
          animation: up-down infinite var(--hamster-speed);
        }

        .head,
        .bum {
          z-index: -1;
          top: 0px;
          animation: squidge var(--hamster-speed) infinite;
        }

        .hamster div:after {
          content: '';
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAGCAYAAADkOT91AAAAAXNSR0IArs4c6QAAACFJREFUGFdjZGBgYHi0Ies/iJYLmMbICOOABECAHAF0QwFBIRPzdQwRVAAAAABJRU5ErkJggg==);
          --w: 4px;
          --h: 6px;
          bottom: -4px;
          animation: run var(--hamster-speed) infinite;
        }

        .head {
          left: -5px;
          --angle: 10deg;
        }

        .bum {
          right: -5px;
          --angle: -10deg;
        }

        .head:after {
          left: 8px;
          --run-x: -2px;
          --angle: 4deg;
        }

        .bum:after {
          right: 6px;
          --run-x: 2px;
          --angle: -4deg;
        }

        @keyframes squidge {
          0%, 100% {
            transform: rotate(var(--angle)) translateY(-1px);
          }
          50% {
            transform: rotate(0) translateY(0);
          }
        }

        @keyframes run {
          0%, 100% {
            transform: translateX(var(--run-x)) rotate(var(--angle));
          }
          50% {
            transform: translateX(0) rotate(0);
          }
        }

        @keyframes up-down {
          0%, 100% {
            transform: translateY(-1px);
          }
          50% {
            transform: translateY(0);
          }
        }

        .wheel-frame {
          position: relative;
          --w: 80px;
          --h: 80px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAn5JREFUeF7t3NtygzAMBNDy/x9NJnScIeCLVisZkmyfbdk6LHGbkC5/N/lZ13VFtrIsy4KMzxp7ySZqWChIRI0I1GmA+4ZRLGujM9Y47iUdsDSVhdbCnbVuGuCsBkbpzN5HOGD2hkdgsxMZBnhXuCNo9D5DAJ+bmv0a501imRe1Zwow+mqyKOj8iP27AaOuINp0xnimFxcgs2AGQERNb08woHehiCaza3h6gwA9C2Q3HV0f7dEMiBaObmxmPaRXEyBScGajmWtZex4CWgtlNnNVbUvvAuxcHRrQUuCqdMxad2TQTOBo4qwG7rBOz0KAhisEAyp9Z9WWSTWBAiQAhde+p2s2pwQKkAAU3vhEORq9JVCABKDwxni1jwNeCRSgAO0C5Mh92LYEKn24aDETIG63zRCgE+54kCiBTkgl0Al3SqAOEL/kZidAAfoFyJlKoABJAXK6EihAUoCcrgQKkBQgpyuBAiQFyOlKYASg3lD1KerdGJ/ba5YABUgKkNOVwEhAHSSY5uljTQEKEBMgR1cTqBTaVPV0ls2pOaoLqBT2dfWEanD6nuX0kLkRVU/pG6FawyBAvRa+M/YePtA3lQzJdAEqhf+yo0df9HXXTgJHeM1TeF/TUsRwF3zkEEvvwwRaYvyROoNNW/BMCSzrWAt+AybSqymBv4SI4EEJ/AVEFM8F+K2viR48N+C3IXrxKMCCuBW5yb8kRg+wJxy7f+gQQf/QRhuaOZ5J3X6fIYCflMaI1KUA7k9p9rbISGI0XNljWAKPTWdtGMXN3kca4NWJzIZLT2ArkZm3d0HLXOPYV3oCa7fcvtHXlQR/FYqogb4c1MZfAmhF7TV4l989H/4WeD/sciFJAAAAAElFTkSuQmCC);
          margin-bottom: 16px;
          pointer-events: none;
        }

        .wheel {
          width: 160px;
          height: 160px;
          display: flex;
          justify-content: center;
          align-items: end;
          transform: rotate(var(--wheel-angle));
        }

        .wheel.spinning {
          animation: spin var(--wheel-speed) infinite linear;
        }

        .wheel.spinning .hamster {
          animation: none;
          cursor: default;
          pointer-events: none;
        }

        .wheel-support {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAURJREFUeF7t28EJwkAARUHTpR3YgUXYgR3YpbKCVw3MKos8729JJv+QQ9wO/Uhgo/oL8fF0vr879na9LHXNS13MgAsQVxlggCiAeQsMEAUwb4EBogDmLTBAFMC8BQaIApi3wABRAPMWGCAKYN4CA0QBzFtggCiAeQsMEAUwb4EBogDmLTBAFMC8BQaIApi3wABRAPMWGCAKYN4CA0QByD+t73X0Sl+pPr9Q3XvhYPOX6XiQAcKjDRDwRhpggCiAeQsMEAUwb4GzAPGcafne99HlXqSnCUw46BPiSnjjdvuvHD70AANEAcxbYIAogHkLDBAFMG+BAaIA5i0wQBTAvAUGiAKYt8AAUQDzFhggCmDeAgNEAcxbYIAogHkLDBAFMG+BAaIA5i0wQBTAvAUGiAKYt8AAUQDzFhggCmC+3ALxfn6ePwDuUzhgOFkZ9gAAAABJRU5ErkJggg==);
          animation: spin var(--wheel-speed) infinite linear;
          --w: 80px;
          --h: 80px;
        }

        @keyframes spin {
          to {
            transform: rotate(-360deg);
          }
        }

        input[type=range] {
          width: 160px;
          padding: 0;
          background-color: transparent;
          -webkit-appearance: none;
          appearance: none;
        }

        input[type=range]:focus {
          outline: none;
        }

        input[type=range]::-webkit-slider-runnable-track {
          background: #fff;
          width: 160px;
          height: 4px;
          cursor: pointer;
        }

        input[type=range]::-webkit-slider-thumb {
          margin: -8.2px 0 0 0;
          width: 20px;
          height: 20px;
          background: #3b4652;
          cursor: pointer;
          -webkit-appearance: none;
          image-rendering: pixelated;
        }

        input[type=range]:focus::-webkit-slider-runnable-track {
          background: #fff;
        }

        input[type=range]::-moz-range-track {
          background: #fff;
          width: 160px;
          height: 4px;
          cursor: pointer;
        }

        input[type=range]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b4652;
          cursor: pointer;
          image-rendering: pixelated;
        }

        input[type=range]::-ms-track {
          background: transparent;
          border-color: transparent;
          border-width: 9px 0;
          color: transparent;
          width: 160px;
          height: 4px;
          cursor: pointer;
        }

        input[type=range]::-ms-fill-lower {
          background: #fff;
        }

        input[type=range]::-ms-fill-upper {
          background: #fff;
        }

        input[type=range]::-ms-thumb {
          width: 20px;
          height: 20px;
          background: #3b4652;
          cursor: pointer;
          margin-top: 0px;
        }

        input[type=range]:focus::-ms-fill-lower {
          background: #fff;
        }

        input[type=range]:focus::-ms-fill-upper {
          background: #fff;
        }
      `}</style>
        </>
    );
};

export default Hamster;
