const jwt = require("jsonwebtoken");
const Doctor = require("../models/model.doctor");
const Patient = require("../models/model.patient");

const EXPIRES = "3h";

const generateUniqueId = async (prefix, Model) => {
    let generatedId = "";
    let isUnique = false;
    while (!isUnique) {
        generatedId = prefix + Math.floor(10000 + Math.random() * 90000);
        const checkId = await Model.findOne({ id: generatedId });

        if (!checkId) {
            isUnique = true;
        }
    }

    return generatedId;
};


const signToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: EXPIRES }
    )
};

// POST: /api/auth/patient/login
exports.patientLogin = async (req, res) => {
    const { email, otp } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required!" });

    try {
        const patient = await Patient.findOne({ "contact_info.email": email });

        if (!patient) return res.status(404).json("Patient not found!");

        const token = signToken(patient.id, "patient");

        res.json({
            message: "Login Successful",
            token,
            user: patient
        });

    } catch (error) {
        console.error("Patient login error", error);
        res.status(500).json({ message: "Server Error" });
    }

}

// POST: /api/auth/doctor/login
exports.doctorLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and Password are required!" });

    try {
        const doctor = await Doctor.findOne({ contact_info: email });

        if (!doctor) return res.status(404).json({ message: "Doctor not found!" });

        const token = signToken(doctor.id, "doctor");

        res.json({
            message: "Login Successful",
            token,
            user: doctor
        });
    } catch (error) {
        console.error("Doctor login error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// POST: /api/auth/patient/register
exports.patientRegister = async (req, res) => {
    const { email, name, password, age, gender, city } = req.body;

    if (!name ||  !email || !password || !age || !gender || !city) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {

        const existingUser = await Patient.findOne({ "contact_info.email": email });
        if (existingUser) return res.status(400).json({ message: "Email already in use!" });
        
        const generatedId = await generateUniqueId("P-", Patient);

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
        });

        await newPatient.save();

        const token = signToken(newPatient.id, "patient");

        res.status(201).json({
            message: "Registration complete",
            token,
            user: newPatient
        })
    } catch (error) {
        console.error("Patient registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST: /api/auth/doctor/register/

exports.doctorRegister = async (req, res) => {
    const { name, email, password, specialization, experience } = req.body;

    if (!name || !email || !password || !specialization || !experience) {
        return res.status(400).json({ message: "All fields are required!" });
    };

    try {

        const existingUser = await Doctor.findOne({ contact_info: email });
        if (existingUser) return res.status(400).json({ message: "Email already in use!" });
    
        const generatedId = await generateUniqueId("D-", Doctor);

        const newDoctor = new Doctor({
            id: generatedId,
            name,
            password,
            contact_info: email,
            specialization,
            experience,
            works_at: "Hospital Appointment System",
            slots_available: [],
            current_appointment: [],
        })

        await newDoctor.save();

        const token = signToken(newDoctor.id, "doctor");

        res.status(201).json({
            message: "Doctor Registration is complete",
            token,
            user: newDoctor
        });

    } catch (error) {
        console.error("Doctor registration error:", error);
        res.status(500).json({ message: "Server error" });
  }

};


exports.getMe = async (req, res) => {
    try {

        const { id, role } = req.user;
        let user;

        if (role === "patient") {
            user = await  Patient.findOne({ id }).select("-password");
        } else if (role === "doctor") {
            user = await Doctor.findOne({ id }).select("-password");
        } else {
            return res.status(400).json({ message: "Invalid role in token" })
        }

        if (!user) return res.status(404).json({ message: "User not found!" }); 


        res.json(user);
    } catch (error) {
        console.error("getMe error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
