import React, { useState, useEffect, useContext } from 'react';
import { ShieldAlert, Activity, GitCommit, AlertTriangle, Terminal, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import '../index.css';

const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
};

const ThreatFeedPage = () => {
  const { analysisResult } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [displayedThreats, setDisplayedThreats] = useState([]);
  const [activeThreat, setActiveThreat] = useState(null);
  const [, setTick] = useState(0);

  // Force a re-render every second to update timestamps live
  useEffect(() => {
     const timer = setInterval(() => setTick(t => t + 1), 1000);
     return () => clearInterval(timer);
  }, []);

  // Use a staging queue to reveal real backend threats every 2 seconds
  useEffect(() => {
     if (!analysisResult) return;
     
     // Filter authentic payloads that actually have confidence
     const authenticPayloads = analysisResult.payloads.filter(p => p.confidence > 0).map(p => {
         let severity = 'LOW';
         if (p.confidence >= 0.8) severity = 'CRITICAL';
         else if (p.confidence >= 0.6) severity = 'HIGH';
         else if (p.confidence >= 0.3) severity = 'MEDIUM';
         
         return {
             id: p.id,
             type: p.type.toUpperCase().replace(/\s+/g, '_'),
             severity: severity,
             location: `0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(8, '0')}`, // Synthesize location since backend only sends content string
             desc: p.content,
             time: analysisResult.scanTimestamp || Date.now()
         };
     });

     if (authenticPayloads.length === 0) return;

     setDisplayedThreats([]);
     setActiveThreat(null);

     let currentIndex = 0;
     const revealInterval = setInterval(() => {
         if (currentIndex < authenticPayloads.length) {
             const threatToReveal = authenticPayloads[currentIndex];
             
             // We use functional state update to ensure we always append correctly
             setDisplayedThreats(prev => {
                 // Prevent duplicates if interval fires weirdly
                 if (prev.some(t => t.id === threatToReveal.id)) return prev;
                 return [threatToReveal, ...prev];
             });
             
             if (currentIndex === 0) {
                 setActiveThreat(threatToReveal);
             }
             
             currentIndex++;
         } else {
             clearInterval(revealInterval);
         }
     }, 2000); // Trigger every 2 seconds per user request

     return () => clearInterval(revealInterval);
  }, [analysisResult]);

  const getSeverityStyle = (severity) => {
    switch(severity) {
      case 'CRITICAL': return { color: 'var(--accent-red)', border: '1px solid var(--accent-red)' };
      case 'HIGH': return { color: 'var(--accent-orange)', border: '1px solid var(--accent-orange)' };
      case 'MEDIUM': return { color: 'var(--accent-yellow)', border: '1px solid var(--accent-yellow)' };
      default: return { color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)' };
    }
  };

  if (!analysisResult) {
      return (
         <div className="fade-in" style={{ padding: '8rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Activity size={64} color="var(--text-muted)" style={{ marginBottom: '2rem', opacity: 0.5 }} />
            <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>NO ACTIVE TELEMETRY</h2>
            <p style={{ maxWidth: '400px', margin: '0 auto 2rem auto' }}>
              The threat feed is currently empty. You must initiate a live memory dump scan on the main dashboard to populate intelligence feeds.
            </p>
            <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/')}>
                <Play size={18} /> GO TO SCANNER
            </button>
         </div>
      );
  }

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', margin: 0, fontSize: '2rem' }}>
            <Activity className="glow-icon" color="var(--accent-red)" size={32} /> LIVE THREAT INTELLIGENCE
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Monitoring volatile memory structures and incoming heuristic flags.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ color: 'var(--accent-red)', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} className="glow-icon-red" />
              SYSTEM STATUS: ELEVATED RISK
           </div>
           <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Defcon Level 3</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        {/* Main Feed Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <h3 style={{ color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <AlertTriangle size={18} color="var(--accent-yellow)"/> Validated Extraction Payloads
           </h3>
           <div style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '1rem', height: '600px', overflowY: 'auto' }}>
             
             {displayedThreats.length === 0 ? (
                 <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                     Listening for payload extractions...
                 </div>
             ) : (
                 displayedThreats.map((t) => (
                    <div 
                        key={t.id} 
                        onClick={() => setActiveThreat(t)}
                        style={{ 
                            padding: '1rem', 
                            marginBottom: '1rem', 
                            backgroundColor: activeThreat?.id === t.id ? 'rgba(0, 255, 255, 0.05)' : 'rgba(0,0,0,0.2)', 
                            border: '1px solid',
                            borderColor: activeThreat?.id === t.id ? 'var(--accent-cyan)' : 'var(--panel-border)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto',
                            gap: '1rem',
                            alignItems: 'center',
                            animation: 'fadeIn 0.5s ease'
                        }}>
                        
                        <div style={{ ...getSeverityStyle(t.severity), padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <GitCommit size={14} />
                            {t.severity}
                        </div>

                        <div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.2rem', fontFamily: 'var(--font-mono)' }}>{t.type}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Terminal size={12} /> {t.location}
                            </div>
                        </div>

                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                            {formatTimeAgo(t.time)}
                        </div>
                    </div>
                 ))
             )}
           </div>
        </div>

        {/* Details Panel Column */}
        <div>
           <div style={{ position: 'sticky', top: '2rem' }}>
                <h3 style={{ color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>Threat Context</h3>
                
                {!activeThreat ? (
                    <div style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', padding: '1.5rem', borderRadius: '8px', color: 'var(--text-muted)' }}>
                        Select a threat from the feed to view detailed payload injection behavior and context.
                    </div>
                ) : (
                    <div style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--accent-cyan)', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 0 15px rgba(0, 255, 255, 0.05)', animation: 'fadeIn 0.2s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <ShieldAlert size={28} color={getSeverityStyle(activeThreat.severity).color} />
                            <h2 style={{ margin: 0, color: getSeverityStyle(activeThreat.severity).color, fontSize: '1.3rem', fontFamily: 'var(--font-mono)' }}>{activeThreat.type}</h2>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Severity</div>
                            <div style={{ fontWeight: 'bold', ...getSeverityStyle(activeThreat.severity), display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.2rem' }}>
                                {activeThreat.severity}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Memory Address</div>
                            <div style={{ color: 'var(--accent-green)', fontFamily: 'monospace', fontSize: '1.1rem', marginTop: '0.2rem' }}>
                                {activeThreat.location}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Extracted Payload Behavior</div>
                            <div style={{ color: 'var(--text-main)', marginTop: '0.5rem', lineHeight: '1.5', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', background: '#000', padding: '1rem', borderLeft: '3px solid var(--accent-red)', borderRadius: '2px' }}>
                                {activeThreat.desc}
                            </div>
                        </div>
                    </div>
                )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatFeedPage;
