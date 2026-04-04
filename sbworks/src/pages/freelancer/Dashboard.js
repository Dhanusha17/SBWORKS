import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreelancerNav } from '../../components/Navbar';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../AuthContext';
import { useToast } from '../../components/Toast';
import { getFreelancer, updateFreelancer } from '../../db';

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [fl, setFl] = useState(null);
  const [modal, setModal] = useState(false);
  const [skills, setSkills] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    const f = getFreelancer(user.id);
    setFl(f);
    if (f) { setSkills((f.skills||[]).join(', ')); setDesc(f.description||''); }
  }, [user.id]);

  const handleUpdate = () => {
    const skillArr = skills.split(',').map(s=>s.trim()).filter(Boolean);
    const updated = updateFreelancer(user.id, { skills: skillArr, description: desc });
    setFl(updated);
    setModal(false);
    toast('Profile updated!');
  };

  if (!fl) return <div><FreelancerNav /><div className="page-container"><p>Loading...</p></div></div>;

  return (
    <div>
      <FreelancerNav />
      <div className="page-container">
        <h1 className="page-title">Dashboard</h1>
        <div className="stat-grid stat-grid-4">
          <div className="stat-card">
            <div className="stat-label">Current Projects</div>
            <div className="stat-num">{fl.currentProjects?.length || 0}</div>
            <button className="btn btn-secondary btn-sm" onClick={() => nav('/freelancer/my-projects')}>View projects</button>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed Projects</div>
            <div className="stat-num">{fl.completedProjects?.length || 0}</div>
            <button className="btn btn-secondary btn-sm" onClick={() => nav('/freelancer/my-projects')}>View projects</button>
          </div>
          <div className="stat-card">
            <div className="stat-label">Applications</div>
            <div className="stat-num">{fl.applications?.length || 0}</div>
            <button className="btn btn-secondary btn-sm" onClick={() => nav('/freelancer/applications')}>View Applications</button>
          </div>
          <div className="stat-card">
            <div className="stat-label">Funds</div>
            <div className="stat-funds">Available: ₹{fl.funds || 0}</div>
          </div>
        </div>

        <div className="card">
          <div className="profile-section">
            <div className="avatar-circle">{user.username[0].toUpperCase()}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:16,marginBottom:2}}>{user.username}</div>
              <div style={{fontSize:13,color:'#78909c',marginBottom:12}}>{user.email}</div>
              <div className="section-title">My Skills</div>
              <div className="chips-row">
                {fl.skills?.length > 0 ? fl.skills.map(s=><span key={s} className="chip">{s}</span>) : <span style={{fontSize:13,color:'#90a4ae'}}>No skills added yet</span>}
              </div>
              <div className="section-title" style={{marginTop:14}}>Description</div>
              <div style={{fontSize:14,color:'#546e7a',lineHeight:1.6}}>{fl.description || <span style={{color:'#90a4ae'}}>No description added</span>}</div>
              <button className="btn btn-secondary btn-sm" style={{marginTop:14}} onClick={() => setModal(true)}>Update Profile</button>
            </div>
          </div>
        </div>

        {modal && (
          <Modal title="Update Profile" onClose={() => setModal(false)} actions={
            <><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate}>Save</button></>
          }>
            <div className="form-group">
              <label className="form-label">Skills (comma separated)</label>
              <input className="form-control" value={skills} onChange={e=>setSkills(e.target.value)} placeholder="React, Node.js, Python" />
            </div>
            <div className="form-group">
              <label className="form-label">Bio / Description</label>
              <textarea className="form-control" value={desc} onChange={e=>setDesc(e.target.value)} rows={4} placeholder="Tell clients about yourself..." />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
