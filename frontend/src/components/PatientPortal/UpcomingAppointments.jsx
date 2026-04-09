import React from 'react';
import { formatDate } from '../../utils/helpers';

const UpcomingAppointments = ({ apptLoading, appointments }) => {
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
              className="p-4 bg-slate-800 rounded-lg border border-slate-600 flex justify-between items-center transition-colors hover:border-slate-500"
            >
              <div>
                <p className="font-bold text-slate-100 text-lg">{appointment.doctorName}</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-blue-400 font-medium">🗓️ {formatDate(appointment.date)}</p>
                  <p className="text-sm text-slate-400">⏰ {appointment.time}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
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
    </div>
  )
}

export default UpcomingAppointments