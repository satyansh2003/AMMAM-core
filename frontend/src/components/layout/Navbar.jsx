import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, Target, Server, Crosshair, Database, Activity, History } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Target color="var(--accent-green)" size={28} className="glow-icon" />
        <h1 className="brand-text">AMMAM <span className="text-highlight">CORE</span></h1>
      </Link>
      
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Crosshair size={18} /> DASHBOARD
        </NavLink>
        <NavLink to="/threats" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Activity size={18} /> THREAT INTEL
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <History size={18} /> FORENSICS
        </NavLink>
        <NavLink to="/architecture" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Server size={18} /> ARCHITECTURE
        </NavLink>
        <NavLink to="/generator" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Database size={18} /> GENERATOR
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Shield size={18} /> ABOUT OP
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
