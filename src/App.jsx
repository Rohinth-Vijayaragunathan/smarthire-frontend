import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import JobListing from './pages/JobListing';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';

// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('access_token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Forgot & Reset Password Routes */}
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} /> */}

        {/* Candidate Routes */}
        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute requiredRole="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute requiredRole="candidate">
              <JobListing />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute requiredRole="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}