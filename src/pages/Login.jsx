import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      
      // Save tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect based on role
      const role = response.data.user.role;
      navigate(role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCandidate = () => {
    setEmail('candidate@example.com');
    setPassword('SecurePass123!');
  };

  const fillDemoRecruiter = () => {
    setEmail('recruiter@example.com');
    setPassword('SecurePass123!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '3rem',
        width: '100%',
        maxWidth: '450px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#667eea',
            marginBottom: '0.5rem',
          }}>
            SmartHire
          </div>
          <p style={{
            fontSize: '0.95rem',
            color: '#6b7280',
            margin: 0,
          }}>
            AI-Powered Job Application Tracker
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            display: 'flex',
            gap: '0.75rem',
          }}>
            <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
            <p style={{
              fontSize: '0.9rem',
              color: '#991b1b',
              margin: 0,
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          {/* Email Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.5rem',
            }}>
              Email Address
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '1rem',
                color: '#9ca3af',
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  paddingLeft: '2.75rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.5rem',
            }}>
              Password
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '1rem',
                color: '#9ca3af',
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  paddingLeft: '2.75rem',
                  paddingRight: '2.75rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '0.5rem',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* // In your login form, after password input: */}
            {/* {/* <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <a
                href="/forgot-password"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                Forgot Password?
              </a>
            </div> */}
          </div> 

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#9ca3af' : '#667eea',
              hover: !loading ? '#5568d3' : undefined,
              color: 'white',
              fontWeight: '600',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.8 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#5568d3';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#667eea';
            }}
          >
            {loading && <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '1.5rem 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Demo Accounts</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </div>

        {/* Demo Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}>
          <button
            type="button"
            onClick={fillDemoCandidate}
            style={{
              padding: '0.75rem',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
          >
            👤 Candidate Demo
          </button>
          <button
            type="button"
            onClick={fillDemoRecruiter}
            style={{
              padding: '0.75rem',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
          >
            💼 Recruiter Demo
          </button>
        </div>

        {/* Sign Up Link */}
        <div style={{
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb',
        }}>
          <p style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            margin: '0 0 0.5rem 0',
          }}>
            Don't have an account?{' '}
            <a
              href="/register"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.color = '#5568d3'}
              onMouseLeave={(e) => e.target.style.color = '#667eea'}
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}