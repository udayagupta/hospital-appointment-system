import React from 'react';
import PopUpModal from "../PopUpModal/PopUpModal";
import { formatDate } from '../../utils/helpers';

const SelectedBookingModal = ({ isModalOpen, setIsModalOpen, selectedBooking, confirmAppointment, isBookingState }) => {
  return (
    <PopUpModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Confirm Appointment"
    >
      {selectedBooking && (
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400 mb-1">Doctor</p>
            <p className="font-bold text-slate-100">{selectedBooking.doctor.name}</p>
            <p className="text-sm text-blue-400">{selectedBooking.doctor.specialization}</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex-1">
              <p className="text-sm text-slate-400 mb-1">Date</p>
              <p className="font-bold text-slate-100">{formatDate(selectedBooking.slot.date)}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex-1">
              <p className="text-sm text-slate-400 mb-1">Time</p>
              <p className="font-bold text-slate-100">{selectedBooking.slot.time}</p>
            </div>
          </div>

          <button
            onClick={confirmAppointment}
            disabled={isBookingState}
            className="w-full mt-4 py-3 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:bg-blue-800 disabled:text-blue-300"
          >
            {isBookingState ? 'Confirming...' : 'Finalize Booking'}
          </button>
        </div>
      )}
    </PopUpModal>
  )
}

export default SelectedBookingModal