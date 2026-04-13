import React from 'react';
import { formatDate } from '../../utils/helpers';

const SelectedAppointmentModal = ({ selectedAppt, setSelectedAppt }) => {

  return (
    <PopUpModal isOpen={selectedAppt} title={`Appointment with ${selectedAppt.patientName}`} onClose={() => setSelectedAppt(null)}>
      <div className="flex gap-4">
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex-1 flex flex-col items-center justify-center text-center shadow-inner">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Date</p>
          <p className="font-bold text-slate-100 flex items-center gap-1.5">
            <span className="text-base">🗓️</span> {formatDate(selectedAppt.date)}
          </p>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex-1 flex flex-col items-center justify-center text-center shadow-inner">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Time</p>
          <p className="font-bold text-slate-100 flex items-center gap-1.5">
            <span className="text-base">⏰</span> {selectedAppt.time}
          </p>
        </div>
      </div>

      <div>

      </div>
    </PopUpModal>
  )
}

export default SelectedAppointmentModal