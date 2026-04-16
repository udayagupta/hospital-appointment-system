const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointment.controller");
const protect = require("../middleware/auth");

router.get("/", protect, ctrl.getAppointments);
router.patch("/:appointmentId/status", protect, ctrl.updateStatus);
router.post("/book", protect, ctrl.bookAppointment);

module.exports = router;