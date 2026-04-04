import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/Navbar';
import { getApplications } from '../../db';

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  useEffect(() => { setApps(getApplications()); }, []);

  const badgeClass = (s) => ({ Pending: 'badge-pending', Accepted: 'badge-accepted', Rejected: 'badge-rejected' }[s] || 'badge-pending');

  return (
    <div>
      <AdminNav />
      <div className="page-container">
        <h1 className="page-title">All Applications</h1>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Freelancer</th>
                  <th>Email</th>
                  <th>Bid ₹</th>
                  <th>Est Days</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {apps.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#90a4ae', padding: 32 }}>No applications yet.</td></tr>
                )}
                {apps.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500, maxWidth: 160 }}>{a.title}</td>
                    <td>{a.freelancerName}</td>
                    <td style={{ color: '#546e7a', fontSize: 12 }}>{a.freelancerEmail}</td>
                    <td style={{ color: '#FF6F00', fontWeight: 600 }}>₹{a.bidAmount}</td>
                    <td style={{ color: '#78909c' }}>{a.estimatedTime}d</td>
                    <td><span className={`badge ${badgeClass(a.status)}`}>{a.status}</span></td>
                    <td style={{ color: '#90a4ae' }}>{a.appliedAt}</td>
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
