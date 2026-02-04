const Application = require("../models/Application");

exports.createApplication = async (req, res) => {
  const { name, email, jobTitle } = req.body;

  if (
    !name || !email || !jobTitle ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof jobTitle !== "string" ||
    name.trim() === "" ||
    email.trim() === "" ||
    jobTitle.trim() === ""
  ) {
    return res.status(400).json({
      message: "Invalid input"
    });
  }

  const application = await Application.create({
    name,
    email,
    jobTitle
  });

  res.status(201).json(application);
};

exports.getApplications = async (req, res) => {
  const applications = await Application.find();
  res.status(200).json(applications);
};
