import React, { useState } from 'react';
import { Terminal, Filter, Download, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

// Generating a larger mock dataset for the logs page
const generateMockLogs = () => {
    const logs = [];
    const types = ['DEEP_SCAN', 'QUICK_SCAN', 'FULL_MEMORY_DUMP', 'HEURISTIC_SWEEP', 'TARGETED_PAYLOAD_HUNT'];
    const risks = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE'];
    
    for (let i = 1; i <= 50; i++) {
        const risk = risks[Math.floor(Math.random() * risks.length)];
        const items = risk === 'NONE' ? 0 : Math.floor(Math.random() * 200) + 1;
        // Generate random past dates
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 14));
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));

        logs.push({
            id: `SCN-${9000 - i}`,
            timestamp: date,
            status: 'COMPLETED',
            itemsFound: items,
            type: types[Math.floor(Math.random() * types.length)],
            risk: risk,
            duration: `${(Math.random() * 5 + 0.5).toFixed(1)}s`,
            operator: 'SYSTEM_AUTO'
        });
    }
    return logs.sort((a, b) => b.timestamp - a.timestamp);
};

const INITIAL_LOGS = generateMockLogs();

const LogsPage = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');

  const filteredLogs = logs.filter(log => {
      const matchSearch = log.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRisk = filterRisk === 'ALL' || log.risk === filterRisk;
      return matchSearch && matchRisk;
  });

  const getRiskColor = (risk) => {
      switch(risk) {
          case 'CRITICAL': return 'var(--accent-red)';
          case 'HIGH': return 'var(--accent-orange)';
          case 'MEDIUM': return 'var(--accent-yellow)';
          case 'LOW': return 'var(--accent-green)';
          default: return 'var(--text-secondary)';
      }
  };

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <button 
            onClick={() => navigate('/history')}
            style={{ background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-secondary)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
          >
            <ArrowLeft size={16} /> Back to Forensics
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', margin: 0, fontSize: '2rem' }}>
            <Terminal className="glow-icon" color="var(--text-primary)" size={32} /> FULL SCAN REGISTRY
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Comprehensive log of all automated and manual memory operations.
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, display: 'flex', position: 'relative', minWidth: '300px' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                  <Search size={18} />
              </div>
              <input 
                  type="text" 
                  placeholder="Search by Scan ID or Type..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '4px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
              />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--panel-bg)', padding: '0 1rem', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
              <Filter size={18} color="var(--text-secondary)" />
              <select 
                  value={filterRisk} 
                  onChange={(e) => setFilterRisk(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '0.8rem 0', outline: 'none', cursor: 'pointer' }}
              >
                  <option value="ALL">All Risk Levels</option>
                  <option value="CRITICAL">Critical Only</option>
                  <option value="HIGH">High Only</option>
                  <option value="MEDIUM">Medium Only</option>
              </select>
          </div>
      </div>

      <div style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr 1fr', padding: '1rem', borderBottom: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.02)', fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <div>Scan ID</div>
              <div>Type</div>
              <div>Timestamp</div>
              <div>Duration</div>
              <div>Anomalies</div>
              <div>Risk</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
             {filteredLogs.length === 0 ? (
                 <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                     No logs match your filter criteria.
                 </div>
             ) : (
                 filteredLogs.map((log) => (
                    <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr 1fr', padding: '1rem', borderBottom: '1px solid var(--panel-border)', alignItems: 'center', transition: 'background 0.2s' }} className="log-row">
                        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{log.id}</div>
                        <div>{log.type}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div style={{ fontFamily: 'var(--font-mono)' }}>{log.duration}</div>
                        <div style={{ fontWeight: 'bold' }}>{log.itemsFound}</div>
                        <div style={{ color: getRiskColor(log.risk), fontWeight: 'bold' }}>{log.risk}</div>
                    </div>
                 ))
             )}
          </div>
      </div>
    </div>
  );
};

export default LogsPage;
