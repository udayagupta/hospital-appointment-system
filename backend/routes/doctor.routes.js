const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/doctor.controller");
const protect = require("../middleware/auth");

router.get("/", protect, ctrl.getDoctors);
router.get("/:doctorId", protect, ctrl.getDoctor);

module.exports = router;