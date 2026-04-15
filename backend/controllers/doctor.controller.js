const Doctor = require("../models/model.doctor");
const Patient = require("../models/model.patient");
const Appointment = require("../models/model.appointment");

exports.getDoctor = async (req, res) => {
    const { doctorId } = req.params;

    if (!doctorId) return res.status(400).json({ message: "Doctor Id is required!" })

    try {
        const doctor = await Doctor.findOne({ id: doctorId });
        if (!doctor) return res.status(404).json({ message: "Doctor not found!" });

        res.json(doctor);
    } catch (error) {
        console.error("Error fetching Doctor:", error);
        res.status(500).json({ message: "Server error while fetching doctor's details" });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select("-password");
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching doctors" })
    }
};