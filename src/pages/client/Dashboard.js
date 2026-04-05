import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientNav } from '../../components/Navbar';
import { useAuth } from '../../AuthContext';
import { getProjects } from '../../db';

export default function ClientDashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [projects, setProjects] = useState([]);
  useEffect(() => { setProjects(getProjects().filter(p => p.clientId === user.id)); }, [user.id]);

  const total = projects.length;
  const active = projects.filter(p => p.status === 'In Progress').length;
  const completed = projects.filter(p => p.status === 'Completed').length;

  return (
    <div>
      <ClientNav />
      <div className="page-container">
        <h1 className="page-title">Client Dashboard</h1>
        <div className="stat-grid stat-grid-3">
          <div className="stat-card">
            <div className="stat-label">Total Projects</div>
            <div className="stat-num">{total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Projects</div>
            <div className="stat-num">{active}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed Projects</div>
            <div className="stat-num">{completed}</div>
          </div>
        </div>
        <div style={{marginTop:12}}>
          <button className="btn btn-amber btn-lg" onClick={() => nav('/client/new-project')}>+ Post New Project</button>
        </div>
        {projects.length > 0 && (
          <div style={{marginTop:28}}>
            <h2 className="section-title">Recent Projects</h2>
            {projects.slice(-3).reverse().map(p => (
              <div key={p.id} className="proj-card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div className="proj-title">{p.title}</div>
                  <span className={`badge badge-${p.status.replace(' ','').toLowerCase()}`}>{p.status}</span>
                </div>
                <div style={{fontSize:13,color:'#78909c',marginTop:4}}>Budget: ₹{p.budget} | Posted: {p.postedDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
