import React from 'react';
import { Cpu, Server, Network } from 'lucide-react';

const ArchitecturePage = () => {
    return (
        <div className="page-container" style={{ animation: 'fadeIn 0.5s ease' }}>
            <h2 className="page-title">SYSTEM ARCHITECTURE // ISLAND PROTOCOL</h2>
            
            <div className="tech-panel" style={{ marginBottom: '2rem' }}>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                    Traditional agentic malware escapes detection by distributing its logic across volatile memory,
                    avoiding static signatures. The AMMAM Core intercepts this by dividing memory into discrete chunks 
                    and executing Spatial Entropy Mapping.
                </p>
            </div>

            <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className="tech-panel">
                    <Server color="var(--accent-green)" size={32} style={{ marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '1rem' }}>Memory Ingestion</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Raw physical dumps (.mem / .raw) are instantly sliced into manageable clusters. Heuristic filters immediately drop blocks with near-zero entropy to conserve cycles.
                    </p>
                </div>
                
                <div className="tech-panel">
                    <Network color="var(--accent-amber)" size={32} style={{ marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '1rem' }}>Spatial Entropy Map</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        We compute the Shannon Entropy for each block. Advanced LLM payloads exhibit unnaturally high entropy and density. These are isolated into "Islands".
                    </p>
                </div>

                <div className="tech-panel">
                    <Cpu color="var(--accent-red)" size={32} style={{ marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '1rem' }}>Heuristic Extraction</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Cross-referencing Islands with known Agentic behavior models. Extracted blocks are parsed sequentially to rebuild the adversary's logic and intentions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ArchitecturePage;
