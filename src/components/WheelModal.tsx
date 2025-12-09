import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Sparkles } from 'lucide-react';

interface WheelModalProps {
    isOpen: boolean;
    onComplete: (giftId: number) => void;
}

const WheelModal: React.FC<WheelModalProps> = ({ isOpen, onComplete }) => {
    const { gifts } = useGame();
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);

    // Filter available gifts
    const availableGifts = gifts.filter(g => g.status === 'pool');

    // State to hold the stable segments for this open session
    const [wheelSegments, setWheelSegments] = useState<typeof availableGifts>([]);

    useEffect(() => {
        if (isOpen && availableGifts.length > 0) {
            const shuffled = [...availableGifts].sort(() => 0.5 - Math.random());
            setWheelSegments(shuffled.slice(0, 12));
            setRotation(0);
            setIsSpinning(false);
        }
    }, [isOpen]);

    const handleSpin = () => {
        if (isSpinning || wheelSegments.length === 0) return;
        setIsSpinning(true);

        const winnerIndex = Math.floor(Math.random() * wheelSegments.length);
        const winner = wheelSegments[winnerIndex];

        // Rotation logic
        const segmentDeg = 360 / wheelSegments.length;
        // Start full spins
        const fullSpins = 360 * 6;

        // Calculate angle to land on.
        const targetRotation = fullSpins + (360 - (winnerIndex * segmentDeg + segmentDeg / 2));

        // Add some noise (+/- 40% of segment)
        const noise = (Math.random() - 0.5) * (segmentDeg * 0.8);

        setRotation(targetRotation + noise);

        setTimeout(() => {
            onComplete(winner.id);
        }, 5500);
    };

    if (!isOpen) return null;

    // Construct Gradient String with Christmas colors
    const len = wheelSegments.length > 0 ? wheelSegments.length : 1;
    const gradientString = `conic-gradient(
        ${wheelSegments.map((_, i) =>
        `${i % 2 === 0 ? 'var(--christmas-red)' : 'var(--christmas-green)'} ${(i / len) * 100}% ${((i + 1) / len) * 100}%`
    ).join(', ')}
    )`;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(10, 10, 20, 0.9)',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)'
        }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{
                    width: '90%',
                    maxWidth: 520,
                    padding: '48px 40px',
                    borderRadius: 'var(--radius-xl)',
                    background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.98) 0%, rgba(18, 18, 32, 0.99) 100%)',
                    border: '2px solid rgba(212, 175, 55, 0.25)',
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(212, 175, 55, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    textAlign: 'center'
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

                {/* Title */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '32px'
                }}>
                    <Sparkles size={24} color="var(--christmas-gold)" />
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        background: 'linear-gradient(135deg, var(--christmas-gold-light) 0%, var(--christmas-gold) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: 0,
                        fontSize: '2rem',
                        fontWeight: 700,
                        letterSpacing: '1px'
                    }}>
                        Fortune Wheel
                    </h2>
                    <Sparkles size={24} color="var(--christmas-gold)" />
                </div>

                {/* Wheel Container */}
                <div style={{ position: 'relative', width: 300, height: 300, marginBottom: '32px' }}>
                    {/* Pointer Triangle */}
                    <div style={{
                        position: 'absolute', 
                        top: -18, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        width: 0, 
                        height: 0,
                        borderLeft: '18px solid transparent',
                        borderRight: '18px solid transparent',
                        borderTop: '32px solid var(--christmas-gold)',
                        zIndex: 20,
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                    }} />

                    {/* Wheel */}
                    <motion.div
                        style={{
                            width: '100%', 
                            height: '100%',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '6px solid var(--christmas-gold)',
                            boxShadow: `
                                inset 0 0 40px rgba(0,0,0,0.3), 
                                0 0 30px rgba(212, 175, 55, 0.3),
                                0 10px 40px rgba(0,0,0,0.4)
                            `
                        }}
                        animate={{ rotate: rotation }}
                        transition={{ duration: 5, ease: [0.15, 0.8, 0.25, 1] }}
                    >
                        {/* Background Colors (Slices) */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: gradientString,
                            zIndex: 0
                        }} />

                        {/* Labels */}
                        {wheelSegments.map((gift, i) => {
                            const angle = (360 / len) * i + (360 / len) / 2;
                            return (
                                <div
                                    key={gift.id}
                                    style={{
                                        position: 'absolute',
                                        top: '50%', left: '50%',
                                        width: '100%', height: '100%',
                                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                                        pointerEvents: 'none',
                                        zIndex: 1
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '18px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        color: 'var(--snow-white)',
                                        fontWeight: 800,
                                        fontSize: '1.3rem',
                                        textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                                        fontFamily: 'var(--font-body)'
                                    }}>
                                        {gift.label}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Center circle */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--christmas-gold-light), var(--christmas-gold))',
                            boxShadow: '0 0 20px rgba(212, 175, 55, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
                            zIndex: 10,
                            border: '3px solid rgba(255,255,255,0.2)'
                        }} />
                    </motion.div>
                </div>

                {/* Spin Button or Status */}
                {!isSpinning ? (
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-primary"
                        style={{
                            fontSize: '1.15rem',
                            padding: '18px 56px',
                            background: 'linear-gradient(135deg, var(--christmas-red) 0%, var(--christmas-red-dark) 100%)',
                            boxShadow: '0 6px 25px rgba(196, 30, 58, 0.4)'
                        }}
                        onClick={handleSpin}
                    >
                        SPIN IT!
                    </motion.button>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ 
                            color: 'var(--text-secondary)', 
                            fontStyle: 'italic', 
                            height: '56px', 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '1.1rem'
                        }}
                    >
                        <Sparkles size={18} color="var(--christmas-gold)" />
                        Best of luck!
                        <Sparkles size={18} color="var(--christmas-gold)" />
                    </motion.div>
                )}

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

export default WheelModal;
