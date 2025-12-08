import React from 'react';


const Legend: React.FC = () => {
    const items = [
        { color: '#3b82f6', label: 'Queue Draw', type: 'queue_draw' },
        { color: '#FFD700', label: 'Random Event', type: 'random' },
        { color: '#ef4444', label: 'Skip Turn', type: 'skip' },
        { color: '#22c55e', label: 'Reroll Dice', type: 'reroll' },
    ];

    return (
        <div className="glass-panel" style={{
            position: 'absolute',
            top: '20px',
            left: '25px', // Adjusted to not overlap too much with left panel if it's there, but user said 'top left'
            // Actually LeftPanel is on the left. Legend should probably be integral to LeftPanel or floating?
            // User said "legend on the top left". The LeftPanel is titled "Gift Stack". 
            // Maybe this legend sits ON TOP of the board view, top-left relative to the board container?
            // Just putting it absolute in GameBoard will place it over the canvas.
            padding: '16px',
            borderRadius: '16px',
            zIndex: 20,
            backdropFilter: 'blur(10px)',
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--color-gold)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Tile Legend
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item) => (
                    <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            boxShadow: `0 0 8px ${item.color}`
                        }} />
                        <span style={{ fontSize: '0.75rem', color: '#e5e5e5' }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Legend;
