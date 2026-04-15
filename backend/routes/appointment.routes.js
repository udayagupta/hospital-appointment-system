const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointment.controller");
const protect = require("../middleware/auth");

router.post("/book", ctrl.bookAppointment);
router.patch("/:appointmentId/status", ctrl.updateStatus);
router.get("/", protect, ctrl.getAppointments);

module.exports = router;