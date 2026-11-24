import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  useEffect(() => {
    // The supplied demo UI is mounted after React creates the page shell.
    // Its browser-only interactions remain in legacy.js until the API layer is connected.
    import('./legacy.js');
  }, []);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="demo-bar"><span className="demo-dot" /> WEBSITE MOCKUP <span className="demo-detail">Explore freely. Sample accounts and browser-only changes.</span><button id="reset-demo" title="Reset sample data">Reset demo</button></div>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Lakas Kabataan ng Paco home"><img src="/assets/logo.png" alt="LKP logo" width="46" height="46" /><span>LAKAS KABATAAN<br /><small>NG PACO</small></span></a>
        <button className="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="navigation">☰</button>
        <nav id="navigation" aria-label="Main navigation">
          <a href="#projects">Our projects</a><a href="#impact">Our impact</a><a href="#transparency">Transparency</a><a href="#about">About LKP</a>
          <a className="portal-link" href="#portal">Member portal ↗</a><a href="#donate" className="button small gold">Support our work <span aria-hidden="true">↗</span></a>
        </nav>
      </header>
      <main id="main" tabIndex="-1" />
      <footer>
        <div className="footer-top"><div><a className="brand light" href="#home"><img src="/assets/logo.png" alt="" width="48" height="48" /><span>LAKAS KABATAAN<br /><small>NG PACO</small></span></a><p>Youth-led. Community-rooted.<br />Para sa Paco. Para sa masa.</p></div><div><h3>Be part of the change</h3><a href="#volunteer">Become a volunteer ↗</a><a href="#donate">Make a difference ↗</a><a href="#suggestions">Share an idea ↗</a></div><div><h3>Stay informed</h3><a href="#transparency">Financial transparency</a><a href="/assets/annual-report.pdf" target="_blank" rel="noopener">Annual accomplishment report ↗</a><a href="#about">Our team & registration</a></div><div><h3>Our community</h3><p>Barangay Paco<br />Obando, Bulacan, Philippines</p><a href="#contact">Contact & frequently asked questions ↗</a></div></div>
        <div className="footer-bottom"><span>© <span id="year" /> Lakas Kabataan ng Paco</span><span>Developed for LKP · <a href="#developer">Developer credits</a></span><a href="#privacy">Privacy & demo notice</a></div>
      </footer>
      <dialog id="modal" aria-labelledby="modal-title"><button className="modal-close" aria-label="Close dialog">×</button><div id="modal-content" /></dialog>
      <div id="toast" role="status" aria-live="polite" />
      <noscript>This mockup needs JavaScript. Enable it to browse projects and the demo dashboards.</noscript>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
