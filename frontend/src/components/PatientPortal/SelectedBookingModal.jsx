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
        <div className="space-y-5">
          
          {/* Doctor Info Card with Accent Stripe */}
          <div className="relative overflow-hidden bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <div className="pl-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Provider</p>
              <p className="font-bold text-slate-100 text-lg">{selectedBooking.doctor.name}</p>
              <p className="text-sm font-medium text-blue-400 mt-0.5">{selectedBooking.doctor.specialization}</p>
            </div>
          </div>

          {/* Date & Time Widgets */}
          <div className="flex gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex-1 flex flex-col items-center justify-center text-center shadow-inner">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Date</p>
              <p className="font-bold text-slate-100 flex items-center gap-1.5">
                <span className="text-base">🗓️</span> {formatDate(selectedBooking.slot.date)}
              </p>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex-1 flex flex-col items-center justify-center text-center shadow-inner">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Time</p>
              <p className="font-bold text-slate-100 flex items-center gap-1.5">
                <span className="text-base">⏰</span> {selectedBooking.slot.time}
              </p>
            </div>
          </div>

          {/* Upgraded Button */}
          <button
            onClick={confirmAppointment}
            disabled={isBookingState}
            className="w-full mt-2 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-200 active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:border disabled:border-slate-700 disabled:shadow-none bg-blue-600 hover:bg-blue-500"
          >
            {isBookingState ? 'Confirming...' : 'Finalize Booking'}
          </button>
          
        </div>
      )}
    </PopUpModal>
  )
}

export default SelectedBookingModal;