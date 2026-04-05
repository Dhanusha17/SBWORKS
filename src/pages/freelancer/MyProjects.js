import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreelancerNav } from '../../components/Navbar';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../AuthContext';
import { useToast } from '../../components/Toast';
import { getProjects, updateProject } from '../../db';

export default function MyProjects() {
  const { user } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tab, setTab] = useState('In Progress');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ projectLink: '', manulaLink: '', submissionDescription: '' });

  const load = () => setProjects(getProjects().filter(p => p.freelancerId === user.id));
  useEffect(() => { load(); }, []);

  const filtered = projects.filter(p => tab === 'In Progress' ? p.status === 'In Progress' : p.status === 'Completed');

  const openSubmit = (p) => { setModal(p); setForm({ projectLink: '', manulaLink: '', submissionDescription: '' }); };

  const handleSubmit = () => {
    if (!form.projectLink) return toast('Project link is required', 'error');
    updateProject(modal.id, { submission: true, ...form });
    toast('Work submitted! Awaiting client review.');
    setModal(null);
    load();
  };

  return (
    <div>
      <FreelancerNav />
      <div className="page-container">
        <h1 className="page-title">My Projects</h1>
        <div className="tabs">
          {['In Progress','Completed'].map(t => (
            <div key={t} className={`tab${tab===t?' active':''}`} onClick={() => setTab(t)}>{t}</div>
          ))}
        </div>

        {filtered.length === 0 && <div className="empty-state"><p>No projects here yet.</p></div>}

        {filtered.map(p => (
          <div key={p.id} className="proj-card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <div className="proj-title">{p.title}</div>
              <span className={`badge badge-${p.status.replace(' ','').toLowerCase()}`}>{p.status}</span>
            </div>
            <div style={{fontSize:13,color:'#78909c',marginBottom:4}}>Client: {p.clientName}</div>
            <div style={{fontSize:13,color:'#78909c',marginBottom:10}}>Budget: ₹{p.budget} &nbsp;|&nbsp; Deadline: {p.deadline}</div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <button className="btn btn-secondary btn-sm" onClick={() => nav(`/freelancer/chat/${p.id}`)}>💬 Chat with Client</button>
              {p.status === 'In Progress' && !p.submission && (
                <button className="btn btn-primary btn-sm" onClick={() => openSubmit(p)}>📤 Submit Work</button>
              )}
              {p.submission && !p.submissionAccepted && (
                <button className="btn btn-grey btn-sm" disabled>Work Submitted — Awaiting Review</button>
              )}
              {p.submissionAccepted && (
                <span style={{color:'#2E7D32',fontWeight:600,fontSize:13,paddingTop:4}}>✓ Submission Accepted</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title="Submit Your Work" onClose={() => setModal(null)} actions={
          <><button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Submit</button></>
        }>
          <div className="form-group">
            <label className="form-label">Project Link *</label>
            <input className="form-control" value={form.projectLink} onChange={e=>setForm(f=>({...f,projectLink:e.target.value}))} placeholder="https://github.com/your/project" />
          </div>
          <div className="form-group">
            <label className="form-label">Documentation / Manual Link (optional)</label>
            <input className="form-control" value={form.manulaLink} onChange={e=>setForm(f=>({...f,manulaLink:e.target.value}))} placeholder="https://docs.google.com/..." />
          </div>
          <div className="form-group">
            <label className="form-label">Submission Note</label>
            <textarea className="form-control" rows={3} value={form.submissionDescription} onChange={e=>setForm(f=>({...f,submissionDescription:e.target.value}))} placeholder="Describe what you built..." />
          </div>
        </Modal>
      )}
    </div>
  );
}
