import React from 'react'
import useAuth from '../../hooks/useAuth'
import { FaLocationDot } from 'react-icons/fa6';
import { IoIosLogOut } from 'react-icons/io';
import { FaUser } from "react-icons/fa";
import { IoFemale, IoMale } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const PortalHeader = () => {
  const { user, loading, error, logout } = useAuth();
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  if (loading) {
    return (<div className="w-full py-4 text-center font-bold bg-slate-900 border-b border-slate-700 text-slate-200">Loading your medical file...</div>)
  }

  if (error) {
    return (<div className="w-full py-4 text-center font-bold bg-slate-900 border-b border-slate-700 text-slate-200">Something went wrong...</div>)
  }

  return (
    <header className="w-full bg-slate-900 flex  border-b border-slate-700 shadow-sm ">
      <div className='py-4 pl-6 pr-2'>
        <div onClick={() => navigate(`/${localStorage.getItem("userRole")}Profile`)} className='w-16 h-16 rounded-full cursor-pointer bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shrink-0'>
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="w-full py-4 flex justify-between pl-2 pr-8 items-center">
        <div className=''>
          <h1 className="text-2xl flex items-center font-bold text-slate-100">{user.name} {userRole === "patient" && <span className='text-[17px] ml-2' title={user.gender}>{user.gender === "Female" ? <IoFemale /> : <IoMale />}</span>} </h1>
          {
            userRole === "doctor" ? (
              <p className="text-sm text-slate-400 mt-1">
                {user.specialization} | {user.experience} | {user.works_at}
              </p>
            ) : (
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                Patient ID: {user.id} <span className="mx-1 text-slate-600">|</span>
                <FaLocationDot className="text-slate-500" /> {user.location?.city || user.city}
              </p>
            )
          }
        </div>
        
        <button
          onClick={logout}
          className="px-4 py-2 text-xl font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
          title="Logout"
        >
          <IoIosLogOut />
        </button>
      </div>

    </header>
  )
}

export default PortalHeader;