require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const Doctor = require("./models/model.doctor");
const Patient = require("./models/model.patient");
const Appointment = require("./models/model.appointment");

const LOGGED_IN_EXPIRES = "3h"

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection Error: ", error));

// Auth Routes
app.post("/api/auth/patient/login", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const patient = await Patient.findOne({ "contact_info.email": email });

    if (!patient)
      return res.status(404).json({ message: "Patient not found!" });

    const token = jwt.sign({ id: patient.id, role: "patient" }, process.env.JWT_SECRET, { expiresIn: LOGGED_IN_EXPIRES });

    res.json({ message: "Login Successful", token, user: patient });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/auth/doctor/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ contact_info: email });

    if (!doctor || doctor.password !== password)
      return res.status(401).json({ message: "Invalid ID or password" });

    const token = jwt.sign({ id: doctor.id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: LOGGED_IN_EXPIRES },);

    res.json({ message: "Login Successful", token, user: doctor });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Registration Routes
app.post("/api/auth/patient/register", async (req, res) => {
  const { name, email, password, age, gender, city } = req.body;

  try {
    const existingUser = await Patient.findOne({ "contact_info.email": email });
    if (existingUser) return res.status(400).json({ message: "Email is already in user!" })

    let isUnique = false;
    let generatedId = "";
    while (!isUnique) {
      generatedId = "P-" + Math.floor(10000 + Math.random() * 90000);
      const idCheck = await Patient.findOne({ id: generatedId });
      if (!idCheck) {
        isUnique = true
      }
    }

    const newPatient = new Patient({
      id: generatedId,
      name,
      password,
      age: Number(age),
      gender,
      contact_info: { email },
      medical_history: [],
      current_appointments: [],
      location: { city, state: "Pending" }
    })

    await newPatient.save();

    const token = jwt.sign({ id: newPatient.id, role: "patient" }, process.env.JWT_SECRET, { expiresIn: LOGGED_IN_EXPIRES })
    res.json({ message: "Registration Complete", token, user: newPatient })
  
  } catch (error) {
    console.log("Patient registration error", error);
    res.status(500).json({ message: "Server error" })
  }
});

app.post("/api/auth/doctor/register", async (req, res) => {
  const { name, email, password, specialization, experience } = req.body;

 try {
    const existingUser = await Doctor.findOne({ contact_info: email });
    if (existingUser) return res.status(400).json({ message: "Email already in use!" });

    let isUnique = false;
    let generatedId = "";
    while (!isUnique) {
      generatedId = "D-" + Math.floor(10000 + Math.random() * 90000);
      const idCheck = await Doctor.findOne({ id: generatedId });
      if (!idCheck) {
        isUnique = true
      }
    }

    const newDoctor = new Doctor({
      id: generatedId,
      name: "Dr. " + name,
      password,
      specialization,
      experience: experience + " years",
      contact_info: email,
      works_at: "Hospital Appointment System",
      slots_available: []
    });

    await newDoctor.save();

    const token = jwt.sign({ id: newDoctor.id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: LOGGED_IN_EXPIRES });
    res.json({ message: "New Doctor registration is complete", token, user: newDoctor });
    
 } catch (error) {
  console.error("Error registering new doctor", error);
  res.status(500).json({ message: "Server error" });
 }
})

app.post("/api/appointments/book", async (req, res) => {
  const { patientId, doctorId, date, time, duration } = req.body;

  try {
    const doctor = await Doctor.findOne({ id: doctorId });
    const patient = await Patient.findOne({ id: patientId });

    if (!patient || !doctor) return res.status(404).json({ message: "Patient or Doctor not found!" })

    let generatedId = "";
    let isUnique = false;
    while (!isUnique) {
      generatedId = "A-" + Math.floor(10000 + Math.random() * 90000);
      const idCheck = await Appointment.findOne({ id: generatedId });
      if (!idCheck) {
        isUnique = true;
      }
    }

    const newAppt = new Appointment({
      appointmentId: generatedId,
      patientId,
      doctorId,
      patientName: patient.name,
      doctorName: doctor.name,
      date,
      time,
      status: "Scheduled",
      duration
    });
    
    await newAppt.save();

    doctor.slots_available = doctor.slots_available.filter(
      (slot) => !(slot.date === date && slot.time === time)
    );

    patient.current_appointments.push(newAppt);

    await patient.save();
    await doctor.save();

    res.json({ message: "Appointment Booked", appointment: newAppt })

  } catch (error) {
    console.error("Error while booking an appointment", error);
    res.status(500).json({ message: "Server error while booking an appointment" })
  }
})

// Patch Routes
app.patch("/api/appointments/:appointmentId/status", async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
    const appointment = await Appointment.findOne({ appointmentId });
    if (!appointment) return res.status(404).json({ message: "Appointment not found!" });
    
    if (status === "Cancelled" && appointment.status !== "Cancelled") {
      const doctor = await Doctor.findOne({ id: appointment.doctorId });

      if (doctor) {
        doctor.slots_available.push({
          date: appointment.date,
          time: appointment.time,
          duration: appointment.duration
        })

        doctor.slots_available.sort((a, b) => {
          if (a.date === b.date) return a.time.localeCompare(b.time);
          return new Date(a.date) - new Date(b.date);
        });

        await doctor.save();
      }

    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: `Appointment successfully marked as ${status}`, appointment })
  
  } catch (err) {
    console.error(`Error while updating the appointment status`, err);
    res.status(500).json({ message: "Server error while updating the appointment status" })
  }

})


// Data Routes
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/appointments", async (req, res) => {
  const { patientId, doctorId } = req.query;

  try {
    let query = {};

    if (patientId) {
      query.patientId = patientId.trim();
    }

    if (doctorId) {
      query.doctorId = doctorId.trim();
    }

    const appointments = await Appointment.find(query).sort({ date: 1, time: 1 });

    res.json(appointments);
  
  } catch (error) {
    console.error("Error fetching appointments", error);
    res.status(500).json({ message: "Server error while fetching appointments" });
  }
})

app.get("/api/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided, auth denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === "patient") {
      user = await Patient.findOne({ id: decoded.id }).select("-password");
    } else if (decoded.role === "doctor") {
      user = await Doctor.findOne({ id: decoded.id }).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(user);
  } catch (error) {
    console.error(`Token Verification Error: ${error}`);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));