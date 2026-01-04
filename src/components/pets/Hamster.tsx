'use client';

// ============================================================================
// Hamster Component
// ============================================================================

import { useState, useEffect, useRef } from 'react';

const Hamster = () => {
    const [speedFactor, setSpeedFactor] = useState(3);
    const [isRunning, setIsRunning] = useState(true);
    const [isSpinning, setIsSpinning] = useState(false);
    const energyRef = useRef(1000);

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
                        <div className="hamster puff pix">
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

        .pix,
        .pix:after {
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
        }

        .hamster:before {
          content: '';
          position: absolute;
          background: #693215;
          width: 4px;
          height: 4px;
          left: 5px;
          top: 10px;
          animation: up-down infinite var(--hamster-speed);
        }

        .hamster:after {
          content: '';
          position: absolute;
          background: #693215;
          width: 7px;
          height: 2px;
          bottom: 8px;
          left: -4px;
          animation: up-down infinite var(--hamster-speed);
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
          --angle: 6deg;
        }

        .bum:after {
          right: 6px;
          --run-x: 2px;
          --angle: -6deg;
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
