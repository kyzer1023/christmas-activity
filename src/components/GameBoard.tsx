import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../context/GameContext';
import ThreeBoard from './ThreeBoard';
import Legend from './Legend';

// Snowflakes component for atmospheric effect
const Snowflakes: React.FC<{ count?: number }> = ({ count = 200 }) => {
    const mesh = useRef<THREE.Points>(null);
    
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const speeds = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            // Spread snowflakes in a visible area around and above the board
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 18;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = Math.random() * 25 - 5;
            positions[i * 3 + 2] = Math.sin(angle) * radius - 5;
            
            speeds[i] = Math.random() * 0.8 + 0.4;
        }
        
        return { positions, speeds };
    }, [count]);
    
    useFrame((state, delta) => {
        if (mesh.current) {
            const positions = mesh.current.geometry.attributes.position.array as Float32Array;
            
            for (let i = 0; i < count; i++) {
                positions[i * 3 + 1] -= particles.speeds[i] * delta * 2;
                positions[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * delta * 0.3;
                positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 0.3 + i * 0.1) * delta * 0.2;
                
                if (positions[i * 3 + 1] < -8) {
                    positions[i * 3 + 1] = 22;
                }
            }
            
            mesh.current.geometry.attributes.position.needsUpdate = true;
        }
    });
    
    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particles.positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.18}
                color="#c8e0ff"
                transparent
                opacity={0.7}
                sizeAttenuation
            />
        </points>
    );
};

// Background stars (distant, subtle)
const BackgroundStars: React.FC<{ count?: number }> = ({ count = 500 }) => {
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 80 + Math.random() * 40;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, [count]);
    
    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#a8c8ff"
                transparent
                opacity={0.4}
                sizeAttenuation={false}
            />
        </points>
    );
};

const GameBoard: React.FC = () => {
    const { board, tokenPosition } = useGame();

    return (
        <div className="board-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Legend Overlay */}
            <Legend />

            <Canvas shadows className="game-canvas">
                <PerspectiveCamera makeDefault position={[0, 18, 14]} fov={40} />
                <OrbitControls enabled={false} />

                {/* Dark ambient for mood */}
                <ambientLight intensity={0.08} color="#1a1a2e" />
                
                {/* Main warm accent light */}
                <pointLight 
                    position={[0, 15, 0]} 
                    intensity={0.8} 
                    color="#ffd700" 
                    distance={40}
                />
                
                {/* Rim lights for neon edge enhancement */}
                <pointLight 
                    position={[12, 8, 12]} 
                    intensity={0.4} 
                    color="#00bfff" 
                    distance={25}
                />
                <pointLight 
                    position={[-12, 8, -12]} 
                    intensity={0.4} 
                    color="#ff4466" 
                    distance={25}
                />
                <pointLight 
                    position={[-12, 8, 12]} 
                    intensity={0.3} 
                    color="#00ff88" 
                    distance={25}
                />

                {/* Atmospheric effects */}
                <Snowflakes count={250} />
                <BackgroundStars count={400} />
                
                {/* Environment for reflections */}
                <Environment preset="night" blur={0.8} />
                
                {/* Deep space fog */}
                <fog attach="fog" args={['#050510', 30, 100]} />

                {/* Game Board */}
                <ThreeBoard board={board} tokenPosition={tokenPosition} />
            </Canvas>
        </div>
    );
};

export default GameBoard;
