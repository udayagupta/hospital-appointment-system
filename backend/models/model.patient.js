const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  id: String,
  password: String,
  name: String,
  age: Number,
  gender: String,
  contact_info: Object,
  medical_history: Array,
  current_appointments: Array,
  location: Object
});

module.exports = mongoose.model('Patient', patientSchema);