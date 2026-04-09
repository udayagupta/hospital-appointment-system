import { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import SelectedBookingModal from './SelectedBookingModal';

const BookDoctor = ({ loadingDoctors, doctors, patientData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBookingState, setIsBookingState] = useState(false);


  const confirmAppointment = async () => {
    if (!selectedBooking) return;
    setIsBookingState(true);

    try {
      const response = await fetch("http://localhost:5000/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientData.id,
          doctorId: selectedBooking.doctor.id,
          date: selectedBooking.slot.date,
          time: selectedBooking.slot.time
        })
      });

      if (response.ok) {
        console.log("🎉 Appointment Booked Successfully!");
        window.location.reload();
      } else {
        const data = await response.json();
        alert(`Failed to book: ${data.message}`);
      }
    } catch (error) {
      console.error("Error booking:", error);
      alert("Could not connect to the server.");
    } finally {
      setIsModalOpen(false);
      setIsBookingState(false);
    }
  };

  const handleSlotSelection = (doctor, slot) => {
    setSelectedBooking({ doctor, slot });
    setIsModalOpen(true);
  }



  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-md border border-slate-700">
      <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
        <span className="text-blue-400 mr-2">👨‍⚕️</span> Book a Doctor
      </h2>

      {loadingDoctors ? (
        <div className="flex justify-center items-center py-8 ">
          <p className="text-slate-400 animate-pulse font-medium">Loading available doctors...</p>
        </div>
      ) : doctors.length > 0 ? (
        <div className="space-y-4 max-h-100 overflow-y-auto pr-4">
          {doctors.map((doc) => (
            <div key={doc._id} className="p-5 bg-slate-800 rounded-lg border border-slate-600">
              <div className="mb-3">
                <h3 className="font-bold text-slate-100 text-lg">{doc.name}</h3>
                <p className="text-sm text-slate-400">{doc.specialization} • {doc.experience}</p>
              </div>

              {doc.slots_available && doc.slots_available.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {doc.slots_available.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSlotSelection(doc, slot)}
                      className="px-3 py-1.5 text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all active:scale-95"
                    >
                      {formatDate(slot.date)} • {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-red-400 bg-red-500/10 inline-block px-2 py-1 rounded border border-red-500/20">
                  No slots available right now
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 italic bg-slate-800 p-6 rounded-lg text-center border border-slate-700">
          No doctors are currently registered in the system.
        </p>
      )}

      <SelectedBookingModal 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen} 
        selectedBooking={selectedBooking} 
        confirmAppointment={confirmAppointment} 
        isBookingState={isBookingState} 
      />
      
    </div>
  )
}

export default BookDoctor