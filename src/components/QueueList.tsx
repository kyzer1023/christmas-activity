import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Gift } from 'lucide-react';

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
                paddingRight: '4px' // prevent scrollbar overlap
            }}
        >
            <h3 style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Gift Log ({givenGifts.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '8px' }}>
                {/* using column-reverse or just normal mapping? 
                    "Chronological" usually means oldest top, newest bottom?
                    Or Newest top? 
                    User asked: "show the gifts that were given out in chronogical order"
                    Usually means 1st, 2nd, 3rd... so oldest at top.
                    But scrolling to bottom makes sense for a log.
                    Let's stick to standard order.
                */}

                {givenGifts.length === 0 && <div style={{ color: '#555', fontStyle: 'italic' }}>No gifts given yet.</div>}

                {givenGifts.map((giftId, index) => {
                    const gift = gifts.find(g => g.id === giftId);
                    if (!gift) return null;
                    return (
                        <div key={`${gift.id}-${index}`} style={{
                            padding: '10px',
                            background: 'rgba(255,215,0,0.05)',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,215,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#222',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                color: '#aaa',
                                border: '1px solid #333'
                            }}>
                                {index + 1}
                            </div>
                            <Gift size={16} color="gold" />
                            <div>
                                <div style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>Gift #{gift.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QueueList;
