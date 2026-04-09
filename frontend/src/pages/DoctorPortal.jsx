import useAuth from '../hooks/useAuth';
import PortalHeader from "../components/PortalHeader/PortalHeader";

const DoctorPortal = () => {
  const { user: doctorData, logout, loading, error } = useAuth();

   if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold bg-slate-800 text-slate-200">Something went wrong...</div>;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold bg-slate-800 text-slate-200">Loading your medical file...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        
        <PortalHeader />

        <div className="grid grid-cols-1 gap-6">
          
          <div className="bg-slate-900 p-6 rounded-xl shadow-md border border-slate-700">
            <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
              <span className="text-blue-400 mr-2">🕒</span> Your Available Slots
            </h2>
            
            {doctorData.slots_available && doctorData.slots_available.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {doctorData.slots_available.map((slot, index) => (
                  <div key={index} className="p-4 bg-slate-800 rounded-lg border border-slate-600 flex flex-col items-center justify-center transition-colors hover:border-slate-500">
                    <p className="font-bold text-blue-400">{slot.date}</p>
                    <p className="text-blue-300 font-medium">{slot.time}</p>
                    <p className="text-xs text-slate-400 mt-1">{slot.duration}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic bg-slate-800 p-4 rounded-lg text-center border border-slate-700">
                You have no available slots open for booking right now.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default DoctorPortal;