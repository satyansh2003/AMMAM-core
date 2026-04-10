import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, ShieldAlert } from 'lucide-react';

const MetricsDashboard = ({ stats, timeMs }) => {
  const data = [
    {
      name: 'Agentic Threat Detection',
      Traditional: stats.traditionalDetectionRate,
      AMMAM: stats.ammamDetectionRate,
    },
    {
      name: 'Payload Extraction',
      Traditional: stats.traditionalExtractionRate,
      AMMAM: stats.payloadExtractionRate,
    }
  ];

  return (
    <div className="tech-panel" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}>
        <ShieldAlert color="var(--accent-red)" />
        COMPARATIVE ANALYSIS // EFFICACY
      </h2>

      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-elevated)" />
            <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fontFamily: 'var(--font-mono)'}} />
            <YAxis stroke="var(--text-muted)" unit="%" tick={{fontFamily: 'var(--font-mono)'}} />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-core)', border: '1px solid var(--accent-green)', borderRadius: '2px', fontFamily: 'var(--font-mono)' }} 
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)' }} />
            <Bar dataKey="Traditional" fill="var(--danger)" name="Traditional Hex-Signature Scanner" radius={[2, 2, 0, 0]} />
            <Bar dataKey="AMMAM" fill="var(--accent-green)" name="AMMAM (Spatial Entropy)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #333' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PERFORMANCE METRICS</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', border: '1px solid #222', padding: '1rem', borderRadius: '4px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-mono)' }}>
             <Clock color="var(--accent-green)" />
             <span>SCAN VELOCITY (16GB VOLATILE)</span>
           </div>
           <strong className="glow-icon" style={{ fontSize: '1.25rem', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
             {/* Converting MS to simulated minutes for demo UI scaling */}
             12.4 MIN
           </strong>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;
