import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, PerspectiveCamera, Html } from '@react-three/drei';
import { useGame } from '../context/GameContext';
import ThreeBoard from './ThreeBoard';
import Legend from './Legend';

// Loading overlay displayed outside the canvas
const LoadingOverlay: React.FC<{ visible: boolean }> = ({ visible }) => {
    if (!visible) return null;
    
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1a1a2e 0%, #050510 100%)',
            zIndex: 100,
            color: '#ffd700',
            fontFamily: 'system-ui, sans-serif',
        }}>
            {/* Spinning snowflake loader */}
            <div style={{
                fontSize: '56px',
                marginBottom: '24px',
                animation: 'spin 2s linear infinite',
            }}>
                ❄️
            </div>
            <div style={{
                fontSize: '20px',
                fontWeight: 600,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '16px',
                textShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
            }}>
                Loading Christmas Board
            </div>
            {/* Animated dots */}
            <div style={{
                display: 'flex',
                gap: '8px',
            }}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#ffd700',
                            animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                        }}
                    />
                ))}
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 80%, 100% { 
                        transform: scale(0.6);
                        opacity: 0.5;
                    }
                    40% { 
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

// Component that detects when first frames are rendered
const FrameDetector: React.FC<{ onReady: () => void }> = ({ onReady }) => {
    const frameCount = useRef(0);
    const hasTriggered = useRef(false);
    
    useFrame(() => {
        if (!hasTriggered.current) {
            frameCount.current++;
            // Wait for a few frames to ensure everything is rendered
            if (frameCount.current >= 5) {
                hasTriggered.current = true;
                onReady();
            }
        }
    });
    
    return null;
};

// Scene content
const SceneContent: React.FC<{ 
    board: ReturnType<typeof useGame>['board']; 
    tokenPosition: number; 
    onReady: () => void;
}> = ({ board, tokenPosition, onReady }) => {
    return (
        <>
            <FrameDetector onReady={onReady} />
            
            <PerspectiveCamera makeDefault position={[0, 18, 14]} fov={40} />
            <OrbitControls enabled={false} />

            {/* Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffd700" castShadow />
            <pointLight position={[-10, 10, -10]} intensity={1} color="#ff0000" />

            {/* Environment & Background */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="night" blur={0.6} />

            {/* Game Board */}
            <ThreeBoard board={board} tokenPosition={tokenPosition} />
        </>
    );
};

// Fallback for Suspense (minimal, since we have overlay)
const SuspenseFallback: React.FC = () => {
    return (
        <Html center>
            <div style={{ color: '#ffd700', fontSize: '14px' }}>
                Initializing...
            </div>
        </Html>
    );
};

const GameBoard: React.FC = () => {
    const { board, tokenPosition } = useGame();
    const [isLoading, setIsLoading] = useState(true);

    const handleReady = React.useCallback(() => {
        // Small delay to ensure smooth transition
        setTimeout(() => {
            setIsLoading(false);
        }, 100);
    }, []);

    return (
        <div className="board-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Loading Overlay */}
            <LoadingOverlay visible={isLoading} />
            
            {/* Legend Overlay - only show when loaded */}
            {!isLoading && <Legend />}

            <Canvas shadows className="game-canvas">
                <Suspense fallback={<SuspenseFallback />}>
                    <SceneContent 
                        board={board} 
                        tokenPosition={tokenPosition} 
                        onReady={handleReady}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default GameBoard;
