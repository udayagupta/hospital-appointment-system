import { formatDate } from "../../utils/helpers"

const DoctorCard = ({ doc, handleSlotSelection }) => {

  return (
    <div key={doc._id} className="bg-slate-800 rounded-xl flex items-center border border-slate-700 overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-slate-600 group">

      <div className="p-5 w-[20%]">
        <h3 className="font-bold text-slate-100 truncate text-lg group-hover:text-blue-400 transition-colors">{doc.name}</h3>
        <p className="text-sm text-slate-400 mt-1">{doc.specialization} <span className="mx-2 text-slate-600">•</span> {doc.experience}</p>
      </div>

      <div className="bg-slate-900/50 p-5 border-t border-slate-700/50 w-full">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Available Slots</p>

        {doc.slots_available && doc.slots_available.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {doc.slots_available.map((slot, idx) => (
              <button
                key={idx}
                onClick={() => handleSlotSelection(doc, slot)}
                className="flex gap-5 items-center justify-center px-4 py-2 min-w-[90px] bg-slate-800 border border-slate-600 rounded-lg hover:bg-blue-600 hover:border-blue-500 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 group/btn shadow-sm"
              >
                <span className="text-sm font-bold text-slate-200 group-hover/btn:text-white">{slot.time}</span>
                <span className="text-sm text-slate-400 group-hover/btn:text-blue-100 mt-0.5">{formatDate(slot.date)}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-red-400 bg-red-500/10 inline-block px-3 py-1.5 rounded-md border border-red-500/20 font-medium">
            No slots available right now
          </p>
        )}
      </div>

    </div>
  )
}

export default DoctorCard