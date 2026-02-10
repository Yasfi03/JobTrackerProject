export default function ApplicationCard({ application }) {
    const statusColors = {
      'Applied': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Interview': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Offer': 'bg-purple-100 text-purple-800'
    };
  
    return (
      <div className="bg-white rounded-lg shadow p-6 border hover:shadow-md transition">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {application.jobTitle}
            </h3>
            <p className="text-gray-600 mt-1">{application.company}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
            {application.status}
          </span>
        </div>
  
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Applied: {new Date(application.appliedDate).toLocaleDateString()}
          </div>
          {application.matchScore && (
            <div className="text-sm">
              <span className="text-gray-600">Match: </span>
              <span className={`font-semibold ${
                application.matchScore >= 80 ? 'text-green-600' :
                application.matchScore >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {application.matchScore}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }