import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors (keep your existing ones)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const sanitizeInput = (input) => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// ============ AUTH API ============
export const authAPI = {
  register: (userData) => {
    return api.post('/users/register/', userData);  // Note: /users/ not /auth/
  },
  login: (email, password) => {
    return api.post('/users/login/', { email, password });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
  getProfile: () => {
    return api.get('/users/profile/');
  },

};

// ============ JOBS API ============
export const jobsAPI = {
  createJob: (jobData) => {
    return api.post('/jobs/', jobData);
  },
  listJobs: (page = 1, filters = {}) => {
    return api.get('/jobs/', { params: { page, ...filters } });
  },
  list: (page = 1, filters = {}) => {  // Alias for compatibility
    return api.get('/jobs/', { params: { page, ...filters } });
  },
  myJobs: (page = 1) => {
    return api.get('/jobs/my-jobs/', { params: { page } });
  },
  getJobDetail: (jobId) => {
    return api.get(`/jobs/${jobId}/`);
  },
  updateJob: (jobId, jobData) => {
    return api.put(`/jobs/${jobId}/`, jobData);
  },
  deleteJob: (jobId) => {
    return api.delete(`/jobs/${jobId}/`);
  },
};

// ============ APPLICATIONS API ============
export const applicationsAPI = {
  apply: (jobId, coverLetter) => {
    return api.post('/applications/apply/', { 
      job: jobId, 
      cover_letter: coverLetter 
    });
  },
  myApplications: (page = 1) => {
    return api.get('/applications/my-applications/', { params: { page } });
  },
  jobApplications: (jobId, page = 1) => {
    return api.get(`/applications/job/${jobId}/`, { params: { page } });
  },
  getApplicationDetail: (applicationId) => {
    return api.get(`/applications/${applicationId}/`);
  },
  updateStatus: (applicationId, newStatus) => {
    return api.put(`/applications/${applicationId}/`, { status: newStatus });
  },
  updateNotes: (applicationId, notes) => {
    return api.put(`/applications/${applicationId}/`, { recruiter_notes: sanitizeInput(notes) });
  },
  updateRating: (applicationId, rating) => {
    return api.put(`/applications/${applicationId}/`, { rating: rating });
  },
  getCandidateStats: () => {
    return api.get('/applications/candidate-stats/');
  },
  getRecruiterStats: () => {
    return api.get('/applications/stats/');
  },
  // ✅ ADD THIS METHOD - Update everything at once
  updateApplication: (applicationId, data) => {
    return api.put(`/applications/${applicationId}/`, data);
  },
  
  // ✅ ADD THIS METHOD - Download resume
  downloadResume: (applicationId) => {
    return api.get(`/applications/${applicationId}/resume/`, {
      responseType: 'blob'  // Important for file download
    });
  },
  
  // ✅ ADD THIS METHOD - Schedule interview
  scheduleInterview: (applicationId, interviewData) => {
    return api.post(`/applications/${applicationId}/schedule-interview/`, interviewData);
  },
};

// ============ RESUMES API ============
export const resumesAPI = {
  upload: (file, title = 'My Resume') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    
    return api.post('/users/resumes/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  list: () => {
    return api.get('/users/resumes/');
  },
  getResumes: () => {  // Alias
    return api.get('/users/resumes/');
  },
  delete: (resumeId) => {
    return api.delete(`/users/resumes/${resumeId}/`);
  },
  deleteResume: (resumeId) => {  // Alias
    return api.delete(`/users/resumes/${resumeId}/`);
  },
  setPrimary: (resumeId) => {
    return api.post(`/users/resumes/${resumeId}/set-primary/`);
  },
  download: (resumeId) => {
    return api.get(`/users/resumes/${resumeId}/download/`);
  },
};

export default api;