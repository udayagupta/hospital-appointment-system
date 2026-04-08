// import React, { useEffect, useState } from 'react';
import { IoIosLogOut } from "react-icons/io";
import useAuth from '../hooks/useAuth';
import { FaLocationDot } from "react-icons/fa6";

const PatientPortal = () => {
  const { user: patientData, logout, error, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Loading your medical file...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Something went wrong...</div>;
  }

  return (
    <div className='min-h-screen bg-slate-800 p-8'>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {patientData.name} 👋</h1>
            <p className="text-gray-500 mt-1">Patient ID: {patientData.id} | <FaLocationDot className="inline"/> {patientData.location.city}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-md font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <IoIosLogOut />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientPortal