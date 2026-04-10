import React, { useState } from 'react';
import { Download, FileWarning, Settings, HardDrive } from 'lucide-react';

const DumpGeneratorPage = () => {
    const [size, setSize] = useState(1);
    const [noiseLevel, setNoiseLevel] = useState(20);
    const [extension, setExtension] = useState('.mem');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateDump = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const bytes = size * 1024 * 1024;
            const buffer = new Uint8Array(bytes);
            
            // Fill with baseline random data
            for (let i = 0; i < bytes; i++) {
                buffer[i] = Math.floor(Math.random() * 255);
            }
            
            // Inject "Agentic Activity" based on noiseLevel slider
            const numIslands = Math.floor((noiseLevel / 100) * 50);
            for (let i = 0; i < numIslands; i++) {
                const islandSize = Math.floor(Math.random() * 4096) + 1024; // 1KB to 5KB island
                const startOffset = Math.floor(Math.random() * (bytes - islandSize));
                for(let j = 0; j < islandSize; j++) {
                    // High entropy repeating bytes to simulate payload logic
                    buffer[startOffset + j] = (j % 2 === 0) ? 0x90 : Math.floor(Math.random() * 255); 
                }
            }

            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            
            // For edge cases, we create a temporary anchor element and force download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const fileName = `agentic_sim_${size}MB_noise${noiseLevel}${extension}`;
            
            a.setAttribute('href', url);
            a.setAttribute('download', fileName);
            a.style.display = 'none';
            
            // Some browsers require the element to be in the DOM
            document.body.appendChild(a);
            
            // Trigger click
            a.click();
            
            // Cleanup safely after a delay to ensure browser handles the filename
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 500); // 500ms is safer for Chromium to register the download attribute
            
            setIsGenerating(false);
        }, 800); // UI delay for realism
    };

    return (
        <div className="page-container" style={{ animation: 'fadeIn 0.5s ease', maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="page-title">MEMORY DUMP GENERATOR UTILITY</h2>
            
            <div className="tech-panel" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <HardDrive color="var(--accent-red)" size={28} />
                    <h3>CREATE TARGET PAYLOAD</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>
                    Generate isolated binary physical memory dumps injected with configurable
                    levels of heuristic noise and spatial entropy simulating Agentic AI logic cycles.
                </p>

                <div style={{ background: '#000', padding: '2rem', border: '1px solid #222', borderRadius: '4px', marginBottom: '2rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <label style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>DUMP SIZE (MB)</label>
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{size} MB</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" max="50" 
                            value={size} 
                            onChange={(e) => setSize(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-green)' }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <label style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>AGENTIC NOISE INJECTION (%)</label>
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{noiseLevel}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="100" 
                            value={noiseLevel} 
                            onChange={(e) => setNoiseLevel(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <label style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>FILE FORMAT</label>
                        </div>
                        <select 
                            value={extension} 
                            onChange={(e) => setExtension(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-core)', color: 'var(--text-main)', border: '1px solid #333', borderRadius: '2px', fontFamily: 'var(--font-mono)' }}
                        >
                            <option value=".mem">.mem (Standard Memory Dump)</option>
                            <option value=".raw">.raw (Raw Data Capture)</option>
                        </select>
                    </div>
                </div>

                <button 
                    className="btn-primary" 
                    onClick={generateDump} 
                    disabled={isGenerating}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', padding: '1rem' }}
                >
                    {isGenerating ? <FileWarning className="glow-icon" color="var(--danger)" /> : <Download />}
                    {isGenerating ? 'COMPILING BINARY...' : `GENERATE & DOWNLOAD ${extension.toUpperCase()}`}
                </button>
            </div>

            <div className="tech-panel" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Settings color="var(--accent-cyan)" size={24} />
                    <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>USAGE PROTOCOL</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6', fontFamily: 'var(--font-mono)' }}>
                    Generated dumps are completely safe and contain neutralized 0x90 sled padding mapped
                    to pseudo-random spatial matrices. They are exclusively built to test the AMMAM Core
                    anomaly pipeline algorithms.
                </p>
            </div>
        </div>
    );
};

export default DumpGeneratorPage;
