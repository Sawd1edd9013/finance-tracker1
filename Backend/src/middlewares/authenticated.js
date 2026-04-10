const { verify } = require("../utils/token");
const User = require("../models/user");

module.exports = async function (req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const data = verify(token);

    const user = await User.findById(data.id);

    if (!user) {
      return res.status(401).send({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (e) {
    return res.status(401).send({ error: "Unauthorized" });
  }
};
