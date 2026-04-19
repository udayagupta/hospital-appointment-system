import useAuth from '../hooks/useAuth';
import PortalHeader from "../components/PortalHeader/PortalHeader";
import { formatDate } from "../utils/helpers";
import useAppointments from '../hooks/useAppointments';
// import useUpdateAppointment from '../hooks/useUpdateAppointment';
import Appointments from '../components/DoctorPortal/Appointments';
import usePatient from '../hooks/usePatient';
import { useState } from "react";
import AppointmentsStats from '../components/DoctorPortal/AppointmentsStats';
import DoctorSlots from '../components/DoctorPortal/DoctorSlots';

const DoctorPortal = () => {
  const { user: doctorData, logout, loading, error } = useAuth();
  const { appointments: appts, loading: apptLoading, error: apptError } = useAppointments(null, doctorData?.id);
  // const { updateStatus, isUpdating, updatingError } = useUpdateAppointment();
  // const [patients, setPatients] = useState({});

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold bg-slate-800 text-slate-200">Something went wrong...</div>;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold bg-slate-800 text-slate-200">Loading your medical file...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <PortalHeader />
      <div className="">
      <AppointmentsStats appointments={appts}/>
      {apptLoading ? (
        <p>Appointments Loading...</p>
      ) : (
        <Appointments appts={appts}/>
      )}
      <DoctorSlots slots_available={doctorData.slots_available} doctorId={doctorData.id}/>
      </div>
    </div>
  )
}

export default DoctorPortal;