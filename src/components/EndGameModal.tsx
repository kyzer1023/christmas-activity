import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, TreePine, RefreshCcw, Star } from 'lucide-react';

// Snowflake component for the falling snow effect
const Snowflake: React.FC<{ delay: number; left: number; duration: number }> = ({ delay, left, duration }) => (
    <motion.div
        initial={{ y: -20, opacity: 0, rotate: 0 }}
        animate={{ 
            y: '100vh', 
            opacity: [0, 1, 1, 0], 
            rotate: 360 
        }}
        transition={{ 
            duration, 
            delay, 
            repeat: Infinity,
            ease: 'linear'
        }}
        style={{
            position: 'absolute',
            left: `${left}%`,
            top: 0,
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.6)',
            pointerEvents: 'none',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
        }}
    >
        ❄
    </motion.div>
);

// Decorative ornament
const Ornament: React.FC<{ color: string; size: number; style?: React.CSSProperties }> = ({ color, size, style }) => (
    <motion.div
        animate={{ 
            rotate: [-5, 5, -5],
            y: [-2, 2, -2]
        }}
        transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: 'easeInOut'
        }}
        style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${color}, ${color}88)`,
            boxShadow: `0 0 20px ${color}66, inset 0 -5px 15px rgba(0,0,0,0.3)`,
            position: 'relative',
            ...style
        }}
    >
        {/* Ornament cap */}
        <div style={{
            position: 'absolute',
            top: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: size * 0.3,
            height: 8,
            background: 'linear-gradient(180deg, #D4AF37, #8B7355)',
            borderRadius: '3px 3px 0 0'
        }} />
    </motion.div>
);

const EndGameModal: React.FC = () => {
    const { giftQueue, resetGame } = useGame();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (giftQueue.length === 0) {
            const timer = setTimeout(() => setIsOpen(true), 2000);
            return () => clearTimeout(timer);
        } else {
            setIsOpen(false);
        }
    }, [giftQueue]);

    // Generate snowflakes
    const snowflakes = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        delay: Math.random() * 5,
        left: Math.random() * 100,
        duration: 8 + Math.random() * 6
    }));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        zIndex: 1000,
                        background: 'linear-gradient(180deg, rgba(10, 10, 20, 0.95) 0%, rgba(15, 25, 20, 0.98) 100%)',
                        backdropFilter: 'blur(12px)',
                        overflow: 'hidden'
                    }}
                >
                    {/* Falling Snowflakes */}
                    {snowflakes.map(flake => (
                        <Snowflake 
                            key={flake.id} 
                            delay={flake.delay} 
                            left={flake.left} 
                            duration={flake.duration}
                        />
                    ))}

                    {/* Ambient glow effects */}
                    <div style={{
                        position: 'absolute',
                        top: '20%',
                        left: '10%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(196, 30, 58, 0.15) 0%, transparent 70%)',
                        pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '20%',
                        right: '10%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(22, 91, 51, 0.15) 0%, transparent 70%)',
                        pointerEvents: 'none'
                    }} />

                    {/* Main Modal Card */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 50 }}
                        transition={{ type: 'spring', duration: 0.8, bounce: 0.4 }}
                        style={{
                            maxWidth: '520px',
                            width: '90%',
                            textAlign: 'center',
                            position: 'relative',
                            padding: '48px 40px',
                            borderRadius: '32px',
                            background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(18, 18, 32, 0.98) 100%)',
                            border: '2px solid rgba(212, 175, 55, 0.3)',
                            boxShadow: `
                                0 0 60px rgba(212, 175, 55, 0.15),
                                0 25px 80px rgba(0, 0, 0, 0.5),
                                inset 0 1px 0 rgba(255, 255, 255, 0.05)
                            `
                        }}
                    >
                        {/* Corner Ornaments */}
                        <div style={{ position: 'absolute', top: -15, left: 30 }}>
                            <Ornament color="#C41E3A" size={30} />
                        </div>
                        <div style={{ position: 'absolute', top: -12, right: 40 }}>
                            <Ornament color="#165B33" size={24} />
                        </div>

                        {/* Decorative top ribbon */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '120px',
                            height: '4px',
                            background: 'linear-gradient(90deg, transparent, var(--christmas-gold), transparent)',
                            borderRadius: '0 0 4px 4px'
                        }} />

                        {/* Icon Section */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '24px'
                            }}
                        >
                            <motion.div
                                animate={{ rotate: [-10, 10, -10] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <TreePine size={36} color="var(--christmas-green-light)" />
                            </motion.div>
                            
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                    background: 'linear-gradient(135deg, var(--christmas-gold-light), var(--christmas-gold))',
                                    borderRadius: '50%',
                                    padding: '20px',
                                    boxShadow: '0 0 40px rgba(212, 175, 55, 0.4)'
                                }}
                            >
                                <Gift size={48} color="var(--bg-dark)" strokeWidth={2.5} />
                            </motion.div>
                            
                            <motion.div
                                animate={{ rotate: [10, -10, 10] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <TreePine size={36} color="var(--christmas-green-light)" />
                            </motion.div>
                        </motion.div>

                        {/* Sparkle decorations */}
                        <div style={{ position: 'absolute', top: '25%', left: '15%' }}>
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Star size={16} fill="var(--christmas-gold)" color="var(--christmas-gold)" />
                            </motion.div>
                        </div>
                        <div style={{ position: 'absolute', top: '30%', right: '12%' }}>
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            >
                                <Sparkles size={18} color="var(--christmas-gold-light)" />
                            </motion.div>
                        </div>

                        {/* Main Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '2.8rem',
                                fontWeight: 700,
                                margin: '0 0 8px 0',
                                background: 'linear-gradient(135deg, var(--christmas-gold-light) 0%, var(--christmas-gold) 50%, #FFF8DC 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textShadow: 'none',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                            }}
                        >
                            All Gifts Delivered!
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{
                                color: 'var(--text-secondary)',
                                fontSize: '1.1rem',
                                marginBottom: '12px',
                                fontWeight: 500
                            }}
                        >
                            The Christmas exchange has concluded!
                        </motion.p>

                        {/* Festive message */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            style={{
                                padding: '16px 24px',
                                background: 'linear-gradient(135deg, rgba(196, 30, 58, 0.1) 0%, rgba(22, 91, 51, 0.1) 100%)',
                                borderRadius: '16px',
                                marginBottom: '32px',
                                border: '1px solid rgba(212, 175, 55, 0.15)'
                            }}
                        >
                            <p style={{
                                margin: 0,
                                fontSize: '1.3rem',
                                fontFamily: 'var(--font-display)',
                                fontStyle: 'italic',
                                color: 'var(--snow-white)',
                                letterSpacing: '0.5px'
                            }}>
                                ✨ Merry Christmas! ✨
                            </p>
                            <p style={{
                                margin: '8px 0 0 0',
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)'
                            }}>
                                May your gifts bring joy and happiness
                            </p>
                        </motion.div>

                        {/* Action Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setIsOpen(false);
                                resetGame();
                            }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                fontSize: '1.1rem',
                                padding: '18px 40px',
                                background: 'linear-gradient(135deg, var(--christmas-green) 0%, var(--christmas-green-dark) 100%)',
                                color: 'var(--snow-white)',
                                border: 'none',
                                borderRadius: '14px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                boxShadow: `
                                    0 4px 20px rgba(22, 91, 51, 0.4),
                                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                                `,
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 6px 30px rgba(22, 91, 51, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(22, 91, 51, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <RefreshCcw size={20} />
                            Play Again
                        </motion.button>

                        {/* Bottom decorative element */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '3px',
                            background: 'linear-gradient(90deg, transparent, var(--christmas-red), transparent)',
                            borderRadius: '4px 4px 0 0'
                        }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EndGameModal;
