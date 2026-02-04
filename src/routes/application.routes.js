const express = require("express");
const router = express.Router();
const controller = require("../controllers/application.controller");

router.post("/", controller.createApplication);
router.get("/", controller.getApplications);

module.exports = router;
