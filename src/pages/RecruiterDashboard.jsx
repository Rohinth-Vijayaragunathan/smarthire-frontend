// ============================================================
// FILE: src/pages/RecruiterDashboard.jsx
// COMPLETE FILE - COPY AND REPLACE YOUR EXISTING FILE
// ============================================================

import React, { useState, useEffect } from 'react';
import { jobsAPI, applicationsAPI } from '../services/api';
import ApplicationCard from '../components/ApplicationCard';
import PostJobModal from '../components/PostJobModal';

export default function RecruiterDashboard() {
  
  // ============ STATE VARIABLES ============
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Advanced Features
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedApps, setSelectedApps] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  // 🎯 POST JOB MODAL STATE - ADD THIS
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  
  // Mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ============ USE EFFECTS ============
  useEffect(() => {
    loadMyJobs();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ============ LOAD DATA FUNCTIONS ============
  const loadMyJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.myJobs();
      setMyJobs(response.data.results);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async (jobId) => {
    try {
      const response = await applicationsAPI.jobApplications(jobId);
      setApplications(response.data.results);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  // ============ ADVANCED FEATURE FUNCTIONS ============
  const getFilteredApplications = () => {
    if (filterStatus === 'all') return applications;
    return applications.filter(app => app.status === filterStatus);
  };

  const getSortedApplications = (appsToSort) => {
    return [...appsToSort].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'name') {
        const nameA = `${a.candidate.first_name} ${a.candidate.last_name}`;
        const nameB = `${b.candidate.first_name} ${b.candidate.last_name}`;
        return nameA.localeCompare(nameB);
      }
      return 0;
    });
  };

  const getSearchedApplications = (appsToSearch) => {
    return appsToSearch.filter(app => {
      const fullName = `${app.candidate.first_name} ${app.candidate.last_name}`.toLowerCase();
      const email = app.candidate.email.toLowerCase();
      const notes = (app.recruiter_notes || '').toLowerCase();
      
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        notes.includes(searchTerm.toLowerCase())
      );
    });
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      await Promise.all(
        Array.from(selectedApps).map(appId =>
          applicationsAPI.updateStatus(appId, newStatus)
        )
      );
      setSelectedApps(new Set());
      loadApplications(selectedJob);
    } catch (error) {
      alert('Failed to bulk update');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Status', 'Rating', 'Applied Date'];
    const rows = applications.map(app => [
      `${app.candidate.first_name} ${app.candidate.last_name}`,
      app.candidate.email,
      app.status,
      app.rating || 'N/A',
      new Date(app.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // ============ HANDLE VIEW APPLICATIONS ============
  const handleViewApplications = async (jobId) => {
    setSelectedJob(jobId);
    setFilterStatus('all');
    setSortBy('date');
    setSearchTerm('');
    setSelectedApps(new Set());
    await loadApplications(jobId);
  };

  // ============ COMPUTED VALUES ============
  const filteredApplications = getFilteredApplications();
  const sortedApplications = getSortedApplications(filteredApplications);
  const finalApplicationsList = getSearchedApplications(sortedApplications);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      fontFamily: 'Arial, sans-serif',
    }}>
      
      {/* ============ NAVBAR ============ */}
      <nav style={{
        background: 'white',
        padding: isMobile ? '1rem' : '1.5rem 2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{
          color: '#667eea',
          fontSize: isMobile ? '1.3rem' : '1.8rem',
          fontWeight: 'bold',
          margin: 0,
        }}>
          🚀 SmartHire
        </h1>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}>
          {/* 🎯 POST JOB BUTTON - ADD THIS */}
          <button
            onClick={() => setIsPostJobModalOpen(true)}
            style={{
              padding: isMobile ? '0.5rem 0.8rem' : '0.7rem 1.5rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '0.8rem' : '0.95rem',
              transition: 'background 0.3s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => e.target.style.background = '#764ba2'}
            onMouseLeave={(e) => e.target.style.background = '#667eea'}
          >
            {isMobile ? '+ Post' : '+ Post Job'}
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            style={{
              padding: isMobile ? '0.5rem 0.8rem' : '0.7rem 1.5rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '0.8rem' : '0.95rem',
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🎯 POST JOB MODAL - ADD THIS */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onJobPosted={loadMyJobs}
        isMobile={isMobile}
      />

      {/* ============ MAIN CONTENT ============ */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '1rem' : '2rem',
      }}>
        
        {/* ============ STATS SECTION ============ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <StatCard
            title="Posted Jobs"
            value={myJobs.length}
            color="#667eea"
          />
          <StatCard
            title="Total Applications"
            value={applications.length}
            color="#3b82f6"
          />
          <StatCard
            title="Shortlisted"
            value={applications.filter(a => a.status === 'shortlisted').length}
            color="#10b981"
          />
        </div>

        {/* ============ MAIN CONTENT AREA ============ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
          gap: isMobile ? '1rem' : '2rem',
        }}>
          
          {/* ============ LEFT PANEL: JOBS LIST ============ */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: '1.5rem',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}>
              <h2 style={{
                fontSize: isMobile ? '1rem' : '1.2rem',
                fontWeight: 'bold',
                margin: 0,
              }}>
                My Jobs
              </h2>
              <span style={{
                background: '#dbeafe',
                color: '#1e40af',
                padding: '0.3rem 0.6rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}>
                {myJobs.length}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '600px',
              overflowY: 'auto',
            }}>
              {myJobs.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#999',
                  padding: '2rem 1rem',
                }}>
                  <p style={{ margin: 0 }}>No jobs posted yet</p>
                  <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                    Click "Post Job" to get started
                  </p>
                </div>
              ) : (
                myJobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => handleViewApplications(job.id)}
                    style={{
                      padding: '1rem',
                      border: selectedJob === job.id ? '2px solid #667eea' : '1px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: selectedJob === job.id ? '#f0f4ff' : 'white',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      gap: '0.5rem',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: isMobile ? '0.9rem' : '1rem',
                          fontWeight: 'bold',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {job.title}
                        </h3>
                        <p style={{
                          color: '#666',
                          fontSize: '0.85rem',
                          margin: '0.3rem 0 0 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {job.location}
                        </p>
                      </div>
                      <span style={{
                        background: '#dbeafe',
                        color: '#1e40af',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                      }}>
                        {applications.filter(a => a.job.id === job.id).length} apps
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ============ RIGHT PANEL: APPLICATIONS ============ */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: '1.5rem',
          }}>
            
            {selectedJob ? (
              <>
                <h2 style={{
                  fontSize: isMobile ? '1rem' : '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  margin: '0 0 1rem 0',
                }}>
                  Applications ({finalApplicationsList.length})
                </h2>

                {/* ============ FILTER BUTTONS ============ */}
                <div style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}>
                  {['all', 'applied', 'under_review', 'shortlisted', 'rejected', 'accepted'].map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      style={{
                        padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
                        border: filterStatus === status ? '2px solid #667eea' : '1px solid #ddd',
                        background: filterStatus === status ? '#f0f4ff' : 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: filterStatus === status ? 'bold' : '500',
                        textTransform: 'capitalize',
                        fontSize: isMobile ? '0.75rem' : '0.9rem',
                      }}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* ============ SORT & SEARCH ============ */}
                <div style={{
                  display: isMobile ? 'grid' : 'flex',
                  gridTemplateColumns: isMobile ? '1fr 1fr' : undefined,
                  gap: isMobile ? '0.5rem' : '1rem',
                  marginBottom: '1rem',
                  alignItems: isMobile ? 'start' : 'center',
                }}>
                  
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: '0.6rem 1rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      flex: 1,
                      minWidth: 0,
                    }}
                  />

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: '0.6rem 1rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      minWidth: isMobile ? '100%' : 'auto',
                    }}
                  >
                    <option value="date">Sort by Date</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="name">Sort by Name</option>
                  </select>

                  <button
                    onClick={exportToCSV}
                    style={{
                      padding: '0.6rem 1.2rem',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      minWidth: isMobile ? '100%' : 'auto',
                    }}
                  >
                    📥 Export
                  </button>
                </div>

                {/* ============ APPLICATIONS LIST ============ */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  maxHeight: '600px',
                  overflowY: 'auto',
                }}>
                  {finalApplicationsList.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      color: '#999',
                      padding: '2rem 1rem',
                    }}>
                      <p style={{ margin: 0 }}>No applications found</p>
                    </div>
                  ) : (
                    finalApplicationsList.map(app => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        onStatusUpdate={() => loadApplications(selectedJob)}
                        isMobile={isMobile}
                        isSelected={selectedApps.has(app.id)}
                        onSelect={(isSelected) => {
                          if (isSelected) {
                            setSelectedApps(new Set([...selectedApps, app.id]));
                          } else {
                            setSelectedApps(new Set([...selectedApps].filter(id => id !== app.id)));
                          }
                        }}
                      />
                    ))
                  )}
                </div>

                {/* ============ BULK ACTIONS TOOLBAR ============ */}
                {selectedApps.size > 0 && (
                  <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    zIndex: 999,
                    minWidth: isMobile ? 'calc(100% - 2rem)' : 'auto',
                    left: isMobile ? '1rem' : 'auto',
                  }}>
                    <p style={{
                      margin: '0 0 1rem 0',
                      fontWeight: 'bold',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                    }}>
                      {selectedApps.size} selected
                    </p>
                    <div style={{
                      display: isMobile ? 'grid' : 'flex',
                      gridTemplateColumns: isMobile ? '1fr 1fr' : undefined,
                      gap: '0.5rem',
                    }}>
                      <button
                        onClick={() => handleBulkStatusUpdate('shortlisted')}
                        style={{
                          padding: '0.6rem 1.2rem',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: isMobile ? '0.85rem' : '0.9rem',
                        }}
                      >
                        ✓ Shortlist
                      </button>
                      <button
                        onClick={() => handleBulkStatusUpdate('rejected')}
                        style={{
                          padding: '0.6rem 1.2rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: isMobile ? '0.85rem' : '0.9rem',
                        }}
                      >
                        ✗ Reject
                      </button>
                      <button
                        onClick={() => setSelectedApps(new Set())}
                        style={{
                          padding: '0.6rem 1.2rem',
                          background: '#e5e7eb',
                          color: '#333',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: isMobile ? '0.85rem' : '0.9rem',
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#999',
                padding: '2rem',
              }}>
                <p>👈 Select a job to view applications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ STAT CARD COMPONENT ============
function StatCard({ title, value, color }) {
  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      textAlign: 'center',
    }}>
      <p style={{
        color: '#999',
        fontSize: '0.9rem',
        margin: 0,
      }}>
        {title}
      </p>
      <p style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color,
        margin: '0.5rem 0 0 0',
      }}>
        {value}
      </p>
    </div>
  );
}