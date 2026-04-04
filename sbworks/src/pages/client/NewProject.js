import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientNav } from '../../components/Navbar';
import { useAuth } from '../../AuthContext';
import { useToast } from '../../components/Toast';
import { addProject } from '../../db';

export default function NewProject() {
  const { user } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', budget: '', skills: '', deadline: '' });
  const [skillChips, setSkillChips] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSkillKey = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const s = skillInput.trim().replace(/,/g, '');
      if (s && !skillChips.includes(s)) setSkillChips(c => [...c, s]);
      setSkillInput('');
    }
  };

  const removeChip = (s) => setSkillChips(c => c.filter(x => x !== s));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.budget || !form.deadline) return toast('Fill all required fields', 'error');
    const allSkills = [...skillChips];
    if (skillInput.trim()) allSkills.push(skillInput.trim());
    addProject({
      clientId: user.id, clientName: user.username, clientEmail: user.email,
      title: form.title, description: form.description, budget: Number(form.budget),
      skills: allSkills, deadline: form.deadline,
      postedDate: new Date().toLocaleDateString(), status: 'Available',
    });
    toast('Project posted successfully!');
    nav('/client/applications');
  };

  return (
    <div>
      <ClientNav />
      <div className="page-container">
        <h1 className="page-title">Post New Project</h1>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Build an e-commerce website" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-control" rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe what you need built, your goals, and any specific requirements..." required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Budget (₹) *</label>
                  <input className="form-control" type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="e.g. 8000" required min={1} />
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline *</label>
                  <input className="form-control" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Required Skills (press comma or Enter to add)</label>
                <input className="form-control" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleSkillKey} placeholder="React, Node.js, MongoDB..." />
                {skillChips.length > 0 && (
                  <div className="chips-row" style={{ marginTop: 8 }}>
                    {skillChips.map(s => (
                      <span key={s} className="chip" style={{ cursor: 'pointer' }} onClick={() => removeChip(s)}>{s} ×</span>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg">Post Project</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
