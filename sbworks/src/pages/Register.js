import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserByEmail, addUser, createFreelancer } from '../db';
import { useAuth } from '../AuthContext';
import { useToast } from '../components/Toast';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', usertype: 'freelancer' });
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (getUserByEmail(form.email)) return toast('Email already registered', 'error');
    const user = addUser(form);
    if (form.usertype === 'freelancer') createFreelancer(user.id);
    login(user);
    toast('Account created successfully!');
    nav(form.usertype === 'freelancer' ? '/freelancer/dashboard' : '/client/dashboard');
  };

  return (
    <div>
      <nav className="navbar">
        <span className="nav-logo" style={{cursor:'pointer'}} onClick={() => nav('/')}>SB Works</span>
        <div className="nav-links"><Link to="/" className="nav-link">Home</Link></div>
      </nav>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-control" value={form.username} onChange={e=>set('username',e.target.value)} required placeholder="Your name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={form.email} onChange={e=>set('email',e.target.value)} required placeholder="you@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" value={form.password} onChange={e=>set('password',e.target.value)} required placeholder="Min 6 characters" minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:4}}>
                {['freelancer','client'].map(role => (
                  <div key={role} onClick={() => set('usertype', role)} style={{padding:'12px',border:`2px solid ${form.usertype===role?'#1565C0':'#cfd8dc'}`,borderRadius:8,cursor:'pointer',textAlign:'center',background:form.usertype===role?'#E3F2FD':'white',color:form.usertype===role?'#1565C0':'#546e7a',fontWeight:500,textTransform:'capitalize',fontSize:14}}>
                    {role === 'freelancer' ? '🧑‍💻 Freelancer' : '🏢 Client'}
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg">Register</button>
          </form>
          <div className="auth-link">Already registered? <Link to="/login">Login</Link></div>
        </div>
      </div>
    </div>
  );
}
