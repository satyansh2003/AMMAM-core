import React from 'react';
import { Users, ShieldCheck, Code, AlertTriangle } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="page-container" style={{ animation: 'fadeIn 0.5s ease' }}>
            <h2 className="page-title">OPERATION DETAILS // ABOUT AMMAM</h2>
            
            <div className="grid-container" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="tech-panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <ShieldCheck color="var(--accent-green)" size={28} />
                            <h3>PROJECT MISSION</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            The Algorithmic Memory Mapping for Agentic Malware (AMMAM) project was developed
                            for the <strong>ISB Hackathon on Cybersecurity & AI Safety 2025–26</strong>. 
                        </p>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginTop: '1rem' }}>
                            As AI-driven agents become more autonomous, their potential to act as undetectable,
                            polymorphic malware increases exponentially. AMMAM is a proof-of-concept defense system 
                            designed to track and isolate these agentic threats entirely within volatile memory layers 
                            by identifying the unique geometric patterns of their LLM-generated logic structures.
                        </p>
                    </div>

                    <div className="tech-panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <Code color="var(--accent-amber)" size={28} />
                            <h3>TECHNICAL STACK</h3>
                        </div>
                        <ul className="tech-list">
                            <li><strong>Backend Interface:</strong> Java Spring Boot (REST API, Island Protocol Engine)</li>
                            <li><strong>Frontend Environment:</strong> React, Vite, React Router</li>
                            <li><strong>Visual Analytics:</strong> Custom Spatial Grid Rendering</li>
                        </ul>
                    </div>
                </div>

                <div className="tech-panel" style={{ height: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Users color="var(--accent-red)" size={28} />
                        <h3>THREAT HUNTING TEAM</h3>
                    </div>
                    <div className="team-member" style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <strong style={{ display: 'block', color: 'var(--text-bright)', marginBottom: '0.5rem' }}>LEAD SECURITY ENGINEER</strong>
                        <span style={{ color: 'var(--text-muted)' }}>Classified</span>
                    </div>
                    <div className="team-member" style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <strong style={{ display: 'block', color: 'var(--text-bright)', marginBottom: '0.5rem' }}>AI SAFETY RESEARCHER</strong>
                        <span style={{ color: 'var(--text-muted)' }}>Classified</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', marginTop: '2rem', fontSize: '0.875rem' }}>
                        <AlertTriangle size={16} />
                        <span>CLEARANCE LEVEL OVERRIDE REQUIRED FOR FULL ROSTER</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
