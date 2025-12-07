import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

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
        // If we want index i at top (0 deg):
        // Visual Rotation = - (i * segmentDeg + segmentDeg/2)
        // Add full spins
        const targetRotation = fullSpins + (360 - (winnerIndex * segmentDeg + segmentDeg / 2));

        // Add some noise (+/- 40% of segment)
        const noise = (Math.random() - 0.5) * (segmentDeg * 0.8);

        setRotation(targetRotation + noise);

        setTimeout(() => {
            onComplete(winner.id);
        }, 5500);
    };

    if (!isOpen) return null;

    // Construct Gradient String
    // Improve visibility by alternating distinct colors
    const len = wheelSegments.length > 0 ? wheelSegments.length : 1;
    const gradientString = `conic-gradient(
        ${wheelSegments.map((_, i) =>
        `${i % 2 === 0 ? '#C41E3A' : '#165B33'} ${(i / len) * 100}% ${((i + 1) / len) * 100}%`
    ).join(', ')}
    )`;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 9999, // Super high z-index
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{
                    width: '90%',
                    maxWidth: 500,
                    padding: '40px',
                    borderRadius: '24px',
                    backgroundColor: 'white',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    textAlign: 'center'
                }}
            >
                <h2 style={{
                    color: '#C41E3A',
                    marginTop: 0,
                    marginBottom: '30px',
                    fontFamily: 'serif',
                    fontSize: '2rem',
                    textTransform: 'uppercase'
                }}>
                    Fortune Wheel
                </h2>

                <div style={{ position: 'relative', width: 300, height: 300, marginBottom: '30px' }}>
                    {/* Pointer Triangle */}
                    <div style={{
                        position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)',
                        width: 0, height: 0,
                        borderLeft: '20px solid transparent',
                        borderRight: '20px solid transparent',
                        borderTop: '35px solid #222',
                        zIndex: 20,
                        filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.3))'
                    }} />

                    {/* Wheel Container */}
                    <motion.div
                        style={{
                            width: '100%', height: '100%',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '8px solid #222',
                            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.2)'
                        }}
                        animate={{ rotate: rotation }}
                        transition={{ duration: 5, ease: [0.15, 0.8, 0.25, 1] }} // Bezier for spin feeling
                    >
                        {/* Background Colors (Slices) used absolute to avoid nesting issues */}
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
                                        top: '20px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        color: 'white',
                                        fontWeight: '900',
                                        fontSize: '1.4rem',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    }}>
                                        {gift.label}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {!isSpinning && (
                    <button
                        className="btn-primary"
                        style={{
                            fontSize: '1.2rem',
                            padding: '16px 48px',
                            background: 'linear-gradient(135deg, #C41E3A 0%, #a01830 100%)',
                            border: 'none',
                            boxShadow: '0 5px 20px rgba(196, 30, 58, 0.4)'
                        }}
                        onClick={handleSpin}
                    >
                        SPIN IT!
                    </button>
                )}
                {isSpinning && <div style={{ color: '#888', fontStyle: 'italic', height: '54px', display: 'flex', alignItems: 'center' }}>Best of luck!</div>}
            </motion.div>
        </div>
    );
};

export default WheelModal;
