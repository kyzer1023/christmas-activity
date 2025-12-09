import React from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';

const LeftPanel: React.FC = () => {
    const { giftQueue, gifts } = useGame();

    return (
        <div className="glass-panel" style={{
            width: '280px',
            height: 'calc(100vh - 40px)',
            margin: '20px',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            zIndex: 10,
            background: 'linear-gradient(180deg, rgba(18, 18, 32, 0.9) 0%, rgba(12, 12, 24, 0.95) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.12)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '8px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(212, 175, 55, 0.15)'
            }}>
                <Sparkles size={16} color="var(--christmas-gold)" />
                <h3 style={{
                    color: 'var(--christmas-gold)',
                    margin: 0,
                    textTransform: 'uppercase',
                    fontSize: '0.85rem',
                    letterSpacing: '2px',
                    fontWeight: 600
                }}>
                    Gift Stack
                </h3>
            </div>
            
            <p style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.72rem', 
                marginBottom: '20px', 
                fontStyle: 'italic',
                letterSpacing: '0.5px'
            }}>
                Next in Line
            </p>

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px', 
                flex: 1, 
                overflowY: 'auto',
                paddingRight: '4px'
            }}>
                <AnimatePresence>
                    {giftQueue.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ 
                                color: 'var(--text-muted)', 
                                fontStyle: 'italic',
                                textAlign: 'center',
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px dashed rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            No gifts left in stack.
                        </motion.div>
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
                                        padding: '14px 16px',
                                        background: isNext 
                                            ? 'linear-gradient(90deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.02) 100%)' 
                                            : 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: 'var(--radius-md)',
                                        border: isNext 
                                            ? '1px solid rgba(212, 175, 55, 0.25)' 
                                            : '1px solid rgba(255, 255, 255, 0.05)',
                                        boxShadow: isNext 
                                            ? '0 0 20px rgba(212, 175, 55, 0.08)' 
                                            : 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {/* Position Badge */}
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        background: isNext 
                                            ? 'linear-gradient(135deg, var(--christmas-gold-light), var(--christmas-gold))' 
                                            : 'var(--bg-elevated)',
                                        color: isNext ? 'var(--bg-dark)' : 'var(--text-muted)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        marginRight: '12px',
                                        boxShadow: isNext 
                                            ? '0 0 15px rgba(212, 175, 55, 0.4)' 
                                            : 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
                                        border: isNext ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
                                    }}>
                                        {index + 1}
                                    </div>
                                    
                                    {/* Gift Icon */}
                                    <Gift 
                                        size={18} 
                                        color={isNext ? 'var(--christmas-gold)' : 'var(--text-muted)'} 
                                        style={{ marginRight: '12px' }} 
                                    />
                                    
                                    {/* Gift Info */}
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ 
                                            color: isNext ? 'var(--text-primary)' : 'var(--text-secondary)', 
                                            fontWeight: isNext ? 600 : 400, 
                                            fontSize: '0.9rem' 
                                        }}>
                                            Gift #{gift?.label}
                                        </span>
                                        {isNext && (
                                            <span style={{ 
                                                fontSize: '0.6rem', 
                                                color: 'var(--christmas-gold)', 
                                                textTransform: 'uppercase', 
                                                letterSpacing: '1px',
                                                fontWeight: 600,
                                                marginTop: '2px'
                                            }}>
                                                Current Target
                                            </span>
                                        )}
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
