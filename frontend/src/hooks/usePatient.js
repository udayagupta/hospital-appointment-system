import { useEffect, useState } from "react";

const usePatient = (patientId) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${patientId}`);

        if (response.ok) {
          const patientData = await response.json();
          setPatient(patientData);
          setLoading(false);
        } else {
          setError(`Patient with ID: ${patientId} was not found!`);
          setLoading(false);
        }
      } catch {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  return { patient, loading, error };
};

export default usePatient;