require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const Doctor = require("./models/model.doctor");
const Patient = require("./models/model.patient");

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log("MongoDB connection Error: ", error))

// Auth Routes
app.post("/api/auth/patient/login", async (req, res) => {
    const { email, otp } = req.body;

    try {
        const patient = await Patient.findOne({ "contact_info.email": email });

        if (!patient) return res.status(404).json({ message: "Patient not found!" })
        
        const token = jwt.sign({ id: patient.id, role: "patient" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login Successful", token, user: patient })

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    };
});

app.post("/api/auth/doctor/login", async (req, res) => {
    const { doctorId, password } = req.body;

    try {
        const doctor = await Doctor.findOne({ id: doctorId });

        if (!doctor || doctor.password !== password) return res.status(401).json({ message: "Invalid ID or password" });

        const token = jwt.sign({ id: doctor.id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login Successful", token, user: doctor });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Data Routes

app.get("/api/doctors", async (req, res) => {
    try {
        const doctors = await Doctor.find().select("-password");
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/api/auth/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided, auth denied" });
        };

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user;
        if (decoded.role === "patient") {
            user = await Patient.findOne({ id: decoded.id }).select("-password")
        } else if (decoded.role === "doctor") {
            user = await Doctor.findOne({ id: decoded.id }).select("-password")
        }

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        };

        res.json(user);
    } catch (error) {
        console.error(`Token Verification Error: ${error}`);
        res.status(401).json({ message: "Invalid or expired token" })
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`))