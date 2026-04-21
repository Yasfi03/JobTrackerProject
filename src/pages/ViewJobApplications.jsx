import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { jobsAPI, applicationsAPI } from '../services/api';

export default function ViewJobApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadData();
  }, [jobId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobResponse, applicationsResponse] = await Promise.all([
        jobsAPI.getById(jobId),
        applicationsAPI.getApplicationsByJob(jobId)
      ]);
      
      setJob(jobResponse.data);
      setApplications(applicationsResponse.data);
      
      console.log('📋 Job:', jobResponse.data);
      console.log('📝 Applications:', applicationsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('You do not have permission to view this job');
        navigate('/company/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    if (!window.confirm(`Update application status to ${newStatus}?`)) return;
    
    setUpdating(applicationId);
    try {
      await applicationsAPI.updateStatus(applicationId, newStatus);
      alert(`✅ Status updated to ${newStatus}`);
      // Reload applications to reflect changes
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'REVIEWING': 'bg-blue-100 text-blue-800',
      'INTERVIEW': 'bg-purple-100 text-purple-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['PENDING', 'REVIEWING', 'INTERVIEW', 'ACCEPTED', 'REJECTED'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
            <button
              onClick={() => navigate('/company/jobs')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/company/jobs')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </button>

        {/* Job Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>📍 {job.location}</span>
                <span>💼 {job.jobType || 'Full-time'}</span>
                {job.salary && <span>💰 {job.salary}</span>}
                <span>📅 Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              job.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {job.status}
            </span>
          </div>

          {job.requirements && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Applications ({applications.length})
            </h2>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">No applications yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Applications will appear here when candidates apply
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map(application => (
                <div key={application.id} className="border rounded-lg p-6 hover:shadow-md transition">
                  {/* Applicant Info */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {application.applicant?.user?.name || 'Applicant'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {application.applicant?.user?.email}
                      </p>
                      {application.applicant?.phone && (
                        <p className="text-gray-600 text-sm">
                          📞 {application.applicant?.phone}
                        </p>
                      )}
                      {application.applicant?.location && (
                        <p className="text-gray-600 text-sm">
                          📍 {application.applicant?.location}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                      <p className="text-gray-400 text-xs mt-2">
                        Applied: {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {application.coverLetter && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Cover Letter:</h4>
                      <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
                    </div>
                  )}

                  {/* Resume Link */}
                  {application.resumeUrl && (
                    <div className="mb-4">
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Resume
                      </a>
                    </div>
                  )}

                  {/* Status Update Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <label className="text-sm font-medium text-gray-700 mr-2 flex items-center">
                      Update Status:
                    </label>
                    {getStatusOptions(application.status).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(application.id, status)}
                        disabled={updating === application.id}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                          updating === application.id 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {updating === application.id ? 'Updating...' : status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}