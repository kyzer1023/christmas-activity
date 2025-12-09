import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Gift, Sparkles, TreePine } from 'lucide-react';
import { motion } from 'framer-motion';

const SetupScreen: React.FC = () => {
    const { startGame } = useGame();
    const [count, setCount] = useState<number>(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (count > 0) {
            startGame(count);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient background glows */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(196, 30, 58, 0.1) 0%, transparent 60%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '5%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(22, 91, 51, 0.1) 0%, transparent 60%)',
                pointerEvents: 'none'
            }} />

            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="card"
                style={{ 
                    maxWidth: '440px', 
                    width: '90%',
                    position: 'relative',
                    background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.9) 0%, rgba(18, 18, 32, 0.95) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(212, 175, 55, 0.05)'
                }}
            >
                {/* Decorative top accent */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100px',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, var(--christmas-gold), transparent)',
                    borderRadius: '0 0 3px 3px'
                }} />

                {/* Icon Section */}
                <div style={{ 
                    marginBottom: '24px', 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <motion.div
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <TreePine size={28} color="var(--christmas-green-light)" />
                    </motion.div>
                    
                    <motion.div
                        animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 3, -3, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{
                            background: 'linear-gradient(135deg, var(--christmas-red) 0%, var(--christmas-red-dark) 100%)',
                            borderRadius: '20px',
                            padding: '18px',
                            boxShadow: '0 0 30px rgba(196, 30, 58, 0.3)'
                        }}
                    >
                        <Gift size={48} color="var(--snow-white)" />
                    </motion.div>
                    
                    <motion.div
                        animate={{ rotate: [5, -5, 5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <TreePine size={28} color="var(--christmas-green-light)" />
                    </motion.div>
                </div>

                {/* Title */}
                <h1 
                    className="title-gradient" 
                    style={{ 
                        margin: '0 0 8px 0',
                        fontSize: '2.4rem',
                        letterSpacing: '0.5px'
                    }}
                >
                    Christmas Exchange
                </h1>
                
                {/* Subtitle */}
                <p style={{ 
                    color: 'var(--text-secondary)', 
                    marginBottom: '32px',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    <Sparkles size={14} color="var(--christmas-gold)" />
                    Enter the number of gifts to begin
                    <Sparkles size={14} color="var(--christmas-gold)" />
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '28px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '12px', 
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px'
                        }}>
                            Number of Gifts
                        </label>
                        <input
                            type="number"
                            min="2"
                            max="50"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid rgba(212, 175, 55, 0.2)',
                                backgroundColor: 'var(--bg-dark)',
                                color: 'var(--text-primary)',
                                fontSize: '1.25rem',
                                textAlign: 'center',
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--christmas-gold)';
                                e.target.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    
                    <motion.button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ 
                            width: '100%', 
                            fontSize: '1rem',
                            padding: '16px 24px'
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Start Activity
                    </motion.button>
                </form>

                {/* Bottom decorative accent */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, var(--christmas-red), transparent)',
                    borderRadius: '3px 3px 0 0'
                }} />
            </motion.div>
        </div>
    );
};

export default SetupScreen;
