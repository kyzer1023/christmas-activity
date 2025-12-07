import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { BOARD_SIZE } from '../utils/gameUtils';
import { Star, RefreshCw, Shuffle, List } from 'lucide-react';

const RADIUS = 250; // Smaller radius for better fit
const TILE_SIZE = 50;

const getPosition = (index: number) => {
    const angle = (index / BOARD_SIZE) * 2 * Math.PI - Math.PI / 2;
    const x = RADIUS * Math.cos(angle);
    const y = RADIUS * Math.sin(angle);
    return { x, y };
};

const TileIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'skip': return <Star size={20} color="#888" />;
        case 'random': return <Shuffle size={20} color="var(--color-gold)" />;
        case 'reroll': return <RefreshCw size={20} color="#4ade80" />;
        case 'queue_draw': return <List size={20} color="#60a5fa" />;
        default: return null;
    }
};

const GameBoard: React.FC = () => {
    const { board, tokenPosition } = useGame();

    const tokenPos = getPosition(tokenPosition);

    return (
        <div className="board-container" style={{ position: 'relative' }}>
            {/* Background Wheel Effect */}
            <div style={{
                position: 'absolute',
                width: RADIUS * 2 + 80,
                height: RADIUS * 2 + 80,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
                border: '2px solid rgba(255,255,255,0.05)',
                zIndex: 0
            }} />

            <div
                style={{
                    width: RADIUS * 2.2,
                    height: RADIUS * 2.2,
                    position: 'relative',
                }}
            >
                {board.map((tile) => {
                    const { x, y } = getPosition(tile.index);
                    // Rotate tile to match circle angle
                    const angleDeg = (tile.index / BOARD_SIZE) * 360;

                    return (
                        <div
                            key={tile.id}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: TILE_SIZE,
                                height: TILE_SIZE,
                                marginLeft: -TILE_SIZE / 2,
                                marginTop: -TILE_SIZE / 2,
                                transform: `translate(${x}px, ${y}px) rotate(${angleDeg}deg)`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1
                            }}
                        >
                            <div style={{
                                width: TILE_SIZE, height: TILE_SIZE,
                                borderRadius: '50%',
                                background: '#222',
                                border: '2px solid #555',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
                            }}>
                                <TileIcon type={tile.type} />
                            </div>
                            <span style={{
                                marginTop: '5px',
                                fontSize: '9px',
                                textTransform: 'uppercase',
                                color: '#888',
                                fontWeight: 'bold',
                                textShadow: '0 2px 2px black',
                                textAlign: 'center',
                                maxWidth: '60px'
                            }}>
                                {tile.type.replace('_', ' ')}
                            </span>
                        </div>
                    );
                })}

                {/* Token */}
                <motion.div
                    animate={{
                        x: tokenPos.x,
                        y: tokenPos.y
                    }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 40,
                        height: 40,
                        marginLeft: -20,
                        marginTop: -20,
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: '50%',
                        boxShadow: '0 0 25px var(--color-primary)',
                        zIndex: 10,
                        border: '2px solid white'
                    }}
                />

                {/* Center */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    zIndex: 5
                }}>
                    <div style={{
                        width: 150, height: 150,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #2a2a2a 0%, #111 100%)',
                        border: '4px solid #333',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(0,0,0,0.8)'
                    }}>
                        <div>
                            <h2 className="title-gradient" style={{ fontSize: '2rem', margin: 0 }}>XMAS</h2>
                            <div style={{ color: '#555', fontSize: '0.8rem' }}>Partayyy</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
