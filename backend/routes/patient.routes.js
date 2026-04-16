const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/patient.controller");
const protect = require("../middleware/auth");

router.get("/:patientId", ctrl.getPatient);
router.patch("/:patientId/updateRecords", ctrl.updateMedicalHistory);

module.exports = router;