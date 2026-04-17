import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PatientProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Defensive loading check just in case the auth state is still resolving
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex justify-center">
      <div className="max-w-5xl w-full flex flex-col gap-6">
        
        {/* --- PAGE NAVIGATION & HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <button 
            onClick={() => navigate('/patient')}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors font-medium group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span> 
            Back to Dashboard
          </button>
          
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-bold hover:bg-red-500/20 hover:border-red-500/40 transition-all active:scale-95"
          >
            Log Out
          </button>
        </div>

        {/* --- MAIN PROFILE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* COLUMN 1: Identity Card (Takes up 1 column on desktop) */}
          <div className="md:col-span-1 bg-slate-900 rounded-2xl border border-slate-800 shadow-md p-6 flex flex-col items-center text-center h-fit">
            <div className="h-28 w-28 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700 shadow-inner mb-4 text-5xl">
              👤
            </div>
            <h2 className="text-2xl font-bold text-slate-100">{user.name}</h2>
            <p className="text-sm text-slate-400 font-mono mt-1 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              ID: {user.id}
            </p>
            
            <div className="flex gap-3 mt-6 w-full">
              <div className="flex-1 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Age</p>
                <p className="text-lg font-bold text-slate-200">{user.age}</p>
              </div>
              <div className="flex-1 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Gender</p>
                <p className="text-lg font-bold text-slate-200 capitalize">{user.gender}</p>
              </div>
            </div>
          </div>

          {/* COLUMN 2 & 3: Details & Medical History (Takes up 2 columns on desktop) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Contact & Location Block */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center border-b border-slate-800 pb-3">
                <span className="text-blue-400 mr-2">📋</span> Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-slate-200 font-medium flex items-center gap-2">
                    <span className="text-slate-600">✉️</span> {user.contact_info?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Location</p>
                  <p className="text-slate-200 font-medium flex items-center gap-2">
                    <span className="text-slate-600">📍</span> {user.location?.city}, {user.location?.state}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical History Block */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md p-6 flex-1">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-100 flex items-center">
                  <span className="text-red-400 mr-2">❤️‍🩹</span> Medical History
                </h3>
              </div>
              
              {user.medical_history && user.medical_history.length > 0 ? (
                <ul className="space-y-3">
                  {user.medical_history.map((record, index) => (
                    <li 
                      key={index} 
                      className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex items-center gap-3 transition-colors hover:bg-slate-800"
                    >
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)] shrink-0"></div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {record}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-32 flex flex-col items-center justify-center text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                  <span className="text-3xl mb-2 opacity-50">📁</span>
                  <p className="text-slate-500 text-sm italic">No medical history records found.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default PatientProfile;