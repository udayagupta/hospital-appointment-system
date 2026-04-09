import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import PopUpModal from '../PopUpModal/PopUpModal';


const UpcomingAppointments = ({ apptLoading, appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(null);

  const [cancellationFailed, setCancellationFailed] = useState(null);


  const handleSelectedAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  }

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" })
      })

      if (response.ok) {
        alert("Appointment has been cancelled!")
        window.location.reload();
      } else {
        const data = await response.json();
        setCancellationFailed(data.message);
      }
    } catch (error) {
      console.error("Error cancelling:", error)
    }
  }

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-md border border-slate-700 h-fit">
      <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
        <span className="text-green-400 mr-2">📅</span> Your Appointments
      </h2>

      {apptLoading ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-slate-400 animate-pulse font-medium">Loading your schedule...</p>
        </div>
      ) : appointments?.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((appointment, index) => (
            <div
              key={appointment._id || appointment.appointmentId || index}
              className="p-4 bg-slate-800 rounded-lg border cursor-pointer border-slate-600 flex justify-between items-center transition-colors hover:border-slate-500"
              onClick={() => handleSelectedAppointment(appointment)}
            >
              <div>
                <p className="font-bold text-slate-100 text-lg">{appointment.doctorName}</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-blue-400 font-medium">🗓️ {formatDate(appointment.date)}</p>
                  <p className="text-sm text-slate-400">⏰ {appointment.time}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${appointment.status === "Cancelled" ? "bg-red-500/10 text-red-400 border border-red-500/20" : appointment.status === "Scheduled" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
                {appointment.status || 'Scheduled'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 italic bg-slate-800 p-6 rounded-lg text-center border border-slate-700">
          You don't have any appointments booked right now.
        </p>
      )}

      <PopUpModal 
        title={`Appointment ${selectedAppointment?.appointmentId}`}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      >
        {selectedAppointment && (
          <div className="space-y-4">
            {cancellationFailed && (
              <div className='text-red-500 text-center text-lg font-semibold'>
                <p>{cancellationFailed}</p>
              </div>
            )}

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Doctor</p>
              <p className="font-bold text-slate-100">{selectedAppointment.doctorName}</p>
            </div>

            <div className="flex gap-4">
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex-1">
                <p className="text-sm text-slate-400 mb-1">Date</p>
                <p className="font-bold text-slate-100">{formatDate(selectedAppointment.date)}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex-1">
                <p className="text-sm text-slate-400 mb-1">Time</p>
                <p className="font-bold text-slate-100">{selectedAppointment.time}</p>
              </div>
            </div>

            <button
              className="w-full mt-4 py-3 rounded-lg font-bold bg-red-600 text-white hover:bg-red-500 transition-colors disabled:cursor-not-allowed!"
              disabled={selectedAppointment.status === "Cancelled" && true}
              onClick={() => handleCancelAppointment(selectedAppointment.appointmentId)}
            >
              Cancel Appointment
            </button>
          </div>
        )}

      </PopUpModal>
    </div>
  )
}

export default UpcomingAppointments