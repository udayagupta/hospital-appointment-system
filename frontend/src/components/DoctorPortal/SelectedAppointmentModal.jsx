import React, { useState } from 'react';
import PopUpModal from '../PopUpModal/PopUpModal';
import { formatDate } from '../../utils/helpers';
import useUpdateAppointment from '../../hooks/useUpdateAppointment';

const SelectedAppointmentModal = ({ selectedAppt, setSelectedAppt, isFetchingPatient }) => {
  const { updateStatus, isUpdating } = useUpdateAppointment();
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [completionRemark, setCompletionRemark] = useState("");
  const [error, setError] = useState(null);

  const handleApptStatus = async (newStatus) => {
    const success = await updateStatus(selectedAppt.appt.appointmentId, newStatus);
    if (success) {
      window.location.reload();
    } else {
      setError("Could not update appointment, try again!")
    }
  };

  const handleComplete = () => {
    setIsCompletionModalOpen(true);
  }

  const handleConfirmComplete = async () => {
    if (!completionRemark) return alert('Please enter a remark!');

    try {
      const response = await fetch(`http://localhost:5000/api/patients/${selectedAppt.appt.patientId}/updateRecords`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicalRemark: completionRemark })
      })

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      handleApptStatus("Completed");

    } catch (error) {
      console.error("Server error while updating medical records", error);
    }
  }

  if (!selectedAppt) return null;

  return (
    <PopUpModal
      isOpen={!!selectedAppt}
      title={`Appointment with ${selectedAppt.appt.patientName}`}
      onClose={() => { setSelectedAppt(null); setIsCompletionModalOpen(false) }}
    >
      <div className="space-y-4">

        {/* DATE & TIME */}
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

        {/* PATIENT DETAILS & LOADER */}
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
                  <span className="text-sm text-slate-300 bg-slate-800 px-2 py-0.5 rounded ">ID: {selectedAppt.patient.id}</span>
                  <span className="text-sm text-slate-300 bg-slate-800 px-2 py-0.5 rounded ">{selectedAppt.patient.age} yrs • <span className="capitalize">{selectedAppt.patient.gender}</span></span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-500 text-sm italic">Failed to load patient data.</p>
          )}
        </div>

        {isCompletionModalOpen && (
          <div>
            <div className='flex items-center justify-between'>
              <label htmlFor='completionNote' className='text-white'>Completion Remark</label>
              <button
                onClick={() => setIsCompletionModalOpen(false)}
                className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-500/10"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

            </div>
            <input
              type="text"
              name="completionNote"
              id="completionNote"
              placeholder='e.g. sinus'
              value={completionRemark}
              onChange={(e) => setCompletionRemark(e.target.value)}
              className='bg-slate-800 mt-2 placeholder:text-lg relative text-white active:outline-none border-1 border-transparent focus:outline-none focus:border-white  w-full rounded-md p-4'
            />
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className=''>
          {isCompletionModalOpen ? (
            <div>
              <button 
                onClick={handleConfirmComplete}
                className='bg-green-600 text-white w-full rounded-lg p-3 font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-green-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 disabled:hover:shadow-sm disabled:hover:bg-green-600'
              >
                {isUpdating
                  ? "Updating..."
                  : selectedAppt.appt.status === "Completed"
                    ? "Already Completed"
                    : "Confirm & Complete"
                }
              </button>
            </div>
          ) : (
            <div className='flex gap-3 mt-6'>
              <button
                onClick={() => handleComplete()}
                disabled={isUpdating || selectedAppt.appt.status === "Completed" || selectedAppt.appt.status === "Cancelled"}
                title='Mark Completed'
                className='bg-green-600 text-white flex-1 rounded-lg p-3 font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-green-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 disabled:hover:shadow-sm disabled:hover:bg-green-600'
              >
                {isUpdating
                  ? "Updating..."
                  : selectedAppt.appt.status === "Completed"
                    ? "Already Completed"
                    : "Complete Appointment"
                }
              </button>

              <button
                onClick={() => handleApptStatus("Cancelled")}
                disabled={isUpdating || selectedAppt.appt.status === "Cancelled" || selectedAppt.appt.status === "Completed"}
                title='Mark Cancelled'
                className='bg-red-500 text-white flex-1 rounded-lg p-3 font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-red-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 disabled:hover:shadow-sm disabled:hover:bg-red-500'
              >
                {isUpdating
                  ? "Updating..."
                  : selectedAppt.appt.status === "Cancelled"
                    ? "Already Cancelled"
                    : "Cancel Appointment"
                }
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center font-medium'>
            {error}
          </div>
        )}
      </div>
    </PopUpModal>
  );
}

export default SelectedAppointmentModal;