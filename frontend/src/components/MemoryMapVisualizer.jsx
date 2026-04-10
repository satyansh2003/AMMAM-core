import React from 'react';

const MemoryMapVisualizer = ({ gridData }) => {
  // Configured to match the backend grid
  const gridWidth = 40; 
  const gridHeight = 25;

  const getHeatmapColor = (block) => {
    // Ensure suspicious islands are highly visible
    const intensity = 0.4 + (block.entropy * 0.6);
    
    if (block.islandId > 0) {
      if (block.islandId === 1) return `rgba(255, 51, 102, ${intensity})`; // Red
      if (block.islandId === 2) return `rgba(0, 240, 255, ${intensity})`; // Cyan
      return `rgba(255, 187, 0, ${intensity})`; // Amber
    }
    // Normal memory background entropy - keep very subtle
    return `rgba(0, 255, 106, ${0.05 + block.entropy * 0.15})`; 
  };

  const getGlowColor = (block) => {
    if (block.islandId === 1) return 'rgba(255, 51, 102, 0.4)';
    if (block.islandId === 2) return 'rgba(0, 240, 255, 0.4)';
    return 'rgba(255, 187, 0, 0.4)';
  };

  return (
    <div className="tech-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', margin: 0 }}>VOLATILE MEMORY ENTROPY CLUSTERS</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '12px', height: '12px', background: 'rgba(0, 255, 106, 0.2)', border: '1px solid rgba(0, 255, 106, 0.4)' }}></div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>NOMINAL MEMORY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '12px', height: '12px', background: 'rgba(255, 51, 102, 0.8)', boxShadow: '0 0 5px rgba(255,51,102,0.5)' }}></div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>ISLAND 1: DROPPER</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '12px', height: '12px', background: 'rgba(0, 240, 255, 0.8)', boxShadow: '0 0 5px rgba(0,240,255,0.5)' }}></div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>ISLAND 2: POISONING</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '12px', height: '12px', background: 'rgba(255, 187, 0, 0.8)', boxShadow: '0 0 5px rgba(255,187,0,0.5)' }}></div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>ISLAND 3+: C2 CHANNEL</span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
        gap: '2px', // Slightly larger gap for clarity
        background: 'var(--bg-core)',
        padding: '4px',
        border: '1px solid #222',
        borderRadius: '4px'
      }}>
        {gridData.map((block) => (
          <div
            key={block.id}
            title={`ADDR: 0x${block.id.toString(16).padStart(4, '0').toUpperCase()}\nENTROPY: ${block.entropy.toFixed(3)}\nCLASS: ${block.islandId > 0 ? 'ANOMALOUS ISLAND ' + block.islandId : 'NOMINAL'}`}
            style={{
              aspectRatio: '1',
              backgroundColor: getHeatmapColor(block),
              transition: 'all 0.3s ease',
              cursor: 'crosshair',
              borderRadius: '1px',
              boxShadow: block.isSuspicious ? `0 0 8px ${getGlowColor(block)}` : 'none',
              zIndex: block.isSuspicious ? 10 : 1,
              transform: block.isSuspicious ? 'scale(1.1)' : 'scale(1)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryMapVisualizer;
