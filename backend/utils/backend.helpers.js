const cleanExpiredSlots = async (Doctor) => {
    console.log("Helloooo")
    const now = new Date();
    const doctors = await Doctor.find({ "slots_available.0": { $exists: true } });
    
    const updates = doctors.map(doctor => {
        const validSlots = doctor.slots_available.filter(slot => {
            const slotDateTime = new Date(`${slot.date} ${slot.time}`);
            console.log(slotDateTime);
            console.log(`Expired: ${slotDateTime > now}`)
            return slotDateTime > now;
        });

        if (validSlots.length !== doctor.slots_available.length) {
            doctor.slots_available = validSlots;
            return doctor.save();
        }
    });

    await Promise.all(updates.filter(Boolean));
};

export default { cleanExpiredSlots };