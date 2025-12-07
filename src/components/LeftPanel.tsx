import React from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';

const LeftPanel: React.FC = () => {
    const { giftQueue, gifts } = useGame();

    return (
        <div style={{
            width: '250px',
            background: 'rgba(20, 20, 20, 0.9)',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            boxShadow: '4px 0 10px rgba(0,0,0,0.5)',
            overflowY: 'auto'
        }}>
            <h3 style={{
                color: 'var(--color-gold)',
                marginTop: 0,
                marginBottom: '5px',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                letterSpacing: '1px'
            }}>
                Gift Stack
            </h3>
            <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: '20px', fontStyle: 'italic' }}>
                Predetermined Order (Base Logic)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <AnimatePresence>
                    {giftQueue.length === 0 ? (
                        <div style={{ color: '#444', fontStyle: 'italic' }}>No gifts left in stack.</div>
                    ) : (
                        giftQueue.map((giftId, index) => {
                            const gift = gifts.find(g => g.id === giftId);
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
                                        padding: '10px',
                                        background: index === 0 ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        border: index === 0 ? '1px solid rgba(255, 215, 0, 0.5)' : '1px solid transparent'
                                    }}
                                >
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        background: index === 0 ? 'var(--color-gold)' : '#333',
                                        color: index === 0 ? 'black' : '#888',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        marginRight: '10px'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <Gift size={16} color={index === 0 ? 'var(--color-gold)' : '#888'} style={{ marginRight: '8px' }} />
                                    <span style={{ color: index === 0 ? 'white' : '#aaa', fontWeight: index === 0 ? 'bold' : 'normal' }}>
                                        Gift #{gift?.label}
                                    </span>
                                    {index === 0 && (
                                        <span style={{
                                            marginLeft: 'auto',
                                            fontSize: '0.6rem',
                                            background: 'var(--color-gold)',
                                            color: 'black',
                                            padding: '2px 4px',
                                            borderRadius: '4px',
                                            fontWeight: 'bold'
                                        }}>
                                            NEXT
                                        </span>
                                    )}
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
