const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contact_info: { 
    email: { type: String, required: true, unique: true }
  },
  medical_history: { type: Array, default: [] },
  current_appointments: { type: Array, default: [] },
  location: { 
    city: { type: String, required: true },
    state: { type: String, default: "Pending" }
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Patient", patientSchema);