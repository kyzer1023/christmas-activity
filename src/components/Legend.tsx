import React from 'react';


const Legend: React.FC = () => {
    // Colors matching the tile glow colors (queue_draw=red, skip=blue)
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
            padding: '16px 20px',
            borderRadius: '12px',
            zIndex: 20,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: 'rgba(10, 10, 20, 0.75)',
            border: '1px solid rgba(255, 215, 0, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}>
            <h4 style={{ 
                margin: '0 0 12px 0', 
                color: '#ffd700', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 600,
                textShadow: '0 0 10px rgba(255, 215, 0, 0.4)'
            }}>
                Tile Legend
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((item) => (
                    <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '3px',
                            backgroundColor: 'rgba(20, 20, 30, 0.8)',
                            border: `2px solid ${item.color}`,
                            boxShadow: `0 0 8px ${item.color}, 0 0 12px ${item.color}40`,
                        }} />
                        <span style={{ 
                            fontSize: '0.72rem', 
                            color: '#c8c8d8',
                            letterSpacing: '0.3px'
                        }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Legend;
