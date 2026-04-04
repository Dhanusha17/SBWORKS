import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/Navbar';
import { ConfirmModal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { getUsers, deleteUser } from '../../db';
import { useAuth } from '../../AuthContext';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);

  const load = () => setUsers(getUsers());
  useEffect(() => { load(); }, []);

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (u) => {
    deleteUser(u.id);
    toast(`${u.username} deleted.`);
    setConfirm(null);
    load();
  };

  const badgeClass = (t) => ({ client: 'badge-client', freelancer: 'badge-freelancer', admin: 'badge-admin' }[t] || 'badge-pending');

  return (
    <div>
      <AdminNav />
      <div className="page-container">
        <h1 className="page-title">All Users</h1>
        <input className="search-input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#90a4ae', padding: 32 }}>No users found.</td></tr>
                )}
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1565C0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                          {u.username?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.username}</span>
                      </div>
                    </td>
                    <td style={{ color: '#546e7a' }}>{u.email}</td>
                    <td><span className={`badge ${badgeClass(u.usertype)}`}>{u.usertype}</span></td>
                    <td style={{ color: '#90a4ae' }}>{u.createdAt}</td>
                    <td>
                      {u.id !== me.id && (
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirm(u)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {confirm && (
        <ConfirmModal
          message={`Delete user "${confirm.username}"? This cannot be undone.`}
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
