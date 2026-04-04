import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const NavItem = ({ to, label }) => (
  <NavLink to={to} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>{label}</NavLink>
);

export const FreelancerNav = () => {
  const { logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="navbar">
      <NavLink to="/freelancer/dashboard" className="nav-logo">SB Works</NavLink>
      <div className="nav-links">
        <NavItem to="/freelancer/dashboard" label="Dashboard" />
        <NavItem to="/freelancer/projects" label="All Projects" />
        <NavItem to="/freelancer/my-projects" label="My Projects" />
        <NavItem to="/freelancer/applications" label="Applications" />
        <span className="nav-link logout" onClick={() => { logout(); nav('/login'); }}>Logout</span>
      </div>
    </nav>
  );
};

export const ClientNav = () => {
  const { logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="navbar">
      <NavLink to="/client/dashboard" className="nav-logo">SB Works</NavLink>
      <div className="nav-links">
        <NavItem to="/client/dashboard" label="Dashboard" />
        <NavItem to="/client/new-project" label="New Project" />
        <NavItem to="/client/applications" label="Applications" />
        <span className="nav-link logout" onClick={() => { logout(); nav('/login'); }}>Logout</span>
      </div>
    </nav>
  );
};

export const AdminNav = () => {
  const { logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="navbar">
      <NavLink to="/admin/dashboard" className="nav-logo">SB Works (admin)</NavLink>
      <div className="nav-links">
        <NavItem to="/admin/dashboard" label="Home" />
        <NavItem to="/admin/users" label="All Users" />
        <NavItem to="/admin/projects" label="Projects" />
        <NavItem to="/admin/applications" label="Applications" />
        <span className="nav-link logout" onClick={() => { logout(); nav('/login'); }}>Logout</span>
      </div>
    </nav>
  );
};

export const PublicNav = () => {
  const nav = useNavigate();
  return (
    <nav className="navbar">
      <span className="nav-logo" style={{cursor:'pointer'}} onClick={() => nav('/')}>SB Works</span>
      <div className="nav-links">
        <button className="btn btn-secondary btn-sm" onClick={() => nav('/login')}>Sign In</button>
      </div>
    </nav>
  );
};
