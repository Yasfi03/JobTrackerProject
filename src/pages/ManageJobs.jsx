import { useState } from 'react';
import Navbar from '../components/Navbar';
import { dummyJobs } from '../data/dummyData';

export default function ManageJobs() {
  const [jobs] = useState(dummyJobs.slice(0, 2));
  const [selectedJob, setSelectedJob] = useState(null);

  const mockApplicants = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', status: 'Under Review', matchScore: 85 },
    { id: 2, name: 'Mike Chen', email: 'mike@email.com', status: 'Interview', matchScore: 78 },
    { id: 3, name: 'Emily Davis', email: 'emily@email.com', status: 'Applied', matchScore: 92 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
          <p className="text-gray-600 mt-1">
            Review applications and manage your job postings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">Your Jobs</h2>
              </div>
              <div className="divide-y">
                {jobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                      selectedJob?.id === job.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {job.applicants} applicants
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedJob ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedJob.title}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedJob.applicants} applicants</p>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Applicants</h3>
                  <div className="space-y-4">
                    {mockApplicants.map(applicant => (
                      <div key={applicant.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{applicant.name}</div>
                            <div className="text-sm text-gray-600">{applicant.email}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            applicant.status === 'Interview' ? 'bg-green-100 text-green-800' :
                            applicant.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {applicant.status}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-600">Match Score: </span>
                            <span className="font-semibold text-green-600">
                              {applicant.matchScore}%
                            </span>
                          </div>
                          <div className="space-x-2">
                            <button className="text-blue-600 hover:underline text-sm">
                              View Resume
                            </button>
                            <button className="text-green-600 hover:underline text-sm">
                              Schedule Interview
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-500">
                  Select a job to view applicants
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}