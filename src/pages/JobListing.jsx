import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import { LogOut, Search } from 'lucide-react';

export default function JobListing() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    job_type: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
    loadAppliedJobs();
  }, [filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.list(filters.page, filters);
      setJobs(response.data.results);
      setPagination({
        count: response.data.count,
        hasNext: response.data.has_next,
        hasPrevious: response.data.has_previous,
        page: response.data.page,
        totalPages: response.data.total_pages,
      });
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAppliedJobs = async () => {
    try {
      const response = await applicationsAPI.myApplications(1);
      const jobIds = new Set(response.data.results.map(app => app.job.id));
      setAppliedJobs(jobIds);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const coverLetter = prompt('Enter your cover letter:');
      if (!coverLetter) return;

      await applicationsAPI.apply(jobId, coverLetter);
      setAppliedJobs(prev => new Set([...prev, jobId]));
      alert('Application submitted successfully!');
    } catch (error) {
      alert('Failed to apply: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">SmartHire</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Search Jobs</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Job title or keywords"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value, page: 1})}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              value={filters.job_type}
              onChange={(e) => setFilters({...filters, job_type: e.target.value, page: 1})}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Types</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            <button
              onClick={() => setFilters({...filters, page: 1})}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-12">Loading jobs...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  isApplied={appliedJobs.has(job.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-4">
                <button
                  disabled={!pagination.hasPrevious}
                  onClick={() => setFilters({...filters, page: pagination.page - 1})}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={!pagination.hasNext}
                  onClick={() => setFilters({...filters, page: pagination.page + 1})}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}