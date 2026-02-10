import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import ApplicationCard from '../components/ApplicationCard';
import { applicationAPI } from '../services/api';
import { getUser } from '../utils/auth';

export default function ApplicantDashboard() {
  const user = getUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await applicationAPI.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: applications.length,
    interview: applications.filter(a => a.status === 'Interview').length,
    underReview: applications.filter(a => a.status === 'Under Review').length,
    responseRate: applications.length > 0 
      ? Math.round((applications.filter(a => a.status !== 'Applied').length / applications.length) * 100)
      : 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">Here's your job search overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Applications" 
            value={stats.total} 
            color="blue"
          />
          <StatCard 
            title="Interviews" 
            value={stats.interview} 
            color="green"
          />
          <StatCard 
            title="Under Review" 
            value={stats.underReview} 
            color="orange"
          />
          <StatCard 
            title="Response Rate" 
            value={`${stats.responseRate}%`} 
            color="gray"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Applications
            </h2>
            <Link 
              to="/applications" 
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading applications...</div>
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.slice(0, 3).map(app => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                You haven't applied to any jobs yet
              </div>
              <Link 
                to="/jobs"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Browse Jobs
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              AI Resume Analyzer
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Get instant feedback on your resume and improve your chances of getting hired.
            </p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
              Analyze Resume (Coming Soon)
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Interview Prep Chatbot
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Practice interviews with our AI chatbot and get personalized feedback.
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700">
              Start Practice (Coming Soon)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}