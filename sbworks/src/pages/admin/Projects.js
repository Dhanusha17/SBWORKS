import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/Navbar';
import { getProjects } from '../../db';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  useEffect(() => { setProjects(getProjects()); }, []);

  const filters = ['All', 'Available', 'In Progress', 'Completed'];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.status === filter);

  const badgeClass = (s) => ({ Available: 'badge-available', 'In Progress': 'badge-inprogress', Completed: 'badge-completed' }[s] || 'badge-available');

  return (
    <div>
      <AdminNav />
      <div className="page-container">
        <h1 className="page-title">All Projects</h1>
        <div className="tab-pills">
          {filters.map(f => (
            <span key={f} className={`tab-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</span>
          ))}
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Client</th>
                  <th>Budget</th>
                  <th>Skills</th>
                  <th>Status</th>
                  <th>Freelancer</th>
                  <th>Posted</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#90a4ae', padding: 32 }}>No projects found.</td></tr>
                )}
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500, maxWidth: 180 }}>{p.title}</td>
                    <td>{p.clientName}</td>
                    <td style={{ color: '#FF6F00', fontWeight: 600 }}>₹{p.budget}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {(p.skills || []).slice(0, 2).map(s => <span key={s} className="chip" style={{ fontSize: 10 }}>{s}</span>)}
                        {(p.skills || []).length > 2 && <span style={{ fontSize: 10, color: '#78909c' }}>+{p.skills.length - 2}</span>}
                      </div>
                    </td>
                    <td><span className={`badge ${badgeClass(p.status)}`}>{p.status}</span></td>
                    <td style={{ color: '#546e7a' }}>{p.freelancerName || '—'}</td>
                    <td style={{ color: '#90a4ae' }}>{p.postedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
