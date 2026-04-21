export default function ApplicationCard({ application }) {
  const statusColors = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'UNDER_REVIEW': 'bg-blue-100 text-blue-800',
    'INTERVIEW': 'bg-green-100 text-green-800',
    'OFFER': 'bg-purple-100 text-purple-800',
    'REJECTED': 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    'PENDING': 'Pending',
    'UNDER_REVIEW': 'Under Review',
    'INTERVIEW': 'Interview',
    'OFFER': 'Offer',
    'REJECTED': 'Rejected',
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{application.job?.title}</h4>
          <p className="text-sm text-gray-600">{application.job?.company?.name || 'Company'}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[application.status] || 'bg-gray-100 text-gray-800'}`}>
          {statusLabels[application.status] || application.status}
        </span>
      </div>

      <div className="text-sm text-gray-500 space-y-1">
        <p>📍 {application.job?.location}</p>
        <p>📅 Applied: {new Date(application.appliedAt).toLocaleDateString()}</p>
        {application.matchScore && (
          <p>🎯 Match Score: {application.matchScore}%</p>
        )}
      </div>
    </div>
  );
}