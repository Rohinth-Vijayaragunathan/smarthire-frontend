// ============================================================
// FILE: src/components/PostJobModal.jsx
// ============================================================

import React, { useState } from 'react';
import { jobsAPI } from '../services/api';
import { X } from 'lucide-react';

export default function PostJobModal({ isOpen, onClose, onJobPosted, isMobile = false }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_name: '',
    company_website: '',
    location: '',
    job_type: 'full-time', // 'full-time', 'part-time', 'contract', 'internship'
    experience_level: 'entry', // 'entry', 'mid', 'senior'
    salary_min: '',
    salary_max: '',
    skills_required: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.skills_required.trim().split(',').length === 0) {
      newErrors.skills_required = 'At least one skill is required';
    }

    // Salary validation
    if (formData.salary_min && formData.salary_max) {
      if (parseInt(formData.salary_min) > parseInt(formData.salary_max)) {
        newErrors.salary_max = 'Max salary must be greater than min salary';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Format skills as array
      const skillsString = formData.skills_required
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill)
        .join(', ');  // ✅ String with ", " separator

      const payload = {
        title: formData.title.trim(),  // ✅ Trim whitespace
        description: formData.description.trim(),  // ✅ Trim whitespace
        company_name: formData.company_name.trim(),  // ✅ Trim whitespace
        company_website: formData.company_website.trim() || null,  // ✅ Null if empty
        location: formData.location.trim(),  // ✅ Trim whitespace
        job_type: formData.job_type,
        experience_level: formData.experience_level,
        salary_min: formData.salary_min ? parseInt(formData.salary_min, 10) : null,  // ✅ Proper parsing
        salary_max: formData.salary_max ? parseInt(formData.salary_max, 10) : null,  // ✅ Proper parsing
        skills_required: skillsString,  // ✅ String not array
        status: 'open',  // ✅ Default status
      };

      await jobsAPI.createJob(payload);

      // Reset form
      setFormData({
        title: '',
        description: '',
        company_name: '',
        company_website: '',
        location: '',
        job_type: 'full-time',
        experience_level: 'entry',
        salary_min: '',
        salary_max: '',
        skills_required: '',
      });

      onJobPosted(); // Refresh jobs list
      onClose(); // Close modal

      alert('✅ Job posted successfully!');
    } catch (error) {
      console.error('Failed to post job:', error);
      alert('❌ Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: isMobile ? 'flex-end' : 'center',
      zIndex: 1000,
      padding: isMobile ? 0 : '1rem',
    }}>
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '16px 16px 0 0' : '12px',
        padding: isMobile ? '1.5rem 1rem' : '2rem',
        maxWidth: isMobile ? '100%' : '600px',
        width: '100%',
        maxHeight: isMobile ? '90vh' : '90vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e0e0e0',
        }}>
          <h2 style={{
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: 'bold',
            margin: 0,
            color: '#333',
          }}>
            Post a New Job
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={24} color="#999" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Job Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#333',
            }}>
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Senior Python Developer"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.title ? '2px solid #ef4444' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
            {errors.title && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.3rem 0 0 0' }}>
                {errors.title}
              </p>
            )}
          </div>

          {/* Company Name & Website */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#333',
              }}>
                Company Name *
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                placeholder="e.g., Tech Corp"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.company_name ? '2px solid #ef4444' : '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.company_name && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.3rem 0 0 0' }}>
                  {errors.company_name}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#333',
              }}>
                Company Website
              </label>
              <input
                type="url"
                name="company_website"
                value={formData.company_website}
                onChange={handleInputChange}
                placeholder="e.g., https://techcorp.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Location & Job Type */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#333',
              }}>
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Remote, New York, Bangalore"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.location ? '2px solid #ef4444' : '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.location && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.3rem 0 0 0' }}>
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#333',
              }}>
                Job Type
              </label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Experience Level & Salary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#333',
              }}>
                Experience Level
              </label>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (2-5 years)</option>
                <option value="senior">Senior Level (5+ years)</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#333',
              }}>
                Salary Range (Optional)
              </label>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
              }}>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleInputChange}
                  placeholder="Min"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ color: '#999', fontWeight: '600' }}>-</span>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleInputChange}
                  placeholder="Max"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: errors.salary_max ? '2px solid #ef4444' : '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              {errors.salary_max && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.3rem 0 0 0' }}>
                  {errors.salary_max}
                </p>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#333',
            }}>
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the job role, responsibilities, and requirements..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.description ? '2px solid #ef4444' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.9rem',
                minHeight: '120px',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            {errors.description && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.3rem 0 0 0' }}>
                {errors.description}
              </p>
            )}
          </div>

          {/* Skills Required */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#333',
            }}>
              Required Skills * (Comma-separated)
            </label>
            <input
              type="text"
              name="skills_required"
              value={formData.skills_required}
              onChange={handleInputChange}
              placeholder="e.g., Python, Django, React, PostgreSQL"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.skills_required ? '2px solid #ef4444' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
            {errors.skills_required && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.3rem 0 0 0' }}>
                {errors.skills_required}
              </p>
            )}
            <p style={{
              color: '#999',
              fontSize: '0.8rem',
              margin: '0.3rem 0 0 0',
            }}>
              💡 Skills help candidates find your job and improve matching
            </p>
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '1rem',
            marginTop: '2rem',
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '0.8rem',
                background: '#e5e7eb',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'background 0.3s',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.8rem',
                background: loading ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'background 0.3s',
              }}
            >
              {loading ? 'Posting...' : '✓ Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}