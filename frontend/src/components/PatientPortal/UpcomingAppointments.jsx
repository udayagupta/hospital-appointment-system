import { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import PopUpModal from '../PopUpModal/PopUpModal';

const UpcomingAppointments = ({ apptLoading, appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancellationFailed, setCancellationFailed] = useState(null);

  const [activeTab, setActiveTab] = useState("upcoming");

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

  const upcomingAppts = appointments?.filter(appt => appt.status === "Scheduled") || [];
  const pastAppts = appointments?.filter(appt => appt.status !== "Scheduled") || [];
  
  const displayedAppointments = activeTab === "upcoming" ? upcomingAppts : pastAppts;

  return (
    <div className="bg-slate-900 p-6  h-full flex flex-col">
      <div className="flex justify-between items-center mb-5 shrink-0">
        <h2 className="text-xl font-bold text-slate-100 flex items-center">
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

      {apptLoading ? (
        <div className="flex justify-center items-center py-8 flex-1">
          <p className="text-slate-400 animate-pulse font-medium">Loading your schedule...</p>
        </div>
      ) : displayedAppointments?.length > 0 ? (
        <div className="space-y-4 p-2 overflow-y-auto max-h-[550px] custom-scrollbar flex-1">
          {displayedAppointments.map((appointment, index) => {
            const isCancelled = appointment.status === "Cancelled";
            const isScheduled = appointment.status === "Scheduled";
            
            return (
            <div
              key={appointment._id || appointment.appointmentId || index}
              onClick={() => handleSelectedAppointment(appointment)}
              className={`relative overflow-hidden p-5 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                isCancelled 
                ? "bg-slate-800/30 border-slate-700/50 grayscale-[20%]" 
                : "bg-slate-800 border-slate-700 shadow-sm hover:shadow-md hover:border-slate-500 hover:bg-slate-800/80"
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                isCancelled ? 'bg-red-500/30' : isScheduled ? 'bg-blue-500' : 'bg-green-500'
              }`}></div>

              <div className="pl-3 flex justify-between items-center">
                <div>
                  <p className={`font-bold text-lg ${isCancelled ? "text-slate-500 line-through decoration-slate-600" : "text-slate-100"}`}>
                    {appointment.doctorName}
                  </p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <p className={`text-sm font-medium flex items-center gap-1.5 ${isCancelled ? "text-slate-500" : "text-blue-400"}`}>
                      <span className="text-base">🗓️</span> {formatDate(appointment.date)}
                    </p>
                    <p className={`text-sm flex items-center gap-1.5 ${isCancelled ? "text-slate-600" : "text-slate-400"}`}>
                      <span className="text-base">⏰</span> {appointment.time}
                    </p>
                  </div>
                </div>
                
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm ${
                  isCancelled 
                  ? "bg-slate-800 text-slate-500 border border-slate-700" 
                  : isScheduled 
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                  : "bg-green-500/10 text-green-400 border border-green-500/20"
                }`}>
                  {appointment.status || 'Scheduled'}
                </span>
              </div>
            </div>
          )})}
        </div>
      ) : (
        <p className="text-slate-400 italic bg-slate-800 p-6 rounded-xl text-center border border-slate-700 flex-1 flex flex-col justify-center items-center h-full min-h-[200px]">
          {activeTab === 'upcoming' 
            ? "You don't have any upcoming appointments." 
            : "You don't have any past appointment history."}
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
              <div className='bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-400 text-center text-sm font-semibold'>
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
              className="w-full mt-4 py-3 rounded-lg font-bold text-white transition-all active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:border disabled:border-slate-700 bg-red-600 hover:bg-red-500 shadow-md"
              disabled={selectedAppointment.status === "Cancelled"}
              onClick={() => handleCancelAppointment(selectedAppointment.appointmentId)}
            >
              {selectedAppointment.status === "Cancelled" ? "Already Cancelled" : "Cancel Appointment"}
            </button>
          </div>
        )}
      </PopUpModal>
    </div>
  )
}

export default UpcomingAppointments;