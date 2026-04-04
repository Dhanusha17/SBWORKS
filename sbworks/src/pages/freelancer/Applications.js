import React, { useState, useEffect } from 'react';
import { FreelancerNav } from '../../components/Navbar';
import { useAuth } from '../../AuthContext';
import { getApplications } from '../../db';

export default function FreelancerApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  useEffect(() => { setApps(getApplications().filter(a => a.freelancerId === user.id)); }, [user.id]);

  const badgeClass = (s) => ({ Pending:'badge-pending', Accepted:'badge-accepted', Rejected:'badge-rejected' }[s] || 'badge-pending');

  return (
    <div>
      <FreelancerNav />
      <div className="page-container">
        <h1 className="page-title">My Applications</h1>
        {apps.length === 0 && <div className="empty-state"><p>No applications submitted yet.</p></div>}
        {apps.map(a => (
          <div key={a.id} className="proj-card" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div>
              <div className="proj-title">{a.title}</div>
              <div style={{fontSize:12,color:'#78909c',marginBottom:6}}>Client: {a.clientName}</div>
              <div className="proj-desc" style={{WebkitLineClamp:3}}>{a.description}</div>
              <div className="chips-row">{(a.requiredSkills||[]).map(s=><span key={s} className="chip">{s}</span>)}</div>
              <div className="proj-budget" style={{marginTop:8}}>Budget — ₹{a.budget}</div>
            </div>
            <div>
              <div style={{fontWeight:600,fontSize:13,marginBottom:6,color:'#37474f'}}>Proposal</div>
              <div style={{fontSize:13,color:'#546e7a',lineHeight:1.5,marginBottom:8,display:'-webkit-box',WebkitLineClamp:4,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{a.proposal}</div>
              <div className="chips-row">{(a.freelancerSkills||[]).map(s=><span key={s} className="chip">{s}</span>)}</div>
              <div style={{fontSize:13,color:'#78909c',marginTop:8}}>Proposed Budget — ₹{a.bidAmount}</div>
              <div style={{fontSize:12,color:'#90a4ae',marginBottom:10}}>Est: {a.estimatedTime} days · Applied: {a.appliedAt}</div>
              <span className={`badge ${badgeClass(a.status)}`}>{a.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
