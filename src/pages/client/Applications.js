import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientNav } from '../../components/Navbar';
import { ConfirmModal } from '../../components/Modal';
import { useAuth } from '../../AuthContext';
import { useToast } from '../../components/Toast';
import { getProjects, getApplications, updateApplication, updateProject, updateFreelancer, getFreelancer } from '../../db';

export default function ClientApplications() {
  const { user } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [projects, setProjects] = useState([]);
  const [apps, setApps] = useState([]);
  const [open, setOpen] = useState({});
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setProjects(getProjects().filter(p => p.clientId === user.id));
    setApps(getApplications());
  };
  useEffect(() => { load(); }, [user.id]);

  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));
  const projApps = (projectId) => apps.filter(a => a.projectId === projectId);

  const doAccept = (app, proj) => {
    // Accept this app, reject others
    projApps(proj.id).forEach(a => {
      updateApplication(a.id, { status: a.id === app.id ? 'Accepted' : 'Rejected' });
    });
    updateProject(proj.id, { status: 'In Progress', freelancerId: app.freelancerId, freelancerName: app.freelancerName });
    const fl = getFreelancer(app.freelancerId);
    if (fl) updateFreelancer(app.freelancerId, { currentProjects: [...(fl.currentProjects || []), proj.id] });
    toast(`${app.freelancerName} accepted! Project is now active.`);
    setConfirm(null);
    load();
  };

  const doReject = (appId) => {
    updateApplication(appId, { status: 'Rejected' });
    toast('Application rejected.');
    load();
  };

  const doAcceptSubmission = (proj) => {
    updateProject(proj.id, { submissionAccepted: true, status: 'Completed' });
    const fl = getFreelancer(proj.freelancerId);
    if (fl) {
      updateFreelancer(proj.freelancerId, {
        currentProjects: (fl.currentProjects || []).filter(id => id !== proj.id),
        completedProjects: [...(fl.completedProjects || []), proj.id],
        funds: (fl.funds || 0) + proj.budget,
      });
    }
    toast(`Project completed! ₹${proj.budget} credited to ${proj.freelancerName}.`);
    setConfirm(null);
    load();
  };

  const doRevision = (projId) => {
    updateProject(projId, { submission: false });
    toast('Revision requested. Freelancer will resubmit.');
    load();
  };

  return (
    <div>
      <ClientNav />
      <div className="page-container">
        <h1 className="page-title">Project Applications</h1>
        {projects.length === 0 && (
          <div className="empty-state">
            <p>No projects posted yet.</p>
            <button className="btn btn-amber" style={{ marginTop: 16 }} onClick={() => nav('/client/new-project')}>+ Post Your First Project</button>
          </div>
        )}
        {projects.map(p => {
          const pApps = projApps(p.id);
          return (
            <div key={p.id} className="accordion">
              <div className="acc-header" onClick={() => toggle(p.id)}>
                <div>
                  <div className="acc-title">{p.title}</div>
                  <div style={{ fontSize: 12, color: '#78909c', marginTop: 2 }}>Budget ₹{p.budget} · {pApps.length} application{pApps.length !== 1 ? 's' : ''} · Posted: {p.postedDate}</div>
                </div>
                <div className="acc-meta">
                  <span className={`badge badge-${p.status.replace(' ', '').toLowerCase()}`}>{p.status}</span>
                  <span style={{ fontSize: 18, color: '#90a4ae' }}>{open[p.id] ? '▲' : '▼'}</span>
                </div>
              </div>

              {open[p.id] && (
                <div className="acc-body">
                  {pApps.length === 0 && <div style={{ fontSize: 13, color: '#90a4ae', padding: '8px 0' }}>No applications yet.</div>}

                  {pApps.map(a => (
                    <div key={a.id} className="app-row">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{a.freelancerName}</div>
                          <div style={{ fontSize: 12, color: '#78909c', marginBottom: 6 }}>{a.freelancerEmail}</div>
                          <div className="chips-row">{(a.freelancerSkills || []).map(s => <span key={s} className="chip">{s}</span>)}</div>
                          <div style={{ fontSize: 13, color: '#546e7a', margin: '8px 0', lineHeight: 1.5 }}>{a.proposal}</div>
                          <div style={{ fontSize: 13, color: '#78909c' }}>Bid: ₹{a.bidAmount} &nbsp;·&nbsp; Est: {a.estimatedTime} days &nbsp;·&nbsp; Applied: {a.appliedAt}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                          <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                          {p.status === 'Available' && a.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn btn-success btn-sm" onClick={() => setConfirm({ type: 'accept', app: a, proj: p })}>Accept ✓</button>
                              <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: 'reject', appId: a.id })}>Reject ✗</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Submission review */}
                  {p.submission && !p.submissionAccepted && (
                    <div style={{ marginTop: 16 }}>
                      <div className="submission-banner">📎 Work submitted by {p.freelancerName}</div>
                      <div className="submission-card">
                        <div className="sub-row"><span className="sub-key">Project Link:</span><a className="sub-val" href={p.projectLink} target="_blank" rel="noreferrer">{p.projectLink}</a></div>
                        {p.manulaLink && <div className="sub-row"><span className="sub-key">Documentation:</span><a className="sub-val" href={p.manulaLink} target="_blank" rel="noreferrer">{p.manulaLink}</a></div>}
                        <div className="sub-row"><span className="sub-key">Submission Note:</span><span className="sub-text">{p.submissionDescription || '—'}</span></div>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-success btn-sm" onClick={() => setConfirm({ type: 'submission', proj: p })}>✓ Accept Submission</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => doRevision(p.id)}>↩ Request Revision</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => nav(`/client/chat/${p.id}`)}>💬 Chat</button>
                      </div>
                    </div>
                  )}

                  {p.submissionAccepted && (
                    <div style={{ marginTop: 12, background: '#E8F5E9', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#2E7D32', fontWeight: 500 }}>
                      ✓ Project Completed — ₹{p.budget} credited to {p.freelancerName}
                    </div>
                  )}

                  {p.status === 'In Progress' && !p.submission && (
                    <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => nav(`/client/chat/${p.id}`)}>💬 Chat with Freelancer</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {confirm?.type === 'accept' && (
        <ConfirmModal
          message={`Accept ${confirm.app.freelancerName} for "${confirm.proj.title}"? All other applications will be rejected.`}
          onConfirm={() => doAccept(confirm.app, confirm.proj)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm?.type === 'reject' && (
        <ConfirmModal
          message="Reject this application?"
          onConfirm={() => { doReject(confirm.appId); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm?.type === 'submission' && (
        <ConfirmModal
          message={`Mark project complete and credit ₹${confirm.proj.budget} to ${confirm.proj.freelancerName}?`}
          onConfirm={() => doAcceptSubmission(confirm.proj)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
