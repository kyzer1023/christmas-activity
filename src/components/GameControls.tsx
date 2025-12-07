import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { Dices, RefreshCw, Gift } from 'lucide-react';
import QueueList from './QueueList';

const GameControls: React.FC = () => {
    const {
        currentTurnId, participants, rollDice, isRolling,
        pendingEffect, resolveEffect, lastDiceRoll
    } = useGame();

    const currentPlayer = participants.find(p => p.id === currentTurnId);

    // Auto-resolve Queue Draw
    useEffect(() => {
        if (pendingEffect === 'queue_draw') {
            const timer = setTimeout(() => {
                resolveEffect();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [pendingEffect]);

    return (
        <div className="controls-container">
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h2 className="title-gradient" style={{ margin: 0 }}>Current Turn</h2>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {currentPlayer ? currentPlayer.name : "Waiting..."}
                </div>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 'auto'
            }}>

                {!pendingEffect && (
                    <button
                        className="btn-primary"
                        onClick={() => rollDice()}
                        disabled={isRolling || !currentPlayer}
                        style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '50%',
                            fontSize: '1.4rem',
                            boxShadow: '0 0 30px rgba(212, 36, 38, 0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '4px solid findViewById'
                        }}
                    >
                        {isRolling ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                            >
                                <Dices size={50} />
                            </motion.div>
                        ) : (
                            <>
                                <Dices size={50} style={{ marginBottom: 10 }} />
                                ROLL
                            </>
                        )}
                    </button>
                )}

                {pendingEffect === 'queue_draw' && (
                    <div style={{ textAlign: 'center' }}>
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
                    <div style={{ textAlign: 'center' }}>
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
                    <div style={{ marginTop: '30px', fontSize: '1.5rem', color: '#888' }}>
                        Last Roll: <span style={{ color: 'white', fontWeight: 'bold' }}>{lastDiceRoll}</span>
                    </div>
                )}
            </div>

            <QueueList />
        </div >
    );
};

export default GameControls;
