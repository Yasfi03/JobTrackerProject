import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { jobsAPI, applicationsAPI } from '../services/api';

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
  });
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        jobsAPI.getAll(filters),
        applicationsAPI.getMyApplications(),
      ]);
      
      setJobs(jobsResponse.data);
      setMyApplications(applicationsResponse.data);
      
      // DEBUG: Log the data structure
      console.log('📋 Jobs:', jobsResponse.data);
      console.log('📝 My Applications:', applicationsResponse.data);
      console.log('🔍 Applied Job IDs:', applicationsResponse.data.map(app => app.job?.id));
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    loadData();
  };

  const hasAlreadyApplied = (jobId) => {
    const applied = myApplications.some(app => {
      // Try both app.job.id and app.jobId
      const appJobId = app.job?.id || app.jobId;
      const match = appJobId === jobId;
      
      // DEBUG
      if (match) {
        console.log(`✅ Already applied to job ${jobId}`);
      }
      
      return match;
    });
    
    return applied;
  };

  const handleApply = async (job) => {
    if (hasAlreadyApplied(job.id)) {
      alert('❌ You have already applied to this job!');
      return;
    }

    if (!window.confirm(`Apply to ${job.title}?`)) return;
    
    setApplying(job.id);
    try {
      await applicationsAPI.apply(job.id, {
        coverLetter: 'I am interested in this position and believe my skills align well with the requirements.',
      });
      alert('✅ Application submitted successfully!');
      // Reload to update applied jobs list
      await loadData();
    } catch (error) {
      console.error('Error applying:', error);
      if (error.response?.status === 409 || error.response?.status === 400) {
        alert('❌ You have already applied to this job!');
      } else {
        alert(error.response?.data?.message || 'Failed to apply. Please try again.');
      }
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Jobs</h1>
          <p className="text-gray-600 mt-2">
            Showing {jobs.length} jobs • {myApplications.length} applications
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Job title, keywords..."
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.keyword}
              onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            />
            <input
              type="text"
              placeholder="Location..."
              className="w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading jobs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => {
              const alreadyApplied = hasAlreadyApplied(job.id);
              
              return (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  {/* Job Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {job.company?.name || 'Company'}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium ml-2">
                      {job.jobType || 'Full-time'}
                    </span>
                  </div>

                  {/* Job Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {job.description}
                  </p>

                  {/* Job Details */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b">
                    <span className="flex items-center">
                      📍 {job.location}
                    </span>
                    {job.salary && (
                      <span className="flex items-center">
                        💰 {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {alreadyApplied ? (
                      <div className="flex-1 flex items-center justify-center px-4 py-2 bg-green-50 border-2 border-green-500 text-green-700 rounded-md font-medium">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Applied
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApply(job)}
                        disabled={applying === job.id}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
                      >
                        {applying === job.id ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Applying...
                          </span>
                        ) : (
                          'Apply Now'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg mb-2">No jobs found</p>
            <p className="text-gray-400 text-sm">Try different search terms or clear filters</p>
          </div>
        )}
      </main>
    </div>
  );
}