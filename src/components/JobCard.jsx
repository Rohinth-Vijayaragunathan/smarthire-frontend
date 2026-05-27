import React from 'react';
import { MapPin, Briefcase, DollarSign } from 'lucide-react';

export default function JobCard({ job, onApply, isApplied = false }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
          <p className="text-gray-600 text-sm">{job.company_name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          job.status === 'open' 
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {job.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{job.description}</p>

      {/* Meta Info */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase size={16} />
          <span>{job.job_type}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign size={16} />
          <span>${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}</span>
        </div>
      </div>

      {/* Skills */}
      {job.skills_list && job.skills_list.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.skills_list.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {skill.trim()}
              </span>
            ))}
            {job.skills_list.length > 3 && (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                +{job.skills_list.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Apply Button */}
      <button
        onClick={() => onApply(job.id)}
        disabled={isApplied || job.status !== 'open'}
        className={`w-full py-2 rounded-lg font-medium transition ${
          isApplied
            ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
            : job.status !== 'open'
            ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isApplied ? 'Already Applied' : job.status !== 'open' ? 'Position Closed' : 'Apply Now'}
      </button>
    </div>
  );
}