import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { getUser } from '../utils/auth';
import { dummyJobs } from '../data/dummyData';

export default function CompanyDashboard() {
  const user = getUser();
  const [jobs] = useState(dummyJobs.slice(0, 2)); // Company's jobs

  const stats = {
    activeJobs: jobs.length,
    totalApplicants: jobs.reduce((sum, job) => sum + job.applicants, 0),
    pendingReview: 5,
    interviews: 3
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Company Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Active Jobs" 
            value={stats.activeJobs} 
            color="blue"
          />
          <StatCard 
            title="Total Applicants" 
            value={stats.totalApplicants} 
            color="green"
          />
          <StatCard 
            title="Pending Review" 
            value={stats.pendingReview} 
            color="orange"
          />
          <StatCard 
            title="Interviews Scheduled" 
            value={stats.interviews} 
            color="gray"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Job Postings
            </h2>
            <Link
              to="/post-job"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Post New Job
            </Link>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {job.applicants} applicants
                    </div>
                    <Link
                      to="/manage-jobs"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View Applications
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                No job postings yet
              </div>
              <Link
                to="/post-job"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Create Your First Job
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}