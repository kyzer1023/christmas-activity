import React from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';

const LeftPanel: React.FC = () => {
    const { giftQueue, gifts } = useGame();

    return (
        <div className="glass-panel" style={{
            width: '280px',
            height: 'calc(100vh - 40px)', // Padding compensation
            margin: '20px',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            zIndex: 10
        }}>
            <h3 style={{
                color: 'var(--color-gold)',
                marginTop: 0,
                marginBottom: '5px',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                letterSpacing: '2px',
                borderBottom: '1px solid rgba(255,215,0,0.3)',
                paddingBottom: '10px'
            }}>
                Gift Stack
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '24px', fontStyle: 'italic' }}>
                Next in Line
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
                <AnimatePresence>
                    {giftQueue.length === 0 ? (
                        <div style={{ color: '#444', fontStyle: 'italic' }}>No gifts left in stack.</div>
                    ) : (
                        giftQueue.map((giftId, index) => {
                            const gift = gifts.find(g => g.id === giftId);
                            const isNext = index === 0;
                            return (
                                <motion.div
                                    key={giftId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50, scale: 0.8 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '16px',
                                        background: isNext ? 'linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent)' : 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        border: isNext ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid transparent',
                                        boxShadow: isNext ? '0 0 15px rgba(255,215,0,0.05)' : 'none'
                                    }}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        background: isNext ? 'var(--color-gold)' : '#333',
                                        color: isNext ? 'black' : '#888',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        marginRight: '12px',
                                        boxShadow: isNext ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <Gift size={20} color={isNext ? 'var(--color-gold)' : '#666'} style={{ marginRight: '12px' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: isNext ? 'white' : '#aaa', fontWeight: isNext ? 'bold' : 'normal', fontSize: '0.9rem' }}>
                                            Gift #{gift?.label}
                                        </span>
                                        {isNext && <span style={{ fontSize: '0.6rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Target</span>}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LeftPanel;
