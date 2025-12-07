import React from 'react';
import { useGame } from '../context/GameContext';
import { Gift } from 'lucide-react';

const QueueList: React.FC = () => {
    const { participants, gifts } = useGame();

    // Show only taken gifts? 
    // "just note down the gifts that were given (out)"
    // We can iterate through gifts that are 'taken'.
    const takenGifts = gifts.filter(g => g.status === 'taken');
    // Sort by id or when they were taken? 
    // We don't track timestamp, so just ID or reverse ID?
    // Let's filter participants with status 'done' and see who has what?
    // User wants "gifts that were given". A list of gifts.

    return (
        <div style={{ marginTop: '20px', flex: 1, overflowY: 'auto' }}>
            <h3 style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Gifts Given Out ({takenGifts.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {takenGifts.length === 0 && <div style={{ color: '#555', fontStyle: 'italic' }}>No gifts given yet.</div>}

                {takenGifts.map(gift => {
                    const owner = participants.find(p => p.id === gift.ownerId);
                    return (
                        <div key={gift.id} style={{
                            padding: '10px',
                            background: 'rgba(255,215,0,0.05)',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,215,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <Gift size={16} color="gold" />
                            <div>
                                <div style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>Gift #{gift.label}</div>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>Given to: {owner?.name || 'Unknown'}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QueueList;
