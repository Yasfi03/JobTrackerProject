export default function StatCard({ title, value, subtext, color = "blue" }) {
    const colorClasses = {
      blue: "text-blue-600",
      green: "text-green-600",
      orange: "text-orange-600",
      gray: "text-gray-600"
    };
  
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className={`text-3xl font-bold mt-2 ${colorClasses[color]}`}>
          {value}
        </div>
        {subtext && (
          <div className="text-xs text-gray-500 mt-1">{subtext}</div>
        )}
      </div>
    );
  }