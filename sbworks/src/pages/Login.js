import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserByEmail } from '../db';
import { useAuth } from '../AuthContext';
import { useToast } from '../components/Toast';
import { PublicNav } from '../components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = getUserByEmail(email.trim());
    if (!user) return toast('Email not found', 'error');
    if (user.password !== password) return toast('Incorrect password', 'error');
    login(user);
    toast(`Welcome back, ${user.username}!`);
    if (user.usertype === 'freelancer') nav('/freelancer/dashboard');
    else if (user.usertype === 'client') nav('/client/dashboard');
    else nav('/admin/dashboard');
  };

  return (
    <div>
      <nav className="navbar">
        <span className="nav-logo" style={{cursor:'pointer'}} onClick={() => nav('/')}>SB Works</span>
        <div className="nav-links"><Link to="/" className="nav-link">Home</Link></div>
      </nav>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{position:'relative'}}>
                <input className="form-control" type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" />
                <span onClick={()=>setShow(!show)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',cursor:'pointer',color:'#78909c',fontSize:13}}>{show?'Hide':'Show'}</span>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{marginTop:8}}>Sign In</button>
          </form>
          <div className="auth-link">Not registered? <Link to="/register">Register</Link></div>
          <div style={{marginTop:16,padding:12,background:'#F8FAFC',borderRadius:8,fontSize:12,color:'#78909c'}}>
            <strong>Admin login:</strong> admin@sbworks.com / Admin@123
          </div>
        </div>
      </div>
    </div>
  );
}
