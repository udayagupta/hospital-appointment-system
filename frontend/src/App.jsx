import { BrowserRouter } from "react-router-dom"
import Login from "./pages/Login"
import PatientPortal from "./pages/PatientPortal"
import DoctorPortal from "./pages/DoctorPortal"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/patient" element={<PatientPortal />}/>
        <Route path="/doctor" element={<DoctorPortal />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
