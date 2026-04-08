import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState("patient");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setStep(1);
    setIdentifier("");
    setPassword("");
    setOtp("");
  };

  const handlePatientStep1 = (e) => {
    e.preventDefault();
    if (!identifier) return;
    
    const dummyOtp = Math.floor(1000 + Math.random() * 9000);
    alert(`SIMULATED SMS: Your Patient Portal login code is ${dummyOtp}`);
    
    sessionStorage.setItem("expectedOTP", dummyOtp.toString());
    setStep(2);
  };

  const handlePatientStep2 = async (e) => {
    e.preventDefault();
    const expected = sessionStorage.getItem("expectedOTP");
    
    if (otp === expected) {
      // alert("Success! Patient logged in.");
    
      try {
        const response = await fetch("http://localhost:5000/api/auth/patient/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: identifier,
            otp: otp
          })
        })

        const data = await response.json();

        if (response.ok) {
          alert(`Success, welcome ${data.user.name}`);

          localStorage.setItem("token", data.token);
          localStorage.setItem("userRole", "patient");

          navigate("/patient");
        }
      } catch (error) {
        alert("Invlid code, try again!");
      };

    } else {
      alert("Invalid code. Please try again.");
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/doctor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: identifier,
          password: password
        })
      })

      const data = await response.json();

      if (response.ok) {
        alert(`Welcome ${data.user.name}!`);

        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", "doctor");

        navigate("/doctor");

      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("could not connect to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 font-sans p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
          {role === 'patient' ? 'Patient Portal' : 'Provider Login'}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Please sign in to continue
        </p>

        <div className="flex flex-col mb-6">
          <label htmlFor="role" className="mb-2 text-sm font-semibold text-gray-700">I am a:</label>
          <select 
            id="role" 
            value={role} 
            onChange={handleRoleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        <hr className="border-t border-gray-200 my-6" />

        {/* --- PATIENT FORM --- */}
        {role === "patient" && (
          <div>
            {step === 1 ? (
              <form onSubmit={handlePatientStep1}>
                <div className="flex flex-col mb-5">
                  <label htmlFor="identifier" className="mb-2 text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="identifier"
                    placeholder="e.g. aarav.sharma@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <button type="submit" className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white mt-2 hover:bg-blue-700 transition-colors">
                  Send Login Code
                </button>
              </form>
            ) : (
              <form onSubmit={handlePatientStep2}>
                <div className="flex flex-col mb-5">
                  <label htmlFor="otp" className="mb-2 text-sm font-semibold text-gray-700">Enter 4-Digit Code</label>
                  <input
                    type="text"
                    id="otp"
                    placeholder="XXXX"
                    maxLength="4"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors tracking-[0.5em] text-center text-lg font-bold"
                  />
                  <small className="mt-2 text-xs text-gray-500 text-center">We sent a code to {identifier}</small>
                </div>
                <button type="submit" className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white mt-2 hover:bg-blue-700 transition-colors">
                  Verify & Log In
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="w-full py-3 rounded-lg font-semibold bg-transparent text-blue-600 border border-blue-600 mt-3 hover:bg-blue-50 transition-colors"
                >
                  Back
                </button>
              </form>
            )}
          </div>
        )}

        {/* --- DOCTOR FORM --- */}
        {role === "doctor" && (
          <div>
            <form onSubmit={handleDoctorSubmit}>
              <div className="flex flex-col mb-4">
                <label htmlFor="docEmail" className="mb-2 text-sm font-semibold text-gray-700">Doctor Email</label>
                <input
                  type="email"
                  id="docEmail"
                  placeholder="e.g. example@gmail.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex flex-col mb-6">
                <label htmlFor="password" className="mb-2 text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <button type="submit" className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Log In
              </button>
            </form>
            
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;