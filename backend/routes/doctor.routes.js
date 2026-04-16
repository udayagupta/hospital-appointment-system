const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/doctor.controller");
const protect = require("../middleware/auth");

router.get("/",  ctrl.getDoctors);
router.get("/:doctorId", ctrl.getDoctor);

module.exports = router;