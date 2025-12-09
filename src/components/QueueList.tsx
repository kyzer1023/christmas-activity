import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Gift, CheckCircle } from 'lucide-react';

const QueueList: React.FC = () => {
    const { givenGifts, gifts } = useGame();
    const listRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when a new gift is added
    useEffect(() => {
        console.log('QueueList: givenGifts updated:', givenGifts);
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [givenGifts]);

    return (
        <div
            ref={listRef}
            style={{
                marginTop: '20px',
                flex: 1,
                overflowY: 'auto',
                paddingRight: '4px'
            }}
        >
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
            }}>
                <CheckCircle size={14} color="var(--christmas-green-light)" />
                <h3 style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '0.85rem', 
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    margin: 0,
                    fontWeight: 600
                }}>
                    Gift Log
                </h3>
                <span style={{
                    background: 'rgba(22, 91, 51, 0.2)',
                    color: 'var(--christmas-green-light)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem',
                    fontWeight: 600
                }}>
                    {givenGifts.length}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '8px' }}>
                {givenGifts.length === 0 && (
                    <div style={{ 
                        color: 'var(--text-muted)', 
                        fontStyle: 'italic',
                        textAlign: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px dashed rgba(255, 255, 255, 0.08)',
                        fontSize: '0.85rem'
                    }}>
                        No gifts given yet.
                    </div>
                )}

                {givenGifts.map((giftId, index) => {
                    const gift = gifts.find(g => g.id === giftId);
                    if (!gift) return null;
                    return (
                        <div key={`${gift.id}-${index}`} style={{
                            padding: '10px 12px',
                            background: 'linear-gradient(90deg, rgba(22, 91, 51, 0.08) 0%, transparent 100%)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(22, 91, 51, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s ease'
                        }}>
                            {/* Index Badge */}
                            <div style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: 'var(--bg-elevated)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                fontWeight: 600
                            }}>
                                {index + 1}
                            </div>
                            
                            {/* Gift Icon */}
                            <Gift size={14} color="var(--christmas-green-light)" />
                            
                            {/* Gift Label */}
                            <div>
                                <span style={{ 
                                    color: 'var(--christmas-gold)', 
                                    fontWeight: 600,
                                    fontSize: '0.85rem'
                                }}>
                                    Gift #{gift.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QueueList;
