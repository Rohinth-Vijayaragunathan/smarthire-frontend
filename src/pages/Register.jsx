import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Mail, Lock, User, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    role: 'candidate',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.register(formData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorData = err.response?.data;
      const errorMsg = typeof errorData === 'object' 
        ? Object.values(errorData).flat().join(', ')
        : errorData?.error || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '450px',
        }}>
          <CheckCircle size={48} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem',
          }}>
            Registration Successful!
          </h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '1rem',
          }}>
            Redirecting to login...
          </p>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite',
          }} />
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
        maxWidth: '500px',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '0.5rem',
        }}>
          Create Account
        </h1>
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem',
          fontSize: '0.95rem',
        }}>
          Join SmartHire and start your career journey
        </p>

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
            <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
            <p style={{
              fontSize: '0.9rem',
              color: '#991b1b',
              margin: 0,
            }}>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.4rem',
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.65rem',
                  paddingBottom: '0.65rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Name Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.4rem',
              }}>
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="John"
                style={{
                  width: '100%',
                  paddingLeft: '0.75rem',
                  paddingRight: '0.75rem',
                  paddingTop: '0.65rem',
                  paddingBottom: '0.65rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.4rem',
              }}>
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Doe"
                style={{
                  width: '100%',
                  paddingLeft: '0.75rem',
                  paddingRight: '0.75rem',
                  paddingTop: '0.65rem',
                  paddingBottom: '0.65rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Role */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.4rem',
            }}>
              I am a...
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer',
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="candidate">Job Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.4rem',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                style={{
                  width: '100%',
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.65rem',
                  paddingBottom: '0.65rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.4rem',
            }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }} />
              <input
                type="password"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                style={{
                  width: '100%',
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.65rem',
                  paddingBottom: '0.65rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#9ca3af' : '#667eea',
              color: 'white',
              fontWeight: '600',
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#5568d3';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#667eea';
            }}
          >
            {loading && <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <p style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            margin: 0,
          }}>
            Already have an account?{' '}
            <a
              href="/login"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.target.style.color = '#5568d3'}
              onMouseLeave={(e) => e.target.style.color = '#667eea'}
            >
              Login
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