const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(400).send({
    error: err.message || "Unknown error",
  });
});

module.exports = app;
