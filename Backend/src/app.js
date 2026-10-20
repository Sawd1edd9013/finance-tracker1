const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const AppError = require("./utils/AppError");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    if (err.name === "CastError") {
      return res.status(400).send({ error: "Некорректный идентификатор" });
    }
    return res.status(err.status).send({ error: err.message });
  }

  console.error(err);

  res.status(500).send({ error: "Внутренняя ошибка сервера" });
});

module.exports = app;
