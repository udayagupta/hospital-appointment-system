import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import PopUpModal from '../PopUpModal/PopUpModal';
import useUpdateAppointment from '../../hooks/useUpdateAppointment';

const Appointments = ({ appts }) => {
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [patients, setPatients] = useState({});

  const [isFetchingPatient, setIsFetchingPatient] = useState(false);
  const { updateStatus, isUpdating, error } = useUpdateAppointment();

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

  const handleApptStatus = (newStatus) => {
    const success = updateStatus(selectedAppt.appt.appointmentId, newStatus);
    if (success) {
      window.location.reload();
    } else {
      alert(`Could not complete the operation`)
    }
  }

  return (
    <div className='bg-slate-900  p-6 h-full flex flex-col'>
      <h2 className="text-xl font-bold mb-5 text-slate-100 flex items-center shrink-0">
        <span className="text-green-400 mr-2">📅</span> Your Appointments
      </h2>
      
      {appts?.length === 0 ? (
        <p className="text-slate-400 italic bg-slate-800 p-6 rounded-xl text-center border border-slate-700 flex-1">
          No current appointments
        </p>
      ) : (
        <ul className='space-y-4 overflow-y-auto max-h-[550px] py-2 custom-scrollbar flex-1'>
          {appts?.map((appt) => (
            <li
              key={appt._id}
              onClick={() => handleSelectedAppointment(appt)}
              className={`relative text-white overflow-hidden p-5 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                appt.status === 'Cancelled'
                ? 'bg-slate-800/30 border-slate-700/50 grayscale-[20%]'
                : 'bg-slate-800 border-slate-700 shadow-sm hover:shadow-md hover:border-slate-500 hover:bg-slate-800/80'
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                appt.status === 'Cancelled' ? 'bg-red-500/30' : appt.status === 'Scheduled' ? 'bg-blue-500' : 'bg-green-500'
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

                <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm ${
                  appt.status === 'Cancelled'
                  ? "bg-slate-800 text-slate-500 border border-slate-700"
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

      {selectedAppt && (
        <PopUpModal isOpen={!!selectedAppt} title={`Appointment with ${selectedAppt.appt.patientName}`} onClose={() => setSelectedAppt(null)}>
          <div className="space-y-4">
            
            <div className="flex gap-4">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex-1 flex flex-col items-center justify-center text-center shadow-inner">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Date</p>
                <p className="font-bold text-slate-100 flex items-center gap-1.5">
                  <span className="text-base">🗓️</span> {formatDate(selectedAppt.appt.date)}
                </p>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex-1 flex flex-col items-center justify-center text-center shadow-inner">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Time</p>
                <p className="font-bold text-slate-100 flex items-center gap-1.5">
                  <span className="text-base">⏰</span> {selectedAppt.appt.time}
                </p>
              </div>
            </div>

            <div className="bg-slate-80 p-5 rounded-xl border border-slate-700 min-h-[140px] flex flex-col justify-center relative overflow-hidden">
              {isFetchingPatient ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">Retrieving Medical File...</p>
                </div>
              ) : selectedAppt.patient ? (
                <div className="animate-in fade-in duration-300">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                  <div className="pl-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Patient Profile</p>
                    <p className="text-lg font-bold text-slate-100">{selectedAppt.patient.name}</p>
                    <div className="flex gap-3 mt-1.5">
                       <span className="text-sm text-slate-300  bg-slate-800 px-2 py-0.5 rounded ">ID: {selectedAppt.patient.id}</span>
                       <span className="text-sm text-slate-300  bg-slate-800 px-2 py-0.5 rounded ">{selectedAppt.patient.age} yrs • <span className="capitalize">{selectedAppt.patient.gender}</span></span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-slate-500 text-sm italic">Failed to load patient data.</p>
              )}
            </div>

            <div className='flex gap-2'>
              <button onClick={() => handleApptStatus("Completed")} title='Mark Completed' className='bg-green-500 flex-1 rounded-md p-2 font-semibold hover:-translate-y-0.5 transition duration-300 active:scale-90'>
                {isUpdating ? "Updating..." : selectedAppt.status === "Completed" ? "Already Completed" : "Complete Appointment"}
              </button>
              <button onClick={() => handleApptStatus("Cancelled")} title='Mark Cancelled' className='bg-red-400 flex-1 rounded-md p-2 font-semibold hover:-translate-y-0.5 transition duration-300 active:scale-90'>
                {isUpdating ? "Updating..." : selectedAppt.status === "Cancelled" ? "Already Canclled" : "Cancel Appointment"}
              </button>
            </div>

          </div>
        </PopUpModal>
      )}
    </div>
  )
}

export default Appointments;