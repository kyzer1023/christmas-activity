import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { RefreshCw, Gift } from 'lucide-react';
import QueueList from './QueueList';
import Dice3D from './Dice3D';

const GameControls: React.FC = () => {
    const {
        rollDice, isRolling,
        pendingEffect, resolveEffect, lastDiceRoll
    } = useGame();

    // Auto-resolve Queue Draw
    useEffect(() => {
        if (pendingEffect === 'queue_draw') {
            const timer = setTimeout(() => {
                resolveEffect();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [pendingEffect, resolveEffect]);

    return (
        <div className="controls-container">
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 'auto',
                marginTop: '40px'
            }}>

                <div style={{ marginBottom: '40px' }}>
                    <Dice3D
                        rolling={isRolling}
                        value={lastDiceRoll || 1}
                        onRoll={() => !isRolling && !pendingEffect && rollDice()}
                    />
                </div>

                {/* Helper Text */}
                {!isRolling && !pendingEffect && (
                    <div style={{
                        color: '#888',
                        marginTop: '10px',
                        fontSize: '0.9rem',
                        letterSpacing: '1px'
                    }}>
                        CLICK DIE TO ROLL
                    </div>
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
                        <h3>Drawing Mystery Gift...</h3>
                        <p style={{ fontSize: '0.8rem', color: '#888' }}>Auto-assigning from stack top...</p>
                    </div>
                )}

                {pendingEffect === 'reroll' && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h3>Reroll!</h3>
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                        >
                            <RefreshCw size={50} color="#4ade80" />
                        </motion.div>
                        <p style={{ color: '#aaa' }}>Auto-rolling...</p>
                        <button className="btn-primary" onClick={() => resolveEffect()}>
                            OK
                        </button>
                    </div>
                )}

                {/* Dice Result Display */}
                {!isRolling && lastDiceRoll && !pendingEffect && (
                    <div style={{ marginTop: '20px', fontSize: '1.5rem', color: '#888' }}>
                        Result: <span style={{ color: 'white', fontWeight: 'bold' }}>{lastDiceRoll}</span>
                    </div>
                )}
            </div>

            <QueueList />
        </div >
    );
};

export default GameControls;
