import React, { useEffect, useState } from 'react';
import '../App.css';

interface Dice3DProps {
    rolling: boolean;
    value: number; // 1-6
    onRoll?: () => void;
}

const Dice3D: React.FC<Dice3DProps> = ({ rolling, value, onRoll }) => {
    // We handle the rotation state internally to ensure smooth transitions
    // When rolling, we apply a class that spins wildly.
    // When stopped, we apply inline styles to rotate to the specific face.

    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!rolling) {
            // Determine rotation for the target value
            // Front (1): 0, 0
            // Back (6): 180, 0
            // Right (3): 0, -90
            // Left (4): 0, 90
            // Top (2): -90, 0
            // Bottom (5): 90, 0
            switch (value) {
                case 1: setRotation({ x: 0, y: 0 }); break;
                case 6: setRotation({ x: 180, y: 0 }); break;
                case 3: setRotation({ x: 0, y: -90 }); break;
                case 4: setRotation({ x: 0, y: 90 }); break;
                case 2: setRotation({ x: -90, y: 0 }); break;
                case 5: setRotation({ x: 90, y: 0 }); break;
                default: setRotation({ x: 0, y: 0 });
            }
        }
    }, [rolling, value]);

    return (
        <div className="scene" onClick={onRoll} style={{ cursor: rolling ? 'default' : 'pointer' }}>
            <div
                className={`cube ${rolling ? 'is-spinning' : ''}`}
                style={{
                    transform: rolling
                        ? undefined // Animation handles it
                        : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                }}
            >
                <div className="cube__face cube__face--front">
                    <span className="dot dot-center"></span>
                </div>
                <div className="cube__face cube__face--back">
                    <div className="dot-column">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                    <div className="dot-column">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>
                <div className="cube__face cube__face--right">
                    <span className="dot dot-top-right"></span>
                    <span className="dot dot-center"></span>
                    <span className="dot dot-bottom-left"></span>
                </div>
                <div className="cube__face cube__face--left">
                    <div className="dot-column">
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                    <div className="dot-column">
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>
                <div className="cube__face cube__face--top">
                    <span className="dot dot-top-right"></span>
                    <span className="dot dot-bottom-left"></span>
                </div>
                <div className="cube__face cube__face--bottom">
                    <div className="dot-column">
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                    <span className="dot dot-center"></span>
                    <div className="dot-column">
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dice3D;
