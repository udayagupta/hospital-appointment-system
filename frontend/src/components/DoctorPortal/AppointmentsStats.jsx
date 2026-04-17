import React from 'react';

const AppointmentsStats = ({ appointments }) => {
  const getCount = (status) => {
    return appointments?.filter((appt) => appt.status === status).length || 0;
  };

  const stats = [
    { 
      label: "Total Visits", 
      count: appointments?.length || 0, 
      icon: "📊", 
      color: "text-purple-400", 
      bg: "bg-purple-500/10", 
      border: "border-purple-500/20" 
    },
    { 
      label: "Scheduled", 
      count: getCount("Scheduled"), 
      icon: "🗓️", 
      color: "text-blue-400", 
      bg: "bg-blue-500/10", 
      border: "border-blue-500/20" 
    },
    { 
      label: "Completed", 
      count: getCount("Completed"), 
      icon: "✅", 
      color: "text-green-400", 
      bg: "bg-green-500/10", 
      border: "border-green-500/20" 
    },
    { 
      label: "Cancelled", 
      count: getCount("Cancelled"), 
      icon: "❌", 
      color: "text-red-400", 
      bg: "bg-red-500/10", 
      border: "border-red-500/20" 
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mx-6 mt-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-slate-900 p-5 rounded-xl border border-slate-700 shadow-sm flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-600"
        >
          <div className={`h-12 w-12 shrink-0 rounded-lg flex items-center justify-center text-2xl border ${stat.bg} ${stat.color} ${stat.border}`}>
            {stat.icon}
          </div>
          
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-slate-100">
              {stat.count}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentsStats;