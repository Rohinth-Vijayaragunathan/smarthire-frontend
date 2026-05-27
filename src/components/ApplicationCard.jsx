import React, { useState } from 'react';
import { applicationsAPI } from '../services/api';
import { Download, ChevronDown, Star, Loader } from 'lucide-react';
import ResumeSections from './ResumeSections';

export default function ApplicationCard({ application, onStatusUpdate, isMobile = false }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(application.status);
  const [rating, setRating] = useState(application.rating || 0);
  const [notes, setNotes] = useState(application.recruiter_notes || '');
  const [updating, setUpdating] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null);

  const handleStatusChange = async (newStatus) => {
    if (updating) return;
    
    const oldStatus = status;
    setStatus(newStatus);
    setLoadingStatus(newStatus);
    
    try {
      setUpdating(true);
      const response = await applicationsAPI.updateStatus(application.id, newStatus);
      
      if (onStatusUpdate) {
        onStatusUpdate(response.data);
      }
      
    } catch (error) {
      setStatus(oldStatus);
      console.error('Status update error:', error);
      alert('Failed to update status: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setUpdating(false);
      setLoadingStatus(null);
    }
  };

  const handleSaveNotes = async () => {
    if (updating) return;
    
    try {
      setUpdating(true);
      
      const response = await applicationsAPI.updateApplication(application.id, {
        status: status,
        recruiter_notes: notes,
        rating: rating,
      });
      
      alert('Changes saved successfully!');
      
      if (onStatusUpdate) {
        onStatusUpdate(response.data);
      }
      
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save changes: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'applied': '#dbeafe',
      'under_review': '#fef3c7',
      'shortlisted': '#dcfce7',
      'rejected': '#fee2e2',
      'accepted': '#d1fae5',
    };
    const textColors = {
      'applied': '#1e40af',
      'under_review': '#92400e',
      'shortlisted': '#166534',
      'rejected': '#991b1b',
      'accepted': '#065f46',
    };
    return { background: colors[status] || '#f3f4f6', color: textColors[status] || '#666' };
  };

  const statusColor = getStatusColor(status);

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '1rem',
      background: 'white',
      transition: 'all 0.3s',
    }}>
      
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          paddingBottom: expanded ? '1rem' : 0,
          borderBottom: expanded ? '1px solid #e0e0e0' : 'none',
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>
            {application.candidate.first_name} {application.candidate.last_name}
          </h3>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.3rem 0 0 0' }}>
            {application.candidate.email}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{
            ...statusColor,
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            textTransform: 'capitalize',
          }}>
            {status.replace('_', ' ')}
          </span>
          <ChevronDown
            size={20}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
              color: '#999',
            }}
          />
        </div>
      </div>

      {/* Details */}
      {expanded && (
        <div style={{ paddingTop: '1rem' }}>
          
          {/* Cover Letter */}
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#666', margin: '0 0 0.5rem 0' }}>
              COVER LETTER
            </p>
            <p style={{
              background: '#f9f9f9',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              margin: 0,
              color: '#555',
            }}>
              {application.cover_letter || 'No cover letter provided'}
            </p>
          </div>

          {/* Resume Content - Extracted Sections */}
            <div style={{ marginBottom: '1rem' }}>
              <p style={{
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: '#666',
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
              }}>
                Resume Content
              </p>
              
              {application.candidate_resume_text ? (
                <div style={{
                  background: '#f9f9f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  color: '#555',
                  border: '1px solid #e0e0e0',
                }}>
                  <ResumeSections resumeText={application.candidate_resume_text} />
                </div>
              ) : (
                <div style={{
                  background: '#f9f9f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#999',
                  textAlign: 'center',
                }}>
                  No resume available
                </div>
              )}
            </div>

          {/* Metadata */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #f0f0f0',
          }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#999', margin: 0 }}>Applied</p>
              <p style={{ fontSize: '0.9rem', fontWeight: '500', margin: '0.3rem 0 0 0' }}>
                {new Date(application.created_at).toLocaleDateString()}
              </p>
            </div>
            {application.interview_scheduled && (
              <div>
                <p style={{ fontSize: '0.8rem', color: '#999', margin: 0 }}>Interview</p>
                <p style={{ fontSize: '0.9rem', fontWeight: '500', color: '#10b981', margin: '0.3rem 0 0 0' }}>
                  {new Date(application.interview_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Rating */}
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#666', margin: '0 0 0.5rem 0' }}>
              RATING
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  onClick={() => setRating(star)}
                  style={{
                    cursor: 'pointer',
                    fill: star <= rating ? '#fbbf24' : 'none',
                    color: star <= rating ? '#fbbf24' : '#ddd',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#666', margin: '0 0 0.5rem 0' }}>
              NOTES
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes about this candidate..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                minHeight: '80px',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#666', margin: '0 0 0.5rem 0' }}>
              UPDATE STATUS
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {['applied', 'under_review', 'shortlisted', 'rejected', 'accepted'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating}
                  style={{
                    padding: '0.6rem',
                    border: status === s ? '2px solid #667eea' : '1px solid #ddd',
                    background: status === s ? '#f0f4ff' : 'white',
                    borderRadius: '6px',
                    cursor: updating ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s',
                    color: status === s ? '#667eea' : '#666',
                    opacity: updating ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {loadingStatus === s ? (
                    <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    s.replace('_', ' ')
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={handleSaveNotes}
              disabled={updating}
              style={{
                padding: '0.65rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: updating ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'background 0.3s',
                opacity: updating ? 0.5 : 1,
              }}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              onClick={async () => {
                try {
                  setUpdating(true);
                  const response = await applicationsAPI.downloadResume(application.id);
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `resume_${application.candidate.first_name}_${application.candidate.last_name}.pdf`);
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Download error:', error);
                  alert('Failed to download resume');
                } finally {
                  setUpdating(false);
                }
              }}
              style={{
                padding: '0.65rem',
                background: '#e5e7eb',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <Download size={16} />
              Resume
            </button>

            <button
              onClick={() => {
                const interviewDate = prompt('Enter interview date (YYYY-MM-DD HH:MM):');
                if (interviewDate) {
                  const interviewNotes = prompt('Enter interview notes (optional):');
                  applicationsAPI.scheduleInterview(application.id, {
                    interview_date: interviewDate,
                    interview_notes: interviewNotes || '',
                  }).then(() => {
                    alert('Interview scheduled successfully!');
                    if (onStatusUpdate) onStatusUpdate();
                  }).catch(error => {
                    alert('Failed to schedule interview');
                  });
                }
              }}
              style={{
                padding: '0.65rem',
                background: '#e5e7eb',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
              }}
            >
              Schedule Interview
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}