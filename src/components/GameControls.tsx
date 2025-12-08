import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { RefreshCw, Gift } from 'lucide-react';
import QueueList from './QueueList';
import Dice3D from './Dice3D';

const GameControls: React.FC = () => {
    const {
        rollDice, isRolling, isMoving,
        pendingEffect, resolveEffect, lastDiceRoll
    } = useGame();

    // Auto-resolve Queue Draw
    useEffect(() => {
        console.log('GameControls: pendingEffect changed to:', pendingEffect);
        if (pendingEffect === 'queue_draw') {
            console.log('GameControls: settings timeout for queue_draw resolve');
            const timer = setTimeout(() => {
                console.log('GameControls: calling resolveEffect()');
                resolveEffect();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [pendingEffect, resolveEffect]);

    return (
        <div className="controls-container glass-panel" style={{
            margin: '20px',
            height: 'calc(100vh - 40px)',
            borderRadius: 'var(--radius-xl)'
        }}>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 'auto',
                marginTop: '20px',
                position: 'relative',
                width: '100%'
            }}>

                <div style={{ marginBottom: '30px', transform: 'scale(1.2)', display: 'flex', justifyContent: 'center' }}>
                    <Dice3D
                        rolling={isRolling}
                        value={lastDiceRoll || 1}
                        onRoll={() => !isRolling && !pendingEffect && !isMoving && rollDice()}
                    />
                </div>

                {/* Helper Text */}
                {!isRolling && !pendingEffect && (
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{
                            color: 'var(--color-gold)',
                            marginTop: '30px',
                            fontSize: '0.8rem',
                            letterSpacing: '2px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}
                    >
                        Click Die to Roll
                    </motion.div>
                )}


                {pendingEffect === 'queue_draw' && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.2 }}
                            transition={{ type: 'spring' }}
                            style={{ color: '#60a5fa' }}
                        >
                            <Gift size={60} />
                        </motion.div>
                        <h3 style={{ color: 'white' }}>Drawing Mystery Gift...</h3>
                        <p style={{ fontSize: '0.8rem', color: '#888' }}>Auto-assigning from stack top...</p>
                    </div>
                )}

                {pendingEffect === 'reroll' && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h3 style={{ color: 'var(--color-gold)' }}>Reroll!</h3>
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                        >
                            <RefreshCw size={50} color="#4ade80" />
                        </motion.div>
                        <p style={{ color: '#aaa' }}>Auto-rolling...</p>
                        <button className="btn-primary" onClick={() => resolveEffect()} style={{ marginTop: '10px' }}>
                            CONTINUE
                        </button>
                    </div>
                )}

                {/* Dice Result Display */}
                {!isRolling && lastDiceRoll && !pendingEffect && (
                    <div style={{
                        marginTop: '20px',
                        fontSize: '1.2rem',
                        color: 'var(--color-text-muted)',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '10px 20px',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        Rolled: <span style={{ color: 'white', fontWeight: 'bold' }}>{lastDiceRoll}</span>
                    </div>
                )}
            </div>

            <QueueList />
        </div >
    );
};

export default GameControls;
