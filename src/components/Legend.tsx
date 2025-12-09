import React from 'react';
import { Info } from 'lucide-react';

const Legend: React.FC = () => {
    // Colors matching the tile glow colors
    const items = [
        { color: '#00bfff', label: 'Queue Draw', type: 'queue_draw' },
        { color: '#ffd700', label: 'Random Event', type: 'random' },
        { color: '#ff4444', label: 'Skip Turn', type: 'skip' },
        { color: '#00ff88', label: 'Reroll Dice', type: 'reroll' },
    ];

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '25px',
            padding: '18px 22px',
            borderRadius: 'var(--radius-lg)',
            zIndex: 20,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: 'linear-gradient(180deg, rgba(18, 18, 32, 0.9) 0%, rgba(12, 12, 24, 0.95) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(212, 175, 55, 0.12)'
            }}>
                <Info size={14} color="var(--christmas-gold)" />
                <h4 style={{ 
                    margin: 0, 
                    color: 'var(--christmas-gold)', 
                    fontSize: '0.72rem', 
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    fontWeight: 600
                }}>
                    Tile Legend
                </h4>
            </div>
            
            {/* Legend Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((item) => (
                    <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(20, 20, 30, 0.9)',
                            border: `2px solid ${item.color}`,
                            boxShadow: `0 0 10px ${item.color}50, 0 0 4px ${item.color}30`,
                        }} />
                        <span style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--text-secondary)',
                            letterSpacing: '0.3px',
                            fontWeight: 500
                        }}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Legend;
