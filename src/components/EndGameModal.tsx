import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCcw } from 'lucide-react';

const EndGameModal: React.FC = () => {
    const { giftQueue, resetGame } = useGame();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Trigger when queue is empty.
        // We might want to check if the game has actually started (gifts > 0 initial) 
        // effectively handled if init state has empty queue but phase is SETUP.
        // So check logic: if phase === 'GAME' and giftQueue.length === 0
        if (giftQueue.length === 0) {
            // A small delay to let the last animation finish potentially
            const timer = setTimeout(() => setIsOpen(true), 2000);
            return () => clearTimeout(timer);
        } else {
            setIsOpen(false);
        }
    }, [giftQueue]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000,
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(8px)'
                }}>
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring', duration: 0.8 }}
                        className="card"
                        style={{
                            maxWidth: '500px',
                            width: '90%',
                            textAlign: 'center',
                            border: '1px solid var(--color-gold)',
                            background: 'var(--color-surface)'
                        }}
                    >
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            transition={{
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 1.5
                            }}
                        >
                            <Trophy size={80} color="var(--color-gold)" style={{ marginBottom: '20px' }} />
                        </motion.div>

                        <h2 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                            All Gifts Distributed!
                        </h2>

                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', fontSize: '1.2rem' }}>
                            The event has concluded. Merry Christmas!
                        </p>

                        <button
                            className="btn-primary"
                            onClick={() => {
                                setIsOpen(false);
                                resetGame();
                            }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto',
                                fontSize: '1.2rem', padding: '15px 30px'
                            }}
                        >
                            <RefreshCcw size={20} />
                            Start New Game
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EndGameModal;
