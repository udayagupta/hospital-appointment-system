import { useState } from "react";

const useUpdateAppointment = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = async (apptId, newStatus) => {
    setIsUpdating(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${apptId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setIsUpdating(false);
        return true;
      } else {
        const data = await response.json();
        setError(data.message);
        setIsUpdating(false);

      }

    } catch (error) {
      setError("Could not connect to the server");
      setIsUpdating(false);
      return false
    }
  
  };

  return { updateStatus, isUpdating, error };
};

export default useUpdateAppointment;
