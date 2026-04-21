import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { applicationsAPI, aiAPI } from '../services/api';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [calculatingMatch, setCalculatingMatch] = useState(null);
  const [expandedApp, setExpandedApp] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await applicationsAPI.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateMatch = async (applicationId) => {
    setCalculatingMatch(applicationId);
    try {
      await aiAPI.matchJob(applicationId);
      alert('✅ Match score calculated successfully!');
      loadApplications(); // Reload to show updated score
    } catch (error) {
      console.error('Error calculating match:', error);
      alert('❌ Failed to calculate match score. Please try again.');
    } finally {
      setCalculatingMatch(null);
    }
  };

  const filteredApplications = filter === 'ALL' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const statusColors = {
    'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'UNDER_REVIEW': 'bg-blue-100 text-blue-800 border-blue-300',
    'INTERVIEW': 'bg-green-100 text-green-800 border-green-300',
    'OFFER': 'bg-purple-100 text-purple-800 border-purple-300',
    'REJECTED': 'bg-red-100 text-red-800 border-red-300',
  };

  const statusLabels = {
    'PENDING': 'Pending',
    'UNDER_REVIEW': 'Under Review',
    'INTERVIEW': 'Interview',
    'OFFER': 'Offer',
    'REJECTED': 'Rejected',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

        {/* Filter Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'PENDING', 'UNDER_REVIEW', 'INTERVIEW', 'OFFER', 'REJECTED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.replace('_', ' ')}
                {status !== 'ALL' && (
                  <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                    {applications.filter(a => a.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading applications...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map(app => (
              <div 
                key={app.id} 
                className="bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                {/* Main Application Card */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{app.job?.title}</h3>
                      <p className="text-gray-600 mt-1">{app.job?.company?.name || 'Company'}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[app.status] || 'bg-gray-100 text-gray-800'}`}>
                      {statusLabels[app.status] || app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">📍 Location:</span> {app.job?.location}
                    </div>
                    <div>
                      <span className="font-medium">📅 Applied:</span> {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">💼 Type:</span> {app.job?.jobType || 'Full-time'}
                    </div>
                    <div>
                      {app.matchScore ? (
                        <div className="flex items-center">
                          <span className="font-medium">🎯 Match:</span>
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            {app.matchScore}%
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCalculateMatch(app.id)}
                          disabled={calculatingMatch === app.id}
                          className="text-blue-600 hover:text-blue-700 font-medium text-xs underline disabled:text-gray-400"
                        >
                          {calculatingMatch === app.id ? 'Calculating...' : '🎯 Calculate Match'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expand/Collapse Details */}
                  <button
                    onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {expandedApp === app.id ? '▼ Hide Details' : '▶ Show Details'}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedApp === app.id && (
                  <div className="border-t bg-gray-50 p-6 space-y-4">
                    {/* Cover Letter */}
                    {app.coverLetter && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">📝 Cover Letter</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-md border">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}

                    {/* Job Description */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">📋 Job Description</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-md border">
                        {app.job?.description}
                      </p>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">✅ Requirements</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-md border">
                        {app.job?.requirements}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      {!app.matchScore && (
                        <button
                          onClick={() => handleCalculateMatch(app.id)}
                          disabled={calculatingMatch === app.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition text-sm font-medium"
                        >
                          {calculatingMatch === app.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Calculating Match...
                            </span>
                          ) : (
                            '🎯 Calculate AI Match Score'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredApplications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">No applications found.</p>
            <p className="text-gray-400 text-sm mt-2">
              {filter === 'ALL' 
                ? "You haven't applied to any jobs yet." 
                : `No applications with status: ${filter.replace('_', ' ')}`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}