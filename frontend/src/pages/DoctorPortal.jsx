import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";

const DoctorPortal = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorDetials = async () => {
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
          setDoctorData(data);
        } else {
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user", error);
      } finally {
        setLoading(false);

      }
    }

    fetchDoctorDetials()
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Loading your medical file...</div>;
  }


  return (
    <div className='min-h-screen bg-slate-800 p-8'>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {doctorData.name} 👋</h1>
            <p className="text-gray-500 mt-1">Doctor ID: {doctorData.id} | {doctorData.specialization}</p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="px-4 py-2 text-lg font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <IoIosLogOut />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorPortal