import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { jobsAPI, statsAPI } from '../services/api';
import { getUser } from '../utils/auth';

export default function CompanyDashboard() {
  const user = getUser();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingReview: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsResponse, statsResponse] = await Promise.all([
        jobsAPI.getMyJobs(),
        statsAPI.getCompanyStats(),
      ]);
      
      setJobs(jobsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Company Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Active Jobs" 
            value={stats.activeJobs} 
            color="blue"
          />
          <StatCard 
            title="Total Applications" 
            value={stats.totalApplications} 
            color="green"
          />
          <StatCard 
            title="Pending Review" 
            value={stats.pendingReview} 
            color="orange"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Job Postings
            </h2>
            <Link 
              to="/company/post-job"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Post New Job
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading jobs...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.slice(0, 5).map(job => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">
                        {job.applicantsCount || 0} applicants
                      </p>
                      <Link 
                        to={`/company/jobs/${job.id}`}
                        className="text-sm text-gray-600 hover:text-blue-600"
                      >
                        View Applications →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                You haven't posted any jobs yet
              </div>
              <Link 
                to="/company/post-job"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Post Your First Job
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}