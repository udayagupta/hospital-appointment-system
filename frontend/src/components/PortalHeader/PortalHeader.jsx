import React from 'react'
import useAuth from '../../hooks/useAuth'
import { FaLocationDot } from 'react-icons/fa6';
import { IoIosLogOut } from 'react-icons/io';

const PortalHeader = () => {
  const { user, loading, error, logout } = useAuth();
  const userRole = localStorage.getItem("userRole");

  if (loading) {
    return (<div className="min-h-screen flex items-center justify-center text-xl font-bold bg-slate-800 text-slate-200">Loading your medical file...</div>)
  }

  if (error) {
    return (<div className="min-h-screen flex items-center justify-center text-xl font-bold bg-slate-800 text-slate-200">Something went wrong...</div>)
  }

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-md border border-slate-700 mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Welcome back, {user.name} 👋</h1>
        {
          userRole === "doctor" ? (
            <p className="text-slate-400 mt-1">
              {user.specialization} | {user.experience} | {user.works_at}
            </p>
          ) : (
            <p className="text-slate-400 mt-1 flex items-center gap-1">
              Patient ID: {user.id} <span className="mx-1 text-slate-600">|</span>
              <FaLocationDot className="text-slate-500" /> {user.location.city}
            </p>
          )
        }
      </div>
      <button
        onClick={logout}
        className="px-4 py-2 text-xl font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
      >
        <IoIosLogOut />
      </button>
    </div>
  )
}

export default PortalHeader