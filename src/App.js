import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastProvider } from './components/Toast';
import { seedAdmin } from './db';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

// Freelancer
import FreelancerDashboard from './pages/freelancer/Dashboard';
import AllProjects from './pages/freelancer/AllProjects';
import MyProjects from './pages/freelancer/MyProjects';
import FreelancerApplications from './pages/freelancer/Applications';

// Client
import ClientDashboard from './pages/client/Dashboard';
import NewProject from './pages/client/NewProject';
import ClientApplications from './pages/client/Applications';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProjects from './pages/admin/Projects';
import AdminApplications from './pages/admin/Applications';

// Route guards
const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.usertype !== role) return <Navigate to="/login" replace />;
  return children;
};

const RedirectIfLoggedIn = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    if (user.usertype === 'freelancer') return <Navigate to="/freelancer/dashboard" replace />;
    if (user.usertype === 'client') return <Navigate to="/client/dashboard" replace />;
    if (user.usertype === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  useEffect(() => { seedAdmin(); }, []);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<RedirectIfLoggedIn><Landing /></RedirectIfLoggedIn>} />
      <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
      <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />

      {/* Freelancer */}
      <Route path="/freelancer/dashboard" element={<PrivateRoute role="freelancer"><FreelancerDashboard /></PrivateRoute>} />
      <Route path="/freelancer/projects" element={<PrivateRoute role="freelancer"><AllProjects /></PrivateRoute>} />
      <Route path="/freelancer/my-projects" element={<PrivateRoute role="freelancer"><MyProjects /></PrivateRoute>} />
      <Route path="/freelancer/applications" element={<PrivateRoute role="freelancer"><FreelancerApplications /></PrivateRoute>} />
      <Route path="/freelancer/chat/:projectId" element={<PrivateRoute role="freelancer"><Chat role="freelancer" /></PrivateRoute>} />

      {/* Client */}
      <Route path="/client/dashboard" element={<PrivateRoute role="client"><ClientDashboard /></PrivateRoute>} />
      <Route path="/client/new-project" element={<PrivateRoute role="client"><NewProject /></PrivateRoute>} />
      <Route path="/client/applications" element={<PrivateRoute role="client"><ClientApplications /></PrivateRoute>} />
      <Route path="/client/chat/:projectId" element={<PrivateRoute role="client"><Chat role="client" /></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute role="admin"><AdminUsers /></PrivateRoute>} />
      <Route path="/admin/projects" element={<PrivateRoute role="admin"><AdminProjects /></PrivateRoute>} />
      <Route path="/admin/applications" element={<PrivateRoute role="admin"><AdminApplications /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
