import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/helpers';
import SelectedAppointmentModal from './SelectedAppointmentModal';

const Appointments = ({ appts }) => {
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [patients, setPatients] = useState({});
  const [isFetchingPatient, setIsFetchingPatient] = useState(false);

  const [activeTab, setActiveTab] = useState("upcoming");

  const handleSelectedAppointment = async (appt) => {
    const pId = appt.patientId;

    setSelectedAppt({ appt, patient: null });

    if (patients[pId]) {
      setSelectedAppt({ appt, patient: patients[pId] });
      return;
    }

    setIsFetchingPatient(true);

    try {
      const response = await fetch(`http://localhost:5000/api/patients/${pId}`);
      if (!response.ok) throw new Error("Patient not found!");

      const patientData = await response.json();

      setPatients((prev) => ({ ...prev, [pId]: patientData }));
      setSelectedAppt({ appt, patient: patientData });

    } catch (error) {
      console.error('Server Error');
      alert("Could not connect to server");
      setSelectedAppt(null);
    } finally {
      setIsFetchingPatient(false);
    }
  }
  
  const upcomingAppts = appts?.filter(appt => appt.status === "Scheduled") || [];
  const pastAppts = appts?.filter(appt => appt.status !== "Scheduled") || [];
  
  const displayedAppointments = activeTab === "upcoming" ? upcomingAppts : pastAppts;

  return (
    <div className='bg-slate-900 p-6 h-full flex flex-col'>
      <div className='flex justify-between items-center mb-5 shrink-0'>
        <h2 className="text-xl font-bold  text-slate-100 flex justify-center  items-center shrink-0">
          <span className="text-green-400 mr-2">📅</span> Your Appointments
        </h2>
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all duration-200 ${
              activeTab === 'upcoming' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all duration-200 ${
              activeTab === 'past' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            History
          </button>
        </div>

      </div>

      {displayedAppointments?.length === 0 ? (
        <p className="text-slate-400 italic bg-slate-800 p-6 rounded-xl text-center border border-slate-700 flex-1">
          No current appointments
        </p>
      ) : (
        <ul className='space-y-4 overflow-y-auto max-h-137.5 py-2 custom-scrollbar flex-1'>
          {displayedAppointments?.map((appt) => (
            <li
              key={appt._id}
              onClick={() => handleSelectedAppointment(appt)}
              className={`relative text-white overflow-hidden p-5 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${appt.status === 'Cancelled'
                  ? 'bg-slate-800/30 border-slate-700/50 grayscale-20'
                  : 'bg-slate-800 border-slate-700 shadow-sm hover:shadow-md hover:border-slate-500 hover:bg-slate-800/80'
                }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${appt.status === 'Cancelled' ? 'bg-red-500/30' : appt.status === 'Scheduled' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>

              <div className='pl-3 flex justify-between items-center'>
                <div>
                  <p className={`font-bold text-lg ${appt.status === 'Cancelled' ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                    {appt.patientName}
                  </p>

                  <div className="flex items-center gap-4 mt-1.5">
                    <p className={`text-sm font-medium flex items-center gap-1.5 ${appt.status === 'Cancelled' ? 'text-slate-500' : 'text-blue-400'}`}>
                      <span className="text-base">🗓️</span> {formatDate(appt.date)}
                    </p>

                    <p className={`text-sm flex items-center gap-1.5 ${appt.status === 'Cancelled' ? 'text-slate-600' : 'text-slate-400'}`}>
                      <span className="text-base">⏰</span> {appt.time} <span className="opacity-75 text-xs">({appt.duration})</span>
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm ${appt.status === 'Cancelled'
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : appt.status === 'Scheduled'
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-green-500/10 text-green-400 border border-green-500/20"
                  }`}>
                  {appt.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SelectedAppointmentModal 
        selectedAppt={selectedAppt} 
        setSelectedAppt={setSelectedAppt} 
        isFetchingPatient={isFetchingPatient} 
      />
    </div>
  )
}

export default Appointments;