const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  contact_info: { type: String, required: true, unique: true }, // The email
  works_at: { type: String, required: true },
  slots_available: { type: Array, default: [] }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model("Doctor", doctorSchema);