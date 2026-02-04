const express = require("express");
const app = express();

app.use(express.json());

const applicationRoutes = require("./routes/application.routes");
app.use("/applications", applicationRoutes);

module.exports = app;
