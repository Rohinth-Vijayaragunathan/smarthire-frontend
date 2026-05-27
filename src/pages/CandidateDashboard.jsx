import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI, resumesAPI } from '../services/api';
import {
  LogOut,
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Heart,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Filter,
  ChevronRight,
  ExternalLink,
  Loader,
} from 'lucide-react';

export default function CandidateDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, jobs, applications, resumes
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterJobType, setFilterJobType] = useState('');
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [jobFilters, setJobFilters] = useState({
    search: '',
    location: '',
    job_type: '',
    page: 1,
  });
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [jobFilters]);

  // Replace with this updated code (same location, lines 47-73):
const loadData = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Remove the stats API call and calculate stats from applications
    const [jobsRes, applicationsRes, resumesRes] = await Promise.all([
      jobsAPI.list(jobFilters.page, jobFilters),
      applicationsAPI.myApplications(),
      resumesAPI.list(),
    ]);

    setJobs(jobsRes.data.results || []);
    
    const appData = applicationsRes.data.results || [];
    setApplications(appData);
    
    // Calculate stats from applications data (instead of API call)
    const calculatedStats = {
      total_applications: appData.length,
      shortlisted: appData.filter(app => app.status === 'shortlisted').length,
      under_review: appData.filter(app => app.status === 'under_review' || app.status === 'reviewed').length,
      pending: appData.filter(app => app.status === 'pending').length,
      rejected: appData.filter(app => app.status === 'rejected').length,
      hired: appData.filter(app => app.status === 'hired').length,
      interview_scheduled: appData.filter(app => app.status === 'interview').length,
    };
    
    setStats(calculatedStats);
    
    const appliedJobIds = new Set(appData.map((app) => app.job.id));
    setAppliedJobs(appliedJobIds);
    
    setResumes(resumesRes.data.results || []);
  } catch (error) {
    console.error('Failed to load data:', error);
  } finally {
    setLoading(false);
  }
};

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please select a file');
      return;
    }

    setUploadingResume(true);
    try {
      await resumesAPI.upload(resumeFile);
      alert('✓ Resume uploaded successfully!');
      setShowResumeModal(false);
      setResumeFile(null);
      loadData();
    } catch (error) {
      alert('Failed to upload resume: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setUploadingResume(false);
    }
  };

  const handleApplyJob = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      alert('Please write a cover letter');
      return;
    }

    setSubmittingApplication(true);
    try {
      await applicationsAPI.apply(selectedJobForApply.id, coverLetter);
      alert('✓ Application submitted successfully!');
      setAppliedJobs(new Set([...appliedJobs, selectedJobForApply.id]));
      setShowApplyModal(false);
      setCoverLetter('');
      loadData();
    } catch (error) {
      alert('Failed to apply: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setSubmittingApplication(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm('Delete this resume?')) {
      try {
        await resumesAPI.delete(resumeId);
        alert('✓ Resume deleted!');
        loadData();
      } catch (error) {
        alert('Failed to delete resume');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(jobFilters.search.toLowerCase()) ||
      job.company_name.toLowerCase().includes(jobFilters.search.toLowerCase());
    const matchesLocation = !jobFilters.location || job.location.toLowerCase().includes(jobFilters.location.toLowerCase());
    const matchesType = !jobFilters.job_type || job.job_type === jobFilters.job_type;
    return matchesSearch && matchesLocation && matchesType;
  });

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fa',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size={40} style={{
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
            color: '#667eea',
          }} />
          <p style={{ fontSize: '1.1rem', color: '#667eea' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* TOP NAV */}
      <nav style={{
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#667eea',
        }}>
          🚀 SmartHire
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
        }}>
          <span style={{
            color: '#555',
            fontSize: '0.95rem',
          }}>
            Welcome, <strong>{user?.first_name}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.7rem 1.3rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* TABS */}
      <div style={{
        background: 'white',
        borderBottom: '2px solid #e0e0e0',
        padding: '0 2rem',
        display: 'flex',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {['dashboard', 'jobs', 'applications', 'resumes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '1rem 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: activeTab === tab ? 'bold' : '500',
              color: activeTab === tab ? '#667eea' : '#999',
              borderBottom: activeTab === tab ? '3px solid #667eea' : 'none',
              transition: 'all 0.3s',
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
      }}>
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            {/* STATS CARDS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}>
              {/* Total Applications */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ color: '#888', fontSize: '0.85rem', margin: 0, fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Total Applications
                    </p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', margin: '0.5rem 0 0 0' }}>
                      {stats?.total_applications || 0}
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    padding: '1rem',
                    borderRadius: '8px',
                  }}>
                    <Briefcase size={24} color="white" />
                  </div>
                </div>
              </div>

              {/* Shortlisted */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ color: '#888', fontSize: '0.85rem', margin: 0, fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Shortlisted
                    </p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', margin: '0.5rem 0 0 0' }}>
                      {stats?.shortlisted || 0}
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    padding: '1rem',
                    borderRadius: '8px',
                  }}>
                    <CheckCircle size={24} color="white" />
                  </div>
                </div>
              </div>

              {/* Under Review */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ color: '#888', fontSize: '0.85rem', margin: 0, fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Under Review
                    </p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', margin: '0.5rem 0 0 0' }}>
                      {stats?.under_review || 0}
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    padding: '1rem',
                    borderRadius: '8px',
                  }}>
                    <Clock size={24} color="white" />
                  </div>
                </div>
              </div>

              {/* Resumes */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ color: '#888', fontSize: '0.85rem', margin: 0, fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Resumes
                    </p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', margin: '0.5rem 0 0 0' }}>
                      {resumes.length}
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                    padding: '1rem',
                    borderRadius: '8px',
                  }}>
                    <FileText size={24} color="white" />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA SECTION */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '12px',
              padding: '2rem',
              color: 'white',
              textAlign: 'center',
              marginBottom: '2rem',
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                Ready to find your next opportunity?
              </h2>
              <p style={{ margin: '0 0 1.5rem 0', opacity: 0.9 }}>
                Browse hundreds of job listings and apply in seconds
              </p>
              <button
                onClick={() => setActiveTab('jobs')}
                style={{
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  padding: '0.8rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Browse Jobs
              </button>
            </div>
          </>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <>
            {/* SEARCH & FILTERS */}
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginTop: 0, marginBottom: '1rem' }}>
                Find Your Perfect Job
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999',
                  }} />
                  <input
                    type="text"
                    placeholder="Job title or company..."
                    value={jobFilters.search}
                    onChange={(e) => setJobFilters({ ...jobFilters, search: e.target.value, page: 1 })}
                    style={{
                      width: '100%',
                      paddingLeft: '2.5rem',
                      paddingRight: '1rem',
                      paddingTop: '0.8rem',
                      paddingBottom: '0.8rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999',
                  }} />
                  <input
                    type="text"
                    placeholder="Location..."
                    value={jobFilters.location}
                    onChange={(e) => setJobFilters({ ...jobFilters, location: e.target.value, page: 1 })}
                    style={{
                      width: '100%',
                      paddingLeft: '2.5rem',
                      paddingRight: '1rem',
                      paddingTop: '0.8rem',
                      paddingBottom: '0.8rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <select
                  value={jobFilters.job_type}
                  onChange={(e) => setJobFilters({ ...jobFilters, job_type: e.target.value, page: 1 })}
                  style={{
                    padding: '0.8rem 1rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="">All Job Types</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            {/* JOBS LIST */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredJobs.length === 0 ? (
                <div style={{
                  background: 'white',
                  padding: '3rem 2rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  color: '#999',
                }}>
                  <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>No jobs found. Try adjusting your filters.</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      background: 'white',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 0.3rem 0' }}>
                          {job.title}
                        </h3>
                        <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
                          {job.company_name}
                        </p>
                      </div>
                      <span style={{
                        background: job.status === 'open' ? '#dcfce7' : '#f3f4f6',
                        color: job.status === 'open' ? '#166534' : '#666',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                      }}>
                        {job.status}
                      </span>
                    </div>

                    {/* JOB DETAILS */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #eee',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                        <MapPin size={16} />
                        {job.location}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                        <Briefcase size={16} />
                        {job.job_type}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                        <DollarSign size={16} />
                        ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <p style={{
                      color: '#555',
                      lineHeight: '1.5',
                      margin: '0 0 1rem 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {job.description}
                    </p>

                    {/* SKILLS */}
                    {job.skills_list && job.skills_list.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {job.skills_list.slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: '#f0f4ff',
                                color: '#667eea',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                              }}
                            >
                              {skill.trim()}
                            </span>
                          ))}
                          {job.skills_list.length > 4 && (
                            <span style={{
                              background: '#f0f4ff',
                              color: '#667eea',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '500',
                            }}>
                              +{job.skills_list.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* APPLY BUTTON */}
                    <button
                      onClick={() => {
                        setSelectedJobForApply(job);
                        setShowApplyModal(true);
                      }}
                      disabled={appliedJobs.has(job.id) || job.status !== 'open'}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: appliedJobs.has(job.id)
                          ? '#e0e0e0'
                          : job.status !== 'open'
                          ? '#e0e0e0'
                          : 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: appliedJobs.has(job.id) || job.status !== 'open' ? '#999' : 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: appliedJobs.has(job.id) || job.status !== 'open' ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        if (!appliedJobs.has(job.id) && job.status === 'open') {
                          e.target.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {appliedJobs.has(job.id) ? '✓ Already Applied' : job.status !== 'open' ? 'Position Closed' : 'Apply Now'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}>
            {applications.length === 0 ? (
              <div style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#999',
              }}>
                <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p style={{ fontSize: '1.1rem', margin: 0 }}>
                  No applications yet. Start applying to jobs!
                </p>
              </div>
            ) : (
              <div>
                {applications.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      padding: '1.5rem',
                      borderBottom: '1px solid #eee',
                      transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.3rem 0' }}>
                          {app.job.title}
                        </h3>
                        <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
                          {app.job.company_name}
                        </p>
                      </div>
                      <span style={{
                        background: {
                          'applied': '#dbeafe',
                          'under_review': '#fef3c7',
                          'shortlisted': '#dcfce7',
                          'rejected': '#fee2e2',
                          'accepted': '#10b981',
                        }[app.status] || '#e0e0e0',
                        color: {
                          'applied': '#1e40af',
                          'under_review': '#92400e',
                          'shortlisted': '#166534',
                          'rejected': '#991b1b',
                          'accepted': 'white',
                        }[app.status] || '#666',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #eee',
                    }}>
                      <div>
                        <p style={{ color: '#999', fontSize: '0.8rem', margin: '0 0 0.25rem 0', textTransform: 'uppercase', fontWeight: 'bold' }}>
                          Applied
                        </p>
                        <p style={{ margin: 0, color: '#333' }}>
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {app.interview_scheduled && (
                        <div>
                          <p style={{ color: '#999', fontSize: '0.8rem', margin: '0 0 0.25rem 0', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            Interview
                          </p>
                          <p style={{ margin: 0, color: '#10b981', fontWeight: 'bold' }}>
                            {new Date(app.interview_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {app.rating && (
                        <div>
                          <p style={{ color: '#999', fontSize: '0.8rem', margin: '0 0 0.25rem 0', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            Rating
                          </p>
                          <p style={{ margin: 0, color: '#f59e0b' }}>
                            {'⭐'.repeat(app.rating)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESUMES TAB */}
        {activeTab === 'resumes' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                onClick={() => setShowResumeModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                }}
              >
                <Upload size={20} />
                Upload New Resume
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}>
              {resumes.length === 0 ? (
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  gridColumn: '1 / -1',
                  color: '#999',
                }}>
                  <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>No resumes uploaded yet</p>
                </div>
              ) : (
                resumes.map((resume) => (
                  <div
                    key={resume.id}
                    style={{
                      background: 'white',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <FileText size={32} color="#667eea" />
                      <button
                        onClick={() => handleDeleteResume(resume.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '0.4rem',
                        }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                      {resume.title || 'Resume'}
                    </h3>

                    <p style={{ color: '#999', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                      Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
                    </p>

                    <a
                      href={resume.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#667eea',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      Download <ExternalLink size={16} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* APPLY JOB MODAL */}
      {showApplyModal && selectedJobForApply && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                Apply for {selectedJobForApply.title}
              </h2>
              <button
                onClick={() => setShowApplyModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleApplyJob} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#333',
                }}>
                  Cover Letter *
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're interested in this position..."
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontFamily: 'Arial',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={submittingApplication}
                  style={{
                    background: submittingApplication ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: submittingApplication ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submittingApplication ? 'Submitting...' : 'Submit Application'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  style={{
                    background: '#e0e0e0',
                    color: '#333',
                    fontWeight: 'bold',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESUME UPLOAD MODAL */}
      {showResumeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
          }}>
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                Upload Resume
              </h2>
              <button
                onClick={() => setShowResumeModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleResumeUpload} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#333',
                }}>
                  Resume Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Developer Resume"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#333',
                }}>
                  Select PDF File *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px dashed #ddd',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                />
                {resumeFile && (
                  <p style={{ color: '#10b981', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                    ✓ {resumeFile.name}
                  </p>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={uploadingResume || !resumeFile}
                  style={{
                    background: uploadingResume || !resumeFile ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: uploadingResume || !resumeFile ? 'not-allowed' : 'pointer',
                  }}
                >
                  {uploadingResume ? 'Uploading...' : 'Upload'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowResumeModal(false)}
                  style={{
                    background: '#e0e0e0',
                    color: '#333',
                    fontWeight: 'bold',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
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