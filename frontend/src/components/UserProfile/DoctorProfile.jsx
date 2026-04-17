import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { generateSlotsForDateRange } from "../../utils/helpers";
import GenerateSlotsModal from '../DoctorPortal/GenerateSlotsModal';

const DoctorProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate quick stats from the Doctor's arrays
  const openSlots = user.slots_available?.length || 0;
  const bookedAppointments = user.current_appointments?.filter(appt => appt.status === 'Scheduled').length || 0;

  const generateSlots = async () => {
    
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex justify-center">
      <div className="max-w-5xl w-full flex flex-col gap-6">
        
        {/* --- PAGE NAVIGATION & HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <button 
            onClick={() => navigate('/doctor')}
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
          
          {/* COLUMN 1: Professional Identity Card */}
          <div className="md:col-span-1 bg-slate-900 rounded-2xl border border-slate-800 shadow-md p-6 flex flex-col items-center text-center h-fit">
            <div className="h-28 w-28 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700 shadow-inner mb-4 text-5xl">
              🩺
            </div>
            <h2 className="text-2xl font-bold text-slate-100">{user.name}</h2>
            <p className="text-sm text-slate-400 font-mono mt-1 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 mb-4">
              ID: {user.id}
            </p>

            {/* Specialization Badge */}
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-lg font-bold tracking-wide uppercase text-xs mb-6">
              {user.specialization}
            </span>
            
            <div className="flex gap-3 w-full">
              <div className="flex-1 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Experience</p>
                <p className="text-lg font-bold text-slate-200">{user.experience}</p>
              </div>
            </div>
          </div>

          {/* COLUMN 2 & 3: Details & Schedule Management */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Contact & Workplace Block */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center border-b border-slate-800 pb-3">
                <span className="text-blue-400 mr-2">📋</span> Professional Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-slate-200 font-medium flex items-center gap-2">
                    <span className="text-slate-600">✉️</span> {user.contact_info || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Current Workplace</p>
                  <p className="text-slate-200 font-medium flex items-center gap-2">
                    <span className="text-slate-600">🏥</span> {user.works_at || "Hospital Appointment System"}
                  </p>
                </div>
              </div>
            </div>

            {/* Availability & Stats Block */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-100 flex items-center">
                  <span className="text-green-400 mr-2">⏱️</span> Schedule Overview
                </h3>
                
                {/* Perfect place to link our upcoming Slot Generator! */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-500 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                >
                  <span>⚙️</span> Manage Availability
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                  <p className="text-4xl font-bold text-blue-400 mb-2">{bookedAppointments}</p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Booked Patients</p>
                  <p className="text-xs text-slate-500 mt-1">Currently Scheduled</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                  <p className="text-4xl font-bold text-green-400 mb-2">{openSlots}</p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Open Slots</p>
                  <p className="text-xs text-slate-500 mt-1">Available for booking</p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {isModalOpen && <GenerateSlotsModal doctorId={user.id} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>}
    </div>
  );
}

export default DoctorProfile;