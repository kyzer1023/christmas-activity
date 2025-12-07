import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Gift } from 'lucide-react';
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
            textAlign: 'center'
        }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="card"
                style={{ maxWidth: '400px', width: '90%' }}
            >
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <Gift size={64} color="var(--color-primary)" />
                </div>
                <h1 className="title-gradient" style={{ margin: '0 0 10px 0' }}>Christmas Exchange</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>
                    Enter the number of participants/gifts to begin the activity.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Number of Participants
                        </label>
                        <input
                            type="number"
                            min="2"
                            max="50"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #333',
                                backgroundColor: '#000',
                                color: 'white',
                                fontSize: '18px',
                                textAlign: 'center'
                            }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '18px' }}>
                        Start Activity
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default SetupScreen;
