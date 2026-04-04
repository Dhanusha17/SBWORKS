import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNav } from '../components/Navbar';

export default function Landing() {
  const nav = useNavigate();
  return (
    <div>
      <PublicNav />
      <div className="landing-hero">
        <div className="hero-content">
          <h1>Empower Your Journey:<br/>Elevate Your Craft on SB Works</h1>
          <p>Connect with top clients, bid on real projects, and build a thriving freelance career — all in one secure platform.</p>
          <button className="hero-btn" onClick={() => nav('/register')}>Join Now</button>
        </div>
      </div>
      <div className="features-section">
        <h2>Everything You Need to Succeed</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Post Projects</h3>
            <p>Describe your needs, set a budget, and find the perfect freelancer for every job.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Bid & Collaborate</h3>
            <p>Submit proposals, negotiate terms, and work through our integrated real-time chat.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure Platform</h3>
            <p>Admin-verified freelancers, protected payments, and quality guaranteed every time.</p>
          </div>
        </div>
      </div>
      <div className="landing-footer">
        <span style={{fontWeight:700, color:'#1565C0', fontSize:'16px'}}>SB Works</span>
        <span>© 2024 SB Works. All rights reserved.</span>
      </div>
    </div>
  );
}
