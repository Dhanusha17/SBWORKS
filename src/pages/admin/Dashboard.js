import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNav } from '../../components/Navbar';
import { getUsers, getProjects, getApplications } from '../../db';

export default function AdminDashboard() {
  const nav = useNavigate();
  const [stats, setStats] = useState({ users: 0, projects: 0, completed: 0, apps: 0 });

  useEffect(() => {
    const projects = getProjects();
    setStats({
      users: getUsers().length,
      projects: projects.length,
      completed: projects.filter(p => p.status === 'Completed').length,
      apps: getApplications().length,
    });
  }, []);

  const cards = [
    { label: 'All Projects', value: stats.projects, color: '#1565C0', bg: '#E3F2FD', link: '/admin/projects' },
    { label: 'Completed Projects', value: stats.completed, color: '#2E7D32', bg: '#E8F5E9', link: '/admin/projects' },
    { label: 'Applications', value: stats.apps, color: '#E65100', bg: '#FFF8E1', link: '/admin/applications' },
    { label: 'Users', value: stats.users, color: '#6A1B9A', bg: '#F3E5F5', link: '/admin/users' },
  ];

  return (
    <div>
      <AdminNav />
      <div className="page-container">
        <h1 className="page-title">Admin Dashboard</h1>
        <div className="stat-grid stat-grid-4">
          {cards.map(c => (
            <div key={c.label} className="stat-card" style={{ borderTop: `4px solid ${c.color}` }}>
              <div className="stat-label">{c.label}</div>
              <div className="stat-num" style={{ color: c.color }}>{c.value}</div>
              <button className="btn btn-sm" style={{ background: c.bg, color: c.color, border: 'none', marginTop: 4 }} onClick={() => nav(c.link)}>
                View {c.label.split(' ').pop()}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
