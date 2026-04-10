import React from 'react';
import { ShieldAlert, Terminal } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-left">
          <Terminal size={20} color="var(--accent-red)" />
          <span style={{ marginLeft: '10px', fontSize: '14px' }}>
            STATUS: <span style={{ color: 'var(--accent-green)' }}>OPERATIONAL</span>
          </span>
        </div>
        <div className="footer-center" style={{ textAlign: 'center', opacity: 0.6 }}>
          <p>© 2026 AMMAM Core // ISB Hackathon on Cybersescurity & AI Safety Protocol</p>
        </div>
        <div className="footer-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <ShieldAlert size={16} color="var(--warning)" />
          <span style={{ marginLeft: '6px', fontSize: '12px', color: 'var(--warning)' }}>UNAUTHORIZED ACCESS LOGGED</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
