import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const SignUp = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [city, setCity] = useState("");

  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = role === "patient"
      ? "http://localhost:5000/api/auth/patient/register"
      : "http://localhost:5000/api/auth/doctor/register"

    const payload = role === "patient"
      ? { name, email, password, age, gender, city }
      : { name, email, password, specialization, experience }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", role);
        alert("Account created!")
        navigate(`/${role}`);
      } else {
        switch (response.status) {
          case 400:
            setError("This email is already registered. Please try logging in instead!");
            break;
          case 401:
            setError("Unauthorized. Please check your credentials.");
            break;
          case 404:
            setError("The registration service could not be found.");
            break;
          case 500:
            setError("Our servers are currently taking a nap. Please try again later!");
            break;
          default:
            setError(`Unexpected Error (${response.status}). Please contact support.`);
        }
      }

    } catch (error) {
      console.error("Error registering", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 font-sans p-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">Create an Account</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Join our hospital appointment system</p>

        <div className="flex flex-col mb-6">
          <label className="mb-2 text-sm font-semibold text-gray-700">I am registering as a:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shared Fields */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Full Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Verma" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. rahul@mail.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Patient Specific Fields */}
          {role === "patient" && (
            <>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block mb-1 text-sm font-semibold text-gray-700">Age</label>
                  <input type="number" required value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 28" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 text-sm font-semibold text-gray-700">Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">City</label>
                <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Delhi" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {/* Doctor Specific Fields */}
          {role === "doctor" && (
            <>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Specialization</label>
                <input type="text" required value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="e.g. Cardiologist" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Years of Experience</label>
                <input type="number" required value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 10" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {error && <div className='mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium'>{error}</div>}
          <button type="submit" className="w-full py-3 mt-4 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/" className="text-blue-600 font-semibold hover:underline">Log in here</Link>
        </p>

      </div>
    </div>
  );
}

export default SignUp