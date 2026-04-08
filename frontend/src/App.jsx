import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import PatientPortal from "./pages/PatientPortal"
import DoctorPortal from "./pages/DoctorPortal"
import { DataProvider } from "./contexts/DataContext";
import { AuthProvider } from "./contexts/AuthContext";


function App() {

  return (
    <AuthProvider>
      <DataProvider>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/patient" element={<PatientPortal />} />
            <Route path="/doctor" element={<DoctorPortal />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
        
      </DataProvider>
    </AuthProvider>
  )
}

export default App
