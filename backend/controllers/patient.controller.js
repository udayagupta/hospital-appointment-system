const Patient = require("../models/model.patient");
const Doctor = require("../models/model.doctor");
const Appointment = require("../models/model.appointment");

exports.getPatient = async (req, res) => {
    const { patientId } = req.params;

    if (req.user.role === "patient" && req.user.id !== patientId) {
        return res.status(403).json({ message: "Access denied" });
    }

    if (!patientId) return res.status(400).json({ message: "Patient ID is required!" });

    try {
        const patient = await Patient.find({ id: patientId });
        if (!patient) return res.status(404).json({ message: "Patient not found!" });

        res.json(patient);
    } catch (error) {
        console.error("Server Error: ", error);
        res.status(500).json({ message: "Server error while fetching details of a patient!" })
    }
}