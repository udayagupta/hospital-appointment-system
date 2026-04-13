import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useAppointments from '../hooks/useAppointments';
import PortalHeader from '../components/PortalHeader/PortalHeader';
import UpcomingAppointments from '../components/PatientPortal/UpcomingAppointments';
import BookDoctor from '../components/PatientPortal/BookDoctor';

const PatientPortal = () => {
  const { user: patientData, error: authError, loading: authLoading } = useAuth();
  const { appointments, loading: apptLoading, error: apptError } = useAppointments(patientData?.id, null); 

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold bg-slate-800 text-slate-200">Loading your medical file...</div>;
  }

  if (authError) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold bg-slate-800 text-slate-200">Something went wrong...</div>;
  }

  return (
    <div className='min-h-screen bg-slate-900'>
      <PortalHeader />
      <div>
        <div className="flex flex-col w-full">
          <UpcomingAppointments appointments={appointments} apptLoading={apptLoading} />
          <hr className='text-slate-700'/>
          <BookDoctor doctors={doctors} patientData={patientData} loadingDoctors={loadingDoctors}/>
        </div>
      </div>
    </div>
  )
}

export default PatientPortal;