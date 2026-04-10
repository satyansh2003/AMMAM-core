import React, { useCallback, useState, useRef, useEffect } from 'react';
import { UploadCloud, Terminal, X, RefreshCw } from 'lucide-react';

const UploadView = ({ onAnalyze, isAnalyzing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [simulatingUpload, setSimulatingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!simulatingUpload && !isAnalyzing && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, [simulatingUpload, isAnalyzing]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExecute = () => {
    if (!selectedFile) return;
    setSimulatingUpload(true);
    setUploadProgress(0);
    setUploadedBytes(0);

    const totalSize = selectedFile.size;
    const duration = 2500; // 2.5 seconds drama
    const interval = 50; 
    let elapsed = 0;

    const timer = setInterval(() => {
        elapsed += interval;
        const progressRaw = elapsed / duration;
        // Non-linear progress curve for cooler effect
        const progress = Math.min(1, Math.sin(progressRaw * Math.PI / 2)); 
        
        setUploadProgress(progress);
        setUploadedBytes(Math.floor(progress * totalSize));

        if (progress >= 1) {
            clearInterval(timer);
            setTimeout(() => {
                setSimulatingUpload(false);
                onAnalyze(selectedFile);
            }, 200);
        }
    }, interval);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '2rem'
    }}>
      <div 
        className="tech-panel upload-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !simulatingUpload && !isAnalyzing && fileInputRef.current?.click()}
        style={{
          padding: '4rem',
          textAlign: 'center',
          border: isDragOver ? '2px dashed var(--accent-green)' : '2px dashed var(--glass-border)',
          transition: 'all 0.3s ease',
          background: isDragOver ? 'rgba(0, 255, 0, 0.05)' : 'var(--glass-bg)',
          width: '100%',
          maxWidth: '600px',
          cursor: (simulatingUpload || isAnalyzing) ? 'wait' : 'pointer',
          opacity: isAnalyzing ? 0.7 : 1
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          accept=".mem,.raw,.bin,.img"
        />
        
        {simulatingUpload ? (
            <div style={{ padding: '1rem 0' }}>
                <RefreshCw size={64} className="glow-icon" style={{ marginBottom: '1rem', color: 'var(--accent-cyan)', animation: 'spin 2s linear infinite' }} />
                <h2 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>UPLOADING TO SECURE ENCLAVE...</h2>
                
                <div style={{ width: '100%', background: '#000', height: '12px', border: '1px solid #333', marginTop: '1.5rem', position: 'relative' }}>
                    <div style={{ 
                        position: 'absolute', top: 0, left: 0, height: '100%', 
                        background: 'var(--accent-cyan)', 
                        width: `${uploadProgress * 100}%`,
                        transition: 'width 0.1s linear',
                        boxShadow: '0 0 10px var(--accent-cyan)'
                    }}></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    <span>UP: {(uploadedBytes / 1024 / 1024).toFixed(2)} MB / {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>{(uploadProgress * 100).toFixed(0)}%</span>
                </div>
            </div>
        ) : (
            <>
                <UploadCloud size={64} className="glow-icon" style={{ marginBottom: '1rem', color: 'var(--accent-green)' }} />
                <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>TARGET ACQUISITION</h2>
                
                {selectedFile ? (
                   <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', border: '1px outset #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ textAlign: 'left', fontFamily: 'var(--font-mono)', overflow: 'hidden' }}>
                            <div style={{ color: 'var(--text-bright)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '300px' }}>{selectedFile.name}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>SIZE: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                        <button onClick={clearFile} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }} title="Clear Target">
                            <X size={20} />
                        </button>
                   </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                        AWAITING MEMORY DUMP (.mem, .raw) - DRAG OR CLICK
                    </p>
                )}

                <button 
                    className="btn-primary" 
                    onClick={(e) => { e.stopPropagation(); handleExecute(); }} 
                    disabled={isAnalyzing || !selectedFile}
                >
                {isAnalyzing ? 'ENGINE INITIALIZING...' : 'INITIATE UPLOAD & SCAN'} 
                </button>
            </>
        )}
      </div>

      <div className="tech-panel" style={{ padding: '2rem', maxWidth: '600px', width: '100%', borderLeft: '4px solid var(--accent-amber)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Terminal color="var(--accent-amber)" size={24} />
          <h3 style={{ fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>SYSTEM DIRECTIVE</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
          Uploading an active memory forensics file will initiate a live Spatial Entropy Map. The system dynamically adjusts parsing models based on target binary signatures.
        </p>
      </div>
    </div>
  );
};

export default UploadView;
