import React, { useContext, useState } from 'react';
import { RotateCw, LogOut, Download, FileText, Printer, FileSpreadsheet, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import UploadView from '../components/UploadView';
import MemoryMapVisualizer from '../components/MemoryMapVisualizer';
import NetworkNodeGraph from '../components/NetworkNodeGraph';
import MetricsDashboard from '../components/MetricsDashboard';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const HomePage = () => {
    const { analysisResult, isAnalyzing, currentFile, startAnalysis, resetAnalysis } = useContext(AppContext);
    const navigate = useNavigate();
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);

    // Derived Analytics for Heuristics Summary
    let totalPayloads = 0;
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let peakEntropy = 0;

    if (analysisResult) {
        analysisResult.payloads.forEach(p => {
            if (p.confidence > 0) {
                totalPayloads++;
                if (p.confidence >= 0.8) criticalCount++;
                else if (p.confidence >= 0.6) highCount++;
                else mediumCount++;
            }
        });
        
        analysisResult.gridData.forEach(block => {
            if (block.entropy > peakEntropy) {
                peakEntropy = block.entropy;
            }
        });
    }

    const handleDownloadFormat = (format) => {
        if (!analysisResult) return;

        if (format === 'pdf') {
            setShowDownloadOptions(false);
            const input = document.getElementById('pdf-export-area');
            if (input) {
                html2canvas(input, { backgroundColor: '#090a0f', scale: 2 }).then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    // Calculate height maintaining aspect ratio
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    
                    pdf.setFontSize(16);
                    pdf.setTextColor(0, 240, 255);
                    pdf.text("AMMAM FORENSIC REPORT", 10, 10);
                    pdf.setFontSize(10);
                    pdf.setTextColor(150, 150, 150);
                    pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, 16);

                    const pageHeight = pdf.internal.pageSize.getHeight();
                    let position = 22;
                    let heightLeft = pdfHeight;

                    // Add first page
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                    heightLeft -= (pageHeight - position);

                    // Add subsequent pages if the image is taller than one page
                    while (heightLeft > 0) {
                        position = position - pageHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                        heightLeft -= pageHeight;
                    }
                    
                    pdf.save(`AMMAM_FORENSIC_REPORT_${new Date().getTime()}.pdf`);
                });
            } else {
                window.print(); // Fallback if element not found
            }
            return;
        }

        let content = '';
        let mimeType = '';
        let extension = '';

        if (format === 'txt') {
            content += '=============================================\n';
            content += '     AMMAM CORE // FORENSIC LOG REPORT       \n';
            content += '=============================================\n\n';
            content += `DATE: ${new Date().toISOString()}\n`;
            content += `TARGET OJECT: ${currentFile?.name || 'unknown_target.raw'}\n`;
            content += `FILE SIZE: ${currentFile ? (currentFile.size/1024/1024).toFixed(2) : '?'} MB\n`;
            content += `PROCESSING VELOCITY: ${analysisResult.processingTimeMs}ms\n\n`;
            
            content += '[ AGENTIC PAYLOADS DETECTED ]\n';
            analysisResult.payloads.forEach(p => {
                content += `---------------------------------------------\n`;
                content += `ID:     ${p.id}\n`;
                content += `TYPE:   ${p.type}\n`;
                content += `CONF:   ${(p.confidence * 100).toFixed(1)}%\n`;
                content += `VECTOR: ${p.content}\n`;
            });

            mimeType = 'text/plain';
            extension = '.txt';

        } else if (format === 'csv') {
            content += 'ID,Type,Confidence,Content\n';
            analysisResult.payloads.forEach(p => {
                const safeContent = p.content.replace(/"/g, '""');
                content += `"${p.id}","${p.type}","${p.confidence}","${safeContent}"\n`;
            });

            mimeType = 'text/csv';
            extension = '.csv';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileName = `AMMAM_FORENSIC_REPORT_${new Date().getTime()}${extension}`;
        a.download = fileName;
        a.setAttribute('download', fileName);
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 500);

        setShowDownloadOptions(false);
    };

    return (
        <div className="home-container" style={{ animation: 'fadeIn 0.5s ease' }}>
            {!analysisResult ? (
                <UploadView onAnalyze={startAnalysis} isAnalyzing={isAnalyzing} />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="grid-container" id="pdf-export-area" style={{ padding: '1rem', background: 'var(--bg-core)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <MemoryMapVisualizer gridData={analysisResult.gridData} />

                            <div className="tech-panel" style={{ padding: '2rem' }}>
                                <h2 style={{ marginBottom: '1rem', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>NODE CLUSTER TOPOLOGY</h2>
                                <NetworkNodeGraph gridData={analysisResult.gridData} width={typeof window !== 'undefined' ? window.innerWidth * 0.45 : 600} height={400} />
                            </div>

                            <div className="tech-panel" style={{ padding: '2rem' }}>
                                <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Activity /> HEURISTICS & ISOLATION SUMMARY
                                </h2>
                                
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
                                    <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid var(--panel-border)', padding: '1.5rem', borderRadius: '4px' }}>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>Isolated Anomalies</div>
                                        <div style={{ fontSize: '3rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{totalPayloads}</div>
                                    </div>
                                    
                                    <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid var(--panel-border)', padding: '1.5rem', borderRadius: '4px' }}>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>Peak Entropy Detected</div>
                                        <div style={{ fontSize: '3rem', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{peakEntropy.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>Risk Distribution</div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1, borderTop: '4px solid var(--accent-red)', paddingTop: '0.5rem' }}>
                                            <span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>CRITICAL</span>: {criticalCount}
                                        </div>
                                        <div style={{ flex: 1, borderTop: '4px solid var(--accent-orange)', paddingTop: '0.5rem' }}>
                                            <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>HIGH</span>: {highCount}
                                        </div>
                                        <div style={{ flex: 1, borderTop: '4px solid var(--accent-yellow)', paddingTop: '0.5rem' }}>
                                            <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold' }}>MEDIUM</span>: {mediumCount}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    className="btn-primary" 
                                    style={{ width: '100%', borderColor: 'var(--accent-red)', color: 'var(--accent-red)', display: 'flex', justifyContent: 'center' }}
                                    onClick={() => navigate('/threats')}
                                >
                                    OPEN THREAT INTELLIGENCE DASHBOARD
                                </button>
                            </div>
                        </div>

                        <div>
                            <MetricsDashboard stats={analysisResult.stats} timeMs={analysisResult.processingTimeMs} />
                        </div>
                    </div>

                    {/* Rescan / Download Action Bar */}
                    <div className="tech-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', overflow: 'visible', zIndex: 50 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem', width: '100%' }}>
                            <button 
                                className="btn-primary" 
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
                                onClick={() => startAnalysis(currentFile)}
                                disabled={isAnalyzing}
                            >
                                <RotateCw size={18} />
                                {isAnalyzing ? 'SCANNING...' : 'RESCAN CURRENT DUMP'}
                            </button>
                            
                            <div style={{ position: 'relative' }}>
                                <button 
                                    className="btn-primary" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#222', borderColor: 'var(--accent-cyan)' }} 
                                    onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                                >
                                    <Download size={18} color="var(--accent-cyan)" />
                                    GENERATE REPORT
                                </button>
                                
                                {showDownloadOptions && (
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: '115%', 
                                        left: '50%', 
                                        transform: 'translateX(-50%)',
                                        width: 'max-content',
                                        minWidth: '200px',
                                        background: 'var(--bg-elevated)', 
                                        border: '1px solid var(--accent-cyan)', 
                                        zIndex: 99999, 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        boxShadow: '0 4px 20px rgba(0, 240, 255, 0.2)'
                                    }}>
                                        <button 
                                            className="dropdown-btn" 
                                            onClick={() => handleDownloadFormat('txt')}
                                            style={{ padding: '1rem', background: 'transparent', color: 'var(--accent-cyan)', border: 'none', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                                        >
                                            <FileText size={16}/> TEXT LOG
                                        </button>
                                        <button 
                                            className="dropdown-btn" 
                                            onClick={() => handleDownloadFormat('csv')}
                                            style={{ padding: '1rem', background: 'transparent', color: 'var(--accent-cyan)', border: 'none', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                                        >
                                            <FileSpreadsheet size={16}/> CSV MATRIX
                                        </button>
                                        <button 
                                            className="dropdown-btn" 
                                            onClick={() => handleDownloadFormat('pdf')}
                                            style={{ padding: '1rem', background: 'transparent', color: 'var(--accent-cyan)', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                                        >
                                            <Printer size={16}/> PRINT PDF
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button 
                                className="btn-primary" 
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', borderColor: 'var(--danger)', color: 'var(--danger)' }} 
                                onClick={resetAnalysis}
                                disabled={isAnalyzing}
                            >
                                <LogOut size={18} />
                                TERMINATE SESSION
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
