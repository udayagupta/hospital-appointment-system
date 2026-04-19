import React from 'react';
import { formatDate } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const DoctorSlots = ({ slots_available, doctorId }) => {

  const deleteSlot = async (date, time) => {
    if (!window.confirm("Do you wish to delete this slot ?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}/deleteSlot`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time })
      })

      if (!response.ok) {
        const data = await response.json();
        console.error(data.message);
      }

      window.location.reload();

    } catch (error) {
      console.error("Failed to delete the slot", error);

    }
  }

  return (
    <div className="bg-slate-900 p-6 h-full flex flex-col">

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 shrink-0 ">
        <h2 className="text-xl font-bold text-slate-100 flex items-center">
          <span className="text-blue-400 mr-2">🕒</span> Open Availability
        </h2>
        {/* Quick stat badge */}
        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          {slots_available?.length || 0} Slots
        </span>
      </div>

      {slots_available?.length > 0 ? (
        <div className="overflow-y-auto max-h-137.5 pr-2 custom-scrollbar flex-1">
          {/* Responsive Grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-2">

            {slots_available.map((slot, index) => (
              <li
                key={index}
                className="relative bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-slate-500 transition-all duration-200 overflow-hidden group"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-700 group-hover:bg-blue-500 transition-colors"></div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteSlot(slot.date, slot.time)}
                  aria-label="Delete slot"
                  className="absolute top-3 right-3 text-slate-600 hover:text-red-400 hover:bg-red-500/10 p-1 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex flex-col gap-3 mt-1">

                  {/* Date Section */}
                  <div className="flex items-center gap-3 border-b border-slate-700/50 pb-3">
                    <div className="bg-slate-900 p-2 rounded-lg text-xl border border-slate-700 flex items-center justify-center h-10 w-10">
                      📅
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Date</p>
                      <p className="text-sm font-bold text-slate-200">{formatDate(slot.date)}</p>
                    </div>
                  </div>

                  {/* Time & Duration Section */}
                  <div className="flex justify-between items-end pt-1">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Time</p>
                      <p className="text-base font-bold text-blue-400">{slot.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-xs font-semibold text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-700 shadow-inner">
                        {slot.duration}
                      </p>
                    </div>
                  </div>

                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center flex-1 min-h-50 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
          <span className="text-3xl mb-3">📭</span>
          <p className="text-slate-400 text-sm font-medium">No open slots available.</p>
          <p className="text-slate-500 text-sm mt-1">Use the generator in your <Link to={"/doctorProfile"} className='underline'>profile</Link> to add availability.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorSlots;