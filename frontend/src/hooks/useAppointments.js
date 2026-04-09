import { useState, useEffect } from "react";

const useAppointments = (patientId = null, doctorId = null) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let query = "http://localhost:5000/api/appointments";

        if (patientId) {
          query += `?patientId=${patientId}`;
        } else if (doctorId) {
          query += `?doctorId=${doctorId}`;
        }

        const response = await fetch(query);

        if (!response.ok) { throw new Error("Failed to fetch appointments!") };

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId || patientId) {
      fetchAppointments();
    }
  }, [patientId, doctorId]);

  return { appointments, loading, error };
};

export default useAppointments;
