import React, { useState, useEffect } from 'react';
import { FreelancerNav } from '../../components/Navbar';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../AuthContext';
import { useToast } from '../../components/Toast';
import { getProjects, getApplications, addApplication, updateProject, updateFreelancer, getFreelancer } from '../../db';

export default function AllProjects() {
  const { user } = useAuth();
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [filters, setFilters] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ proposal: '', bidAmount: '', estimatedTime: '' });

  const load = () => {
    const all = getProjects().filter(p => p.status === 'Available');
    const apps = getApplications().filter(a => a.freelancerId === user.id);
    setProjects(all);
    setMyApps(apps);
    const skills = [...new Set(all.flatMap(p => p.skills || []))];
    setAllSkills(skills);
  };

  useEffect(() => { load(); }, []);

  const toggleFilter = (s) => setFilters(f => f.includes(s) ? f.filter(x=>x!==s) : [...f,s]);

  const filtered = filters.length > 0 ? projects.filter(p => filters.some(f => (p.skills||[]).includes(f))) : projects;

  const avgBid = (p) => {
    if (!p.bidAmounts?.length) return null;
    return Math.round(p.bidAmounts.reduce((a,b)=>a+b,0) / p.bidAmounts.length);
  };

  const hasApplied = (projectId) => myApps.some(a => a.projectId === projectId);

  const openApply = (p) => { setModal(p); setForm({ proposal: '', bidAmount: '', estimatedTime: '' }); };

  const handleApply = () => {
    if (!form.proposal || !form.bidAmount || !form.estimatedTime) return toast('Fill all fields', 'error');
    const p = modal;
    const fl = getFreelancer(user.id);
    const app = addApplication({
      projectId: p.id, clientId: p.clientId, clientName: p.clientName, clientEmail: p.clientEmail,
      freelancerId: user.id, freelancerName: user.username, freelancerEmail: user.email,
      freelancerSkills: fl?.skills || [],
      title: p.title, description: p.description, budget: p.budget, requiredSkills: p.skills || [],
      proposal: form.proposal, bidAmount: Number(form.bidAmount), estimatedTime: Number(form.estimatedTime),
    });
    updateProject(p.id, { bids: [...(p.bids||[]), app.id], bidAmounts: [...(p.bidAmounts||[]), Number(form.bidAmount)] });
    updateFreelancer(user.id, { applications: [...(fl?.applications||[]), app.id] });
    toast('Application submitted!');
    setModal(null);
    load();
  };

  return (
    <div>
      <FreelancerNav />
      <div className="page-container">
        <h1 className="page-title">All Projects</h1>
        <div className="two-col">
          <div className="sidebar">
            <div className="sidebar-title">Filters</div>
            <div style={{fontWeight:500,fontSize:13,color:'#78909c',marginBottom:8}}>Skills</div>
            {allSkills.map(s => (
              <label key={s} className="filter-item">
                <input type="checkbox" checked={filters.includes(s)} onChange={() => toggleFilter(s)} />
                <span className="filter-label">{s}</span>
              </label>
            ))}
            {allSkills.length === 0 && <span style={{fontSize:12,color:'#90a4ae'}}>No projects yet</span>}
          </div>
          <div>
            {filtered.length === 0 && <div className="empty-state"><p>No projects available right now.</p></div>}
            {filtered.map(p => (
              <div key={p.id} className="proj-card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div className="proj-title">{p.title}</div>
                  <span style={{fontSize:11,color:'#90a4ae'}}>{p.postedDate}</span>
                </div>
                <div className="proj-desc">{p.description}</div>
                <div className="proj-budget">Budget ₹{p.budget}</div>
                <div className="chips-row">{(p.skills||[]).map(s=><span key={s} className="chip">{s}</span>)}</div>
                <div className="proj-row">
                  <span className="proj-meta">{p.bids?.length||0} bids{avgBid(p)?` · ₹${avgBid(p)} avg`:''}</span>
                  {hasApplied(p.id)
                    ? <button className="btn btn-success btn-sm" disabled>Applied ✓</button>
                    : <button className="btn btn-primary btn-sm" onClick={() => openApply(p)}>Apply Now</button>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal && (
        <Modal title={`Apply for: ${modal.title}`} onClose={() => setModal(null)} actions={
          <><button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleApply}>Submit Application</button></>
        }>
          <div className="form-group">
            <label className="form-label">Your Proposal *</label>
            <textarea className="form-control" rows={4} value={form.proposal} onChange={e=>setForm(f=>({...f,proposal:e.target.value}))} placeholder="Describe why you're the best fit..." />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group">
              <label className="form-label">Bid Amount (₹) *</label>
              <input className="form-control" type="number" value={form.bidAmount} onChange={e=>setForm(f=>({...f,bidAmount:e.target.value}))} placeholder="e.g. 5000" />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Days *</label>
              <input className="form-control" type="number" value={form.estimatedTime} onChange={e=>setForm(f=>({...f,estimatedTime:e.target.value}))} placeholder="e.g. 7" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
