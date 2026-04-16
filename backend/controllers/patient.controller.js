const Patient = require("../models/model.patient");
const Doctor = require("../models/model.doctor");
const Appointment = require("../models/model.appointment");

exports.getPatient = async (req, res) => {
    const { patientId } = req.params;

    if (!patientId) return res.status(400).json({ message: "Patient ID is required!" });

    try {
        const patient = await Patient.findOne({ id: patientId });
        if (!patient) return res.status(404).json({ message: "Patient not found!" });

        res.json(patient);
    } catch (error) {
        console.error("Server Error: ", error);
        res.status(500).json({ message: "Server error while fetching details of a patient!" })
    }
};

exports.updateMedicalHistory = async (req, res) => {
    const { patientId } = req.params;
    const { medicalRemark } = req.body;

    if (!patientId || !medicalRemark) return res.status(400).json({ message: "Patient ID and Medical Remark are required!" });

    try {
        const patient = await Patient.findOne({ id: patientId });
        if (!patient) return res.status(404).json({ message: "Patient not found!" });

        if (!patient.medical_history) {
            patient.medical_history = [];
        }

        patient.medical_history.push(medicalRemark);

        await patient.save();
        res.json({ message: "Medical History updated successfully!" });
        
    } catch (error) {
        console.error("Error while updating medical history:", error);
        res.status(500).json({ message: "Server error while updating medical history" });
    }
}