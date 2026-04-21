import { Link } from 'react-router-dom';

export default function JobCard({ job, onApply }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{job.company?.name || 'Company'}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          {job.jobType || 'Full-time'}
        </span>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>📍 {job.location}</span>
        {job.salary && <span>💰 {job.salary}</span>}
      </div>

      <div className="flex gap-3">
        <Link
          to={`/jobs/${job.id}`}
          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-center hover:bg-gray-200 transition"
        >
          View Details
        </Link>
        {onApply && (
          <button
            onClick={() => onApply(job)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}