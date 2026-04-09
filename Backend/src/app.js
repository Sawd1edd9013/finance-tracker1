const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const routes = require("./routes");
app.use("/api", routes);

module.exports = app;
