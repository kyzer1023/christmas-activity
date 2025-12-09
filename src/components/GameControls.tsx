import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { RefreshCw, Gift, Sparkles } from 'lucide-react';
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
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(180deg, rgba(18, 18, 32, 0.9) 0%, rgba(12, 12, 24, 0.95) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.12)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)'
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
                            color: 'var(--christmas-gold)',
                            marginTop: '30px',
                            fontSize: '0.8rem',
                            letterSpacing: '2px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Sparkles size={14} />
                        Click Die to Roll
                        <Sparkles size={14} />
                    </motion.div>
                )}


                {pendingEffect === 'queue_draw' && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.2 }}
                            transition={{ type: 'spring' }}
                            style={{ 
                                color: 'var(--frost-blue)',
                                background: 'rgba(168, 213, 226, 0.1)',
                                borderRadius: '50%',
                                padding: '16px',
                                display: 'inline-block'
                            }}
                        >
                            <Gift size={50} />
                        </motion.div>
                        <h3 style={{ 
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-display)',
                            marginTop: '16px'
                        }}>
                            Drawing Mystery Gift...
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Auto-assigning from stack top...
                        </p>
                    </div>
                )}

                {pendingEffect === 'reroll' && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h3 style={{ 
                            color: 'var(--christmas-gold)',
                            fontFamily: 'var(--font-display)'
                        }}>
                            Reroll!
                        </h3>
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            style={{
                                display: 'inline-block',
                                background: 'rgba(22, 91, 51, 0.2)',
                                borderRadius: '50%',
                                padding: '12px'
                            }}
                        >
                            <RefreshCw size={40} color="var(--christmas-green-light)" />
                        </motion.div>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>Auto-rolling...</p>
                        <button 
                            className="btn-secondary" 
                            onClick={() => resolveEffect()} 
                            style={{ marginTop: '10px', padding: '10px 24px' }}
                        >
                            CONTINUE
                        </button>
                    </div>
                )}

                {/* Dice Result Display */}
                {!isRolling && lastDiceRoll && !pendingEffect && (
                    <div style={{
                        marginTop: '20px',
                        fontSize: '1.1rem',
                        color: 'var(--text-secondary)',
                        background: 'rgba(0, 0, 0, 0.3)',
                        padding: '12px 24px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        Rolled: <span style={{ 
                            color: 'var(--christmas-gold)', 
                            fontWeight: 700,
                            fontSize: '1.2rem'
                        }}>{lastDiceRoll}</span>
                    </div>
                )}
            </div>

            <QueueList />
        </div >
    );
};

export default GameControls;
