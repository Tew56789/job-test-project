const Application = require("../models/application.model");

/**
 * POST /applications
 */
exports.createApplication = async (req, res) => {
  try {
    const { name, email, jobTitle } = req.body;

    // body ว่าง
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    // required fields
    if (!name || !email || !jobTitle) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // name length
    if (name.length > 100) {
      return res.status(400).json({ message: "Name is too long" });
    }

    // email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ เช็ก email ซ้ำ (ระดับ application)
    const existing = await Application.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "Email already applied",
      });
    }

    const application = await Application.create({
      name,
      email,
      jobTitle,
    });

    return res.status(201).json(application);

  } catch (err) {
    // ✅ กันกรณี DB throw duplicate key
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Email already applied",
      });
    }

    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /applications
 */
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.status(200).json(applications);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
