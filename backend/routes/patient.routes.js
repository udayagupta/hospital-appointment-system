const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/patient.controller");
const protect = require("../middleware/auth");

router.get("/:patientId", protect, ctrl.getPatient);

module.exports = router;