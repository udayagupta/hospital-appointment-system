import { useState } from 'react';
import SelectedBookingModal from './SelectedBookingModal';
import DoctorCard from '../DoctorCard/DoctorCard';

const BookDoctor = ({ loadingDoctors, doctors, patientData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBookingState, setIsBookingState] = useState(false);
  const [selectedDocCategory, setSelectedDocCategory] = useState("All");


  const confirmAppointment = async () => {
    if (!selectedBooking) return;
    setIsBookingState(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          patientId: patientData.id,
          doctorId: selectedBooking.doctor.id,
          date: selectedBooking.slot.date,
          time: selectedBooking.slot.time,
          duration: selectedBooking.slot.duration || "30 mins"
        })
      });

      if (response.ok) {
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

  const uniqueSpecializations = [...new Set(doctors.map((doc) => doc.specialization))];

  const filteredDoctors = doctors.filter((doc) => {
    if (selectedDocCategory !== "All") {
      return doc.specialization === selectedDocCategory;
    }
    return true;
  });

  return (
    <div className="bg-slate-900 p-6 h-full flex flex-col">
      <div className='flex justify-between'>
        <h2 className="text-xl font-bold text-slate-100 mb-5 flex items-center shrink-0">
          <span className="text-blue-400 mr-2">👨‍⚕️</span> Book a Doctor
        </h2>

        <select
          name="doc-category"
          id="doc-category"
          value={selectedDocCategory}
          onChange={(e) => setSelectedDocCategory(e.target.value)}
          className='px-4 h-[55px] mb-5 rounded-md text-sm font-semibold bg-slate-800 cursor-pointer border border-slate-700 text-slate-200 outline-none focus:border-blue-500 transition-colors'
        >
          <option value="All">All Specializations</option>

          {uniqueSpecializations.map((spec) => (
            <option key={spec} value={spec} className='bg-slate-800 text-slate-200'>
              {spec}
            </option>
          ))}
        </select>

      </div>


      {loadingDoctors ? (
        <div className="flex justify-center items-center py-8 flex-1">
          <p className="text-slate-400 animate-pulse font-medium">Loading available doctors...</p>
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="space-y-5 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar flex-1">
          {filteredDoctors.map((doc) => (
            <DoctorCard doc={doc} handleSlotSelection={handleSlotSelection} />
          ))}
        </div>
      ) : (
        <p className="text-slate-400 italic bg-slate-800 p-6 rounded-xl text-center border border-slate-700 flex-1">
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

export default BookDoctor;