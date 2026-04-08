const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  id: String,
  password: String, 
  name: String,
  specialization: String,
  experience: String,
  contact_info: String,
  works_at: String,
  slots_available: Array
})

module.exports = mongoose.model("Doctor", doctorSchema);