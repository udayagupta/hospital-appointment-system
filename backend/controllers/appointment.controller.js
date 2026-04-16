const Appointment = require("../models/model.appointment");
const Doctor = require("../models/model.doctor");
const Patient = require("../models/model.patient");

const generateUniqueId = async (prefix, Model) => {
  while (true) {
    const generatedId = prefix + Math.floor(10000 + Math.random() * 90000);
    const existing = await Model.findOne({ appointmentId: generatedId });
    if (!existing) return generatedId;
  }
};


exports.bookAppointment = async (req, res) => {
    const { patientId, doctorId, date, time, duration } = req.body;

    if (!patientId || !doctorId || !date || !time || !duration) {
        return res.status(400).json({ message: "All fields are required!" });
    };

    try {
        const [doctor, patient] = await Promise.all([
            Doctor.findOne({ id: doctorId}),
            Patient.findOne({ id: patientId })
        ])

        if (!patient || !doctor) return res.status(404).json({ message: "Doctor or Patient not found!" });

        const generatedId = await generateUniqueId("A-", Appointment);

        const newAppt = new Appointment({
            appointmentId: generatedId,
            patientId,
            doctorId,
            patientName: patient.name,
            doctorName: doctor.name,
            date,
            time,
            duration,
            status: "Scheduled"
        })

        await newAppt.save();

        doctor.slots_available = doctor.slots_available.filter((slot) => !(slot.date === date && slot.time === time));

        if (!patient.current_appointments) patient.current_appointments = [];
        if (!doctor.current_appointments) doctor.current_appointments = [];

        patient.current_appointments.push(newAppt);
        doctor.current_appointments.push(newAppt);

        await Promise.all([patient.save(), doctor.save()]);

        res.status(201).json({
            message: "Appointment Booked",
            appointment: newAppt,
        })


    } catch (error) {
        console.error("Error while booking an appointment:", error);
        res.status(500).json({ message: "Server error while booking an appointment" });
    }
};

exports.updateStatus = async (req, res) => {
    const { status } = req.body;
    const { appointmentId } = req.params;

    if (!status || !appointmentId) {
        return res.status(400).json({ message: "Status and Appointment ID are required!" });
    }

    const validStatuses = ["Scheduled", "Cancelled", "Completed"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`})
    }

    try {
        const appointment = await Appointment.findOne({ appointmentId });

        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        if (appointment.status === "Cancelled") {
            return res.status(400).json({ message: "Cannot update a cancelled appointment" })
        }

        if (status === "Cancelled") {
            const doctor = await Doctor.findOne({ id: appointment.doctorId });

            doctor.slots_available.push({
                time: appointment.time,
                date: appointment.date,
                duration: appointment.duration
            })

            doctor.slots_available.sort((a, b) => {
                if (a.date === b.date) return a.time.localeCompare(b.time);
                return new Date(a.date) - new Date(b.date);
            })

            await doctor.save();
        }

        appointment.status = status;
        await appointment.save();

        res.json({
            message: `Appointment successfully marked as ${status}`,
            appointment
        })
    } catch (error) {
        console.error("Error while updating appointment status:", error);
        res.status(500).json({ message: "Server error while updating appointment status" });
    }
};

exports.getAppointments = async (req, res) => {
    const { patientId, doctorId } = req.query;

    let query = {};
    if (patientId) query.patientId = patientId.trim();
    if (doctorId) query.doctorId = doctorId.trim();

    try {
        const appointments = await Appointment.find(query).sort({ date: 1, time: 1});

        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Server error while fetching appointments" });
    }
}

