const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/auth.controller");
const protect = require("../middleware/auth");

router.post("/patient/login",    ctrl.patientLogin);
router.post("/doctor/login",     ctrl.doctorLogin);
router.post("/patient/register", ctrl.patientRegister);
router.post("/doctor/register",  ctrl.doctorRegister);
router.post("/me", protect,      ctrl.getMe);

module.exports = router;