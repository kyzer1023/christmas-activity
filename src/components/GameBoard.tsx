import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, PerspectiveCamera } from '@react-three/drei';
import { useGame } from '../context/GameContext';
import ThreeBoard from './ThreeBoard';
import Legend from './Legend';

const GameBoard: React.FC = () => {
    const { board, tokenPosition } = useGame();

    return (
        <div className="board-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Legend Overlay */}
            <Legend />

            <Canvas shadows className="game-canvas">
                {/* 
                  Camera Position Update: 
                  Current: [0, 8, 12] -> too flat, too big.
                  New: [0, 18, 14] 
                  - Increased Y (18) for steeper angle.
                  - Increased Z (14) to "zoom out" slightly so it fits better without overlapping.
                */}
                <PerspectiveCamera makeDefault position={[0, 18, 14]} fov={40} />
                {/* 
                   Locked Interaction: 
                   We remove OrbitControls or set it to disabled. 
                   The user said "cant be moved or the POV cant be change at all anymore".
                   So we simply DO NOT render OrbitControls, or render it with enabled={false}.
                */}
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
            </Canvas>
        </div>
    );
};

export default GameBoard;
