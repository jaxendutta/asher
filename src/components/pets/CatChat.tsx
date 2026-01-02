"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { jersey_25, press_start_2p, tiny5 } from '@/lib/fonts';

interface Message {
    id: number;
    text: string;
    name: 'white' | 'sleepy' | 'choco' | 'biscuit';
    isTyping?: boolean;
    displayed?: boolean;
}

export default function CatChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [showInitialMessage, setShowInitialMessage] = useState(false);
    const messageIdCounter = useRef(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 500); // Match the slideDown animation duration
    };

    // Close chat when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        if (isOpen && !isClosing) {
            // Small delay to prevent immediate closing when opening
            setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 100);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, isClosing]);

    useEffect(() => {
        if (isOpen && messages.length === 0 && !showInitialMessage) {
            setTimeout(() => {
                setShowInitialMessage(true);
                triggerCatTalk('');
            }, 1000);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Mark only undisplayed messages as displayed after animation completes
        const hasUndisplayed = messages.some(msg => !msg.displayed && !msg.isTyping);
        if (hasUndisplayed) {
            const timer = setTimeout(() => {
                setMessages(prev =>
                    prev.map(msg =>
                        msg.displayed || msg.isTyping ? msg : { ...msg, displayed: true }
                    )
                );
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [messages]);

    const randomN = (max: number) => Math.ceil(Math.random() * max);

    const textToMeow = (text: string, isUserMessage: boolean) => {
        if (isUserMessage) {
            // Convert user text to meow
            return text
                .split(' ')
                .map(word => {
                    return 'meow' + (word.includes('!') ? '!' : '') + (word.includes('?') ? '?' : '');
                })
                .join(' ');
        }
        // Cat messages already have their meow text generated
        return text;
    };

    const generateCatMeow = () => {
        const meowCount = randomN(6);
        const meows = new Array(meowCount).fill('meow');
        const punctuation = ['!', '?', '!!', '...', ''];
        const randomPunct = punctuation[randomN(punctuation.length) - 1];
        return meows.join(' ') + randomPunct;
    };

    const triggerCatTalk = (userText: string) => {
        const allCats: Array<'sleepy' | 'choco' | 'biscuit'> = ['sleepy', 'choco', 'biscuit'];
        const catsToTalk: Array<'sleepy' | 'choco' | 'biscuit'> = [];

        while (catsToTalk.length === 0) {
            allCats.forEach(cat => {
                if (randomN(2) % 2 === 0) catsToTalk.push(cat);
            });
        }

        catsToTalk.forEach(cat => {
            const delay = 200 + randomN(4) * 500;
            const catMeow = generateCatMeow(); // Generate meow once

            // Add typing indicator
            setTimeout(() => {
                const typingId = messageIdCounter.current++;
                setMessages(prev => [...prev, { id: typingId, text: catMeow, name: cat, isTyping: true, displayed: false }]);

                // Replace with actual message
                setTimeout(() => {
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === typingId
                                ? { ...msg, isTyping: false, displayed: false }
                                : msg
                        )
                    );
                }, 300 + randomN(5) * 500);
            }, delay);
        });
    };

    const sendMessage = () => {
        if (!inputValue.trim()) return;

        setIsTranslating(true);

        setTimeout(() => {
            setIsTranslating(false);

            const newMessage: Message = {
                id: messageIdCounter.current++,
                text: inputValue,
                name: 'white',
                isTyping: false,
                displayed: false,
            };

            setMessages(prev => [...prev, newMessage]);
            const messageText = inputValue;
            setInputValue('');

            setTimeout(() => {
                triggerCatTalk(messageText);
            }, randomN(4) * 300);
        }, 1300);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <>
            <style>{`
        .cat-chat-widget {
          position: fixed;
          bottom: 15px;
          right: 15px;
          z-index: 9999;
        }

        .cat-chat-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s;
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          image-rendering: pixelated;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAJtJREFUOE9jXPHu/38GKgLGUQPhobneSoAh8NgHrKGLTw5rGII0rLj+gSFCE9NQfHIg2zEMhGmAOQ3ZUHxyMPW0NRDdBciuBLFBwYAO0IMFxYW4DMSX7nEaSI5h2MIZ7kJsAY7NiyBDQK5ClkN2Jf0MRPYOzDXoLsPrZZAk1WMZZiiuJIIc2yDXggB69sRZfIFciw/gyucjsDwEAN3HvKW99h2gAAAAAElFTkSuQmCC);
        }

        .cat-chat-toggle:hover {
          transform: scale(1.05);
        }

        .cat-chat-toggle.open {
          display: none;
        }

        .cat-chat-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 100%;
          max-width: 400px;
          height: 70vh;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: 9999;
          transform-origin: bottom right;
          border-radius: 12px;
        }

        .cat-chat-container.opening {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .cat-chat-container.closing {
          animation: slideDown 0.5s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        @keyframes slideUp {
          0% {
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
        }

        .cat-chat-header {
          background: #76533a;
          padding: 12px 16px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #57280f;
          border-radius: 12px 12px 0 0;
        }

        .cat-chat-close {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .cat-chat-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .cat-inner-screen {
          background-color: #76533a;
          flex: 1;
          overflow-y: scroll;
          display: flex;
          flex-direction: column-reverse;
          padding: 12px;
        }
        
        .cat-messages-container {
          display: flex;
          flex-direction: column;
        }

        .cat-message {
          display: flex;
          align-items: end;
          gap: 6px;
          margin-bottom: 12px;
          animation: show-message 0.3s forwards;
        }

        .cat-message.reverse {
          flex-direction: row-reverse;
        }

        @keyframes show-message {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cat-icon {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          background-size: cover;
          image-rendering: pixelated;
          animation: open-up 0.3s forwards;
        }

        @keyframes open-up {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }

        .cat-icon.white {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAJtJREFUOE9jXPHu/38GKgLGUQPhobneSoAh8NgHrKGLTw5rGII0rLj+gSFCE9NQfHIg2zEMhGmAOQ3ZUHxyMPW0NRDdBciuBLFBwYAO0IMFxYW4DMSX7nEaSI5h2MIZ7kJsAY7NiyBDQK5ClkN2Jf0MRPYOzDXoLsPrZZAk1WMZZiiuJIIc2yDXggB69sRZfIFciw/gyucjsDwEAN3HvKW99h2gAAAAAElFTkSuQmCC);
        }

        .cat-icon.biscuit {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAL5JREFUOE9j/H+z4D8DFQHjqIHw0Izwn8+wYmMi1tDFJ4c1DMEarn9giNAUwDAUJDd1Yj5Ddv5ErBZiGAgzDOY0ZENhhsHksBlKWwPRXYfsShAb5FV0gO5KFBfiMhBkyNtd9VgjCKeB+AzDZyBIDtlQuAuxRsb1DyiugrkSZACy98k2EOZSsgxESTZQl4KTEJSNHKZYXQgygFAswwxDDgf0xI81HYI0YNOMbhBYHVr2xFl8gVyLD+DK5yOwPAQAKPjFoR4p7DEAAAAASUVORK5CYII=);
        }

        .cat-icon.sleepy {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAJ9JREFUOE9j/H9jyn8GKgLGUQPhoRkRUM2wYkMr1tDFJ4c1DEEacuffZ5icqIhhKD45kO0YBsI0wJyGbCg+OZh62hqI7gJkV4LYoGBAB+jBguJCXAbiS/c4DSTHMGzhDHchsoEgW2EA3ZvY5JBdidVAUrM2SQaCFMNcicxGthSrgSAFVI9lmKG4kgi6q0B89OyJs/gCuRYfwJXPR2B5CABijLNdGjYfkwAAAABJRU5ErkJggg==);
        }

        .cat-icon.choco {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAJxJREFUOE9jnP/z3X8GKgLGUQPhoblDX5HB4+J9rKGLTw5rGII0TJ2Yz5CdPxHDUHxyINsxDIRpgDkN2VB8cjD1tDUQ3QXIrgSxQcGADtCDBcWFuAzEl+5xGkiOYdjCGe5CbAGOzYsgQ0CuQpZDdiX9DET2Dsw16C7D62WQJNVjGWYoriSCHNsg14IAevbEWXyBXIsP4MrnI7A8BAC9nrt5ix+41AAAAABJRU5ErkJggg==);
        }

        .cat-speech-bubble {
          position: relative;
          padding: 6px 10px;
          font-size: 0.95rem;
          color: #57280f;
          max-width: calc(100% - 60px);
          background: #f5deb8;
          border-radius: 12px;
          border: 2px solid #d4a574;
          animation: open-up 0.3s forwards;
        }

        .cat-speech-bubble::after {
          content: '';
          position: absolute;
          bottom: 8px;
          width: 0;
          height: 0;
          border: 8px solid transparent;
        }

        .cat-message:not(.reverse) .cat-speech-bubble::after {
          left: -8px;
          border-right-color: #d4a574;
          border-left: 0;
        }

        .cat-message.reverse .cat-speech-bubble::after {
          right: -8px;
          border-left-color: #d4a574;
          border-right: 0;
        }

        .cat-speech-bubble span {
          opacity: 0;
          animation: fade-in-text 0.2s steps(1) forwards;
        }

        @keyframes fade-in-text {
          to { opacity: 1; }
        }

        .cat-typing {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }

        .cat-pulse {
          opacity: 0;
          animation: fade-in-fade-out-text 0.5s steps(2) infinite;
        }

        @keyframes fade-in-fade-out-text {
          to { opacity: 1; }
        }

        .cat-update {
          text-align: center;
          padding: 18px 10px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.5rem;
        }

        .cat-ui-wrapper {
          background-color: #fff;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-top: 2px solid #57280f;
          border-radius: 0 0 12px 12px;
        }

        .cat-input-wrapper {
          position: relative;
          flex: 1;
        }

        .cat-input {
          width: 100%;
          border: 2px solid #d4a574;
          background-color: #c5d1ef;
          height: 40px;
          padding: 0 12px;
          font-size: 1rem;
          color: #57280f;
          border-radius: 8px;
        }

        .cat-input:focus {
          outline: none;
          border-color: #57280f;
        }

        .cat-input-wrapper.translating::before {
          content: 'Translating...';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background-color: #f2d197;
          display: flex;
          align-items: center;
          padding: 0 12px;
          color: #57280f;
          border-radius: 8px;
          animation: load 1s forwards;
          pointer-events: none;
        }

        @keyframes load {
          from { width: 0; padding: 0; }
          to { width: 100%; padding: 0 12px; }
        }

        .cat-send-button {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAAAAXNSR0IArs4c6QAAAJdJREFUOE9jZICCTxen/4exKaH59DMZQfrBBLUMhTkIZDgjPkNTwyvAamev7EDxBC5xZEU4DYZphimGGY5LHD346G8wyAVUCwpiwg5bisGmDx4UhMKOkOvR44KgwegWEhuZKJGH7ipchuIyHDlZEp0qcOVG9DQOU0dfgwkFAbrrsbkaq4uHnsHIuY7Y5IVRVtCs2KRVQQ8ADm+M8RqPRL8AAAAASUVORK5CYII=);
          width: 48px;
          height: 40px;
          background-size: cover;
          image-rendering: pixelated;
          border: 0;
          background-color: transparent;
          cursor: pointer;
          flex-shrink: 0;
        }

        .cat-send-button:hover {
          filter: brightness(0.8) sepia(1);
        }

        @media (max-width: 480px) {
          .cat-chat-container {
            bottom: 0;
            right: 0;
            left: 0;
            max-width: 100%;
            height: calc(100dvh - 80px);
            margin: 0;
            border-radius: 12px 12px 0 0;
            transform-origin: bottom center;
          }

          .cat-chat-widget {
            bottom: 10px;
            right: 10px;
          }

          @keyframes slideUp {
            0% {
              transform: translateY(100%);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slideDown {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(100%);
              opacity: 0;
            }
          }
        }

        /* Ensure chat doesn't go behind mobile browser UI */
        @supports (-webkit-touch-callout: none) {
          .cat-chat-container {
            height: min(70vh, calc(100vh - 100px));
          }
          
          @media (max-width: 480px) {
            .cat-chat-container {
              height: calc(100vh - 100px);
            }
          }
        }
      `}</style>

            <div className="cat-chat-widget">
                {!isOpen && (
                    <button
                        className="cat-chat-toggle"
                        onClick={() => setIsOpen(true)}
                        aria-label="Open secret chat"
                    />
                )}

                {isOpen && (
                    <div
                        ref={chatContainerRef}
                        className={`cat-chat-container ${isClosing ? 'closing' : 'opening'}`}
                    >
                        <div className="cat-chat-header">
                            <span className={`${press_start_2p.className}`}>Secret Chat Group</span>
                            <button
                                className="cat-chat-close"
                                onClick={handleClose}
                                aria-label="Close chat"
                            >
                                <Image src={"/images/icons/cross.svg"} alt="Close" width={40} height={40} style={{ filter: 'brightness(0) invert(1)' }} />
                            </button>
                        </div>

                        <div className="cat-inner-screen">
                            <div className="cat-messages-container">
                                {showInitialMessage && (
                                    <div className={`cat-update ${press_start_2p.className}`}>
                                        - you and 3 other cats entered the chat -
                                    </div>
                                )}

                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`cat-message ${msg.name === 'white' ? 'reverse' : ''}`}
                                    >
                                        {msg.isTyping ? (
                                            <div className={`cat-typing ${tiny5.className}`}>
                                                {msg.name} is typing<span className="cat-pulse">...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={`cat-icon ${msg.name}`} />
                                                <div className={`cat-speech-bubble ${jersey_25.className}`}>
                                                    {msg.displayed
                                                        ? textToMeow(msg.text, msg.name === 'white')
                                                        : textToMeow(msg.text, msg.name === 'white').split('').map((char, i) => (
                                                            <span
                                                                key={i}
                                                                style={{ animationDelay: `${i * 0.01}s` }}
                                                            >
                                                                {char}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <div className="cat-ui-wrapper">
                            <div className={`cat-input-wrapper ${jersey_25.className} ${isTranslating ? 'translating' : ''}`}>
                                <input
                                    type="text"
                                    className={`cat-input ${jersey_25.className}`}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type a message..."
                                    disabled={isTranslating}
                                />
                            </div>
                            <button
                                className="cat-send-button"
                                onClick={sendMessage}
                                disabled={isTranslating || !inputValue.trim()}
                                aria-label="Send message"
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
