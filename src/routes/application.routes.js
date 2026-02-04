const express = require("express");
const router = express.Router();

const controller = require("../controllers/application.controller");
const validateApplication = require("../middlewares/validateApplication");

router.post("/", validateApplication, controller.createApplication);
router.get("/", controller.getApplications);

module.exports = router;
