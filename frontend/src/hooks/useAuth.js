import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          navigate("/");
        }

      } catch (error) {
        console.error("Error fetching details", error);
        setError(error)
      } finally {
        setLoading(false);
      }

    };

    fetchUserDetails();

  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return { user, logout, loading, error }

};


export default useAuth;