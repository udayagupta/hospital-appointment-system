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

exports.generateSlots = async (req, res) => {
    const { doctorId } = req.params;
    const { slots } = req.body;

    if (!doctorId) return res.status(400).json({ message: "Doctor Id is required!" });

    if (!slots || slots.length === 0) {
        return res.status(400).json({ message: "No slots provided" });
    }

    try {
        const doctor = await Doctor.findOne({ id: doctorId });
        if (!doctor) res.status(404).json({ message: "Doctor not found!" });

        doctor.slots_available.push(...slots);

        doctor.slots_available.sort((a, b) => {
            if (a.date === b.date) return a.time.localeCompare(b.time);
            return new Date(a.date) - new Date(b.date);
        });

        await doctor.save();

        res.json({ message: "Slots generated successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while generating slots for doctor" })
    }
};

exports.deleteSlot = async (req, res) => {
    const { doctorId } = req.params;
    const { date, time } = req.body;

    if (!doctorId) return res.status(400).json({ message: "Doctor ID is required!" });
    if (!date || !time) return res.status(400).json({ message: "Date and time are required!" });

    try {
        const doctor = await Doctor.findOne({ id: doctorId });
        if (!doctor) return res.status(404).json({ message: "Doctor not found!" });

        const slotExists = doctor.slots_available.some(
            (slot) => slot.date === date && slot.time === time
        );

        if (!slotExists) return res.status(404).json({ message: "Slot not found!" });

        doctor.slots_available = doctor.slots_available.filter(
            (slot) => !(slot.date === date && slot.time === time)
        );

        await doctor.save();

        res.json({ message: "Slot deleted successfully" });

    } catch (error) {
        console.error("Error deleting slot:", error);
        res.status(500).json({ message: "Server error while deleting slot" });
    }
};