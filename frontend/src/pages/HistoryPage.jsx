import React, { useState, useContext } from 'react';
import { History, BarChart2, Calendar, Filter, Download, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AppContext } from '../App';
import '../index.css';

const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const { scanHistory } = useContext(AppContext);
  const [timeRange, setTimeRange] = useState('7D');
  const [filterDate, setFilterDate] = useState('');

  // --- DERIVE METRICS FROM REAL HISTORY ---
  const totalScans = scanHistory.length;
  
  let totalEntropySum = 0;
  let totalEntropyBlocks = 0;
  let criticalInjectionsFound = 0;

  scanHistory.forEach(scan => {
      if (scan.gridData) {
          scan.gridData.forEach(block => {
              totalEntropySum += block.entropy;
              totalEntropyBlocks++;
          });
      }
      
      if (scan.payloads) {
          scan.payloads.forEach(p => {
              if (p.confidence >= 0.8) criticalInjectionsFound++;
          });
      }
  });

  const avgEntropyBaseline = totalEntropyBlocks > 0 ? (totalEntropySum / totalEntropyBlocks).toFixed(2) : '0.00';

  // --- PREPARE CHART DATA ---
  const chartData = scanHistory.map((scan, idx) => {
      const date = new Date(scan.scanTimestamp);
      let fragments = 0;
      let criticals = 0;
      
      if (scan.payloads) {
          fragments = scan.payloads.length;
          criticals = scan.payloads.filter(p => p.confidence >= 0.8).length;
      }
      
      return {
          id: scan.scanId || `SCN-GEN-${idx}`,
          timeLabel: `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`,
          fragments: fragments,
          criticalAlerts: criticals
      };
  });
  
  // Recent Logs mapped chronologically backwards
  const recentLogs = [...scanHistory].reverse().slice(0, 5).map((scan, idx) => {
      let critRisk = false;
      let highRisk = false;
      let itemsFound = 0;

      if (scan.payloads) {
          itemsFound = scan.payloads.length;
          critRisk = scan.payloads.some(p => p.confidence >= 0.8);
          highRisk = scan.payloads.some(p => p.confidence >= 0.6);
      }
      
      let riskStr = critRisk ? 'CRITICAL' : (highRisk ? 'HIGH' : 'LOW');
      if (itemsFound === 0) riskStr = 'SAFE';

      const scanIdFallback = scanHistory.length - idx;

      return {
          id: scan.scanId || `SCN-GEN-${scanIdFallback}`,
          time: formatTimeAgo(scan.scanTimestamp),
          status: 'COMPLETED',
          itemsFound: itemsFound,
          type: 'MEMORY_DUMP_SCAN',
          risk: riskStr
      };
  });

  const handleExport = () => {
    let content = 'ScanID,Time,TotalPayloads,CriticalAlerts\n';
    chartData.forEach(row => {
        content += `${row.id},${row.timeLabel},${row.fragments},${row.criticalAlerts}\n`;
    });
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AMMAM_HISTORY_REPORT.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFilterChange = (e) => {
      setFilterDate(e.target.value);
  };

  if (scanHistory.length === 0) {
      return (
         <div className="fade-in" style={{ padding: '8rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Activity size={64} color="var(--text-muted)" style={{ marginBottom: '2rem', opacity: 0.5 }} />
            <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>TELEMETRY DB EMPTY</h2>
            <p style={{ maxWidth: '400px', margin: '0 auto 2rem auto' }}>
              We've wiped the sample mock data as requested. You must run memory scans on the main dashboard to permanently populate your persistent local analytics.
            </p>
            <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/')}>
                GO TO SCANNER
            </button>
         </div>
      );
  }

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', margin: 0, fontSize: '2rem' }}>
            <History className="glow-icon" color="var(--accent-blue)" size={32} /> FORENSIC ANALYTICS
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Persistent session history and memory entropy trends.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                <Calendar size={16} /> 
                <input 
                    type="date" 
                    value={filterDate}
                    onChange={handleFilterChange}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', colorScheme: 'dark', fontFamily: 'var(--font-mono)' }}
                />
            </div>
            <button 
                onClick={handleExport}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                <Download size={16} /> Export Report
            </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem', animation: 'fadeIn 0.5s ease' }}>
         <div style={{ backgroundColor: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Session Scans</div>
            <div style={{ fontSize: '2.5rem', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{totalScans}</div>
         </div>
         <div style={{ backgroundColor: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Global Avg Entropy Baseline</div>
            <div style={{ fontSize: '2.5rem', color: 'var(--accent-green)', fontWeight: 'bold' }}>{avgEntropyBaseline}</div>
         </div>
         <div style={{ backgroundColor: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Critical Injections Traced</div>
            <div style={{ fontSize: '2.5rem', color: 'var(--accent-red)', fontWeight: 'bold' }}>{criticalInjectionsFound}</div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Charts Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           
           <div style={{ backgroundColor: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--panel-border)', animation: 'fadeIn 0.7s ease' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                   <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <BarChart2 size={18} color="var(--accent-blue)"/> Session Threat Payload Volume
                   </h3>
               </div>
               
               <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorFragments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="timeLabel" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'var(--accent-cyan)' }} />
                      <Area type="monotone" dataKey="fragments" name="Payloads Extracted" stroke="var(--accent-cyan)" fillOpacity={1} fill="url(#colorFragments)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
           </div>

           <div style={{ backgroundColor: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--panel-border)', animation: 'fadeIn 0.9s ease' }}>
               <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <BarChart2 size={18} color="var(--accent-red)"/> Critical Inclusions by Scan
               </h3>
               <div style={{ height: '250px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="timeLabel" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'var(--accent-red)' }} cursor={{fill: 'rgba(255,0,0,0.1)'}} />
                      <Bar dataKey="criticalAlerts" name="Critical Thresholds" fill="var(--accent-red)" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
           </div>

        </div>

        {/* Recent Logs list */}
        <div style={{ backgroundColor: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--panel-border)', height: 'fit-content', animation: 'fadeIn 0.6s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h3 style={{ margin: 0 }}>Timeline Logs</h3>
               <Filter size={16} color="var(--text-secondary)" style={{cursor: 'pointer'}} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentLogs.map((scan) => (
                    <div key={scan.id} style={{ padding: '1rem', borderBottom: '1px solid var(--panel-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>{scan.id}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{scan.time}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-primary)' }}>{scan.type}</span>
                            <span style={{ fontWeight: 'bold', color: scan.risk === 'CRITICAL' ? 'var(--accent-red)' : scan.risk === 'HIGH' ? 'var(--accent-orange)' : scan.risk === 'SAFE' ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>
                                {scan.risk}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Isolated {scan.itemsFound} anomalous clusters.
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => navigate('/logs')}
                style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-mono)' }}>
                View Full Database Logs
            </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
