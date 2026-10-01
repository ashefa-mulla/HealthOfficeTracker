import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div>
        © {currentYear} <strong>HO Tracker</strong>. Home Office & Workforce Productivity Suite.
      </div>
      <div className="d-none d-sm-block">
        <span className="text-muted">Version 1.0.0</span> • <a href="#support" className="text-primary">Support</a>
      </div>
    </footer>
  );
};

export default Footer;
