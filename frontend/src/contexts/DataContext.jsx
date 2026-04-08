import { createContext, useState } from "react";
import initialDoctors from "../data/doctors.json";
import initialPatients from "../data/patients.json";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [doctors, setDoctors] = useState(initialDoctors || {});
    const [patients, setPatients] = useState(initialPatients || {});

    const [appointments, setAppointments] = useState([]);

    const bookAppointment = ({ patientId, doctorId, slot, status = "pending", symptoms }) => {
        const appId = `appt_${Math.floor(Math.random() * 10000)}`;
        const timeStamp = new Date();
        
        const newAppt = {
            appId,
            patientId,
            doctorId,
            slot,
            status,
            symptoms,
            time: timeStamp
        }

        setAppointments((prev) => ([...prev, newAppt]));

        console.log(`${appId} has been added.`, newAppt);

    };

    const updateApptStatus = (appId, newStatus) => {
        setAppointments((prev) => prev.map((appointment) => {
            (appointment.appId === appId) ? { ...appointment, status: newStatus } : appointment 
        }))
    }
    

    const value = {
        doctors,
        setDoctors,
        patients,
        setPatients,
        bookAppointment,
        updateApptStatus
    }

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )


}

