import { useEffect, useState } from "react"
import { slotAvailable } from "../../utils/helpers"

const DoctorCard = ({ doctor, setSelectedSlot }) => {

  const handleSlot = (doctor, slot) => {
    setSelectedSlot({doctor: doctor, slot: slot});
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-4 border border-gray-100">

      <div className="border-b pb-3 mb-3">
        <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
        <p className="text-blue-600 font-medium">{doctor.specialization}</p>
        <p className="text-sm text-gray-500 mt-1">
          {doctor.experience} experience • {doctor.works_at}
        </p>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Available Slots:</p>

        <div className="flex flex-wrap gap-2">
          {doctor.slots_available.map((slot, index) => (
            <button
              onClick={() => handleSlot(doctor, slot)}
              key={index}
              disabled={!slotAvailable({date: slot.date, time: slot.time})}
              className={` px-3 cursor-pointer py-1 text-xs font-medium text-white bg-blue-50 rounded-md border border-blue-200   transition-colors ${slotAvailable({ date: slot.date, time: slot.time }) ? "bg-green-400 hover:bg-green-600" : "bg-red-600 cursor-not-allowed opacity-30"}`}
            >
              {slot.time} <br /> <span className="text-[10px] opacity-75">{slot.date}</span>
            </button>
          ))}
        </div>

      </div>

    </div>
  )
}

export default DoctorCard