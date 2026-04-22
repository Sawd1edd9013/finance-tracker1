const mongoose = require("mongoose");

const connectDb = async () => {
  const uri = process.env.DB_CONNECTION_STRING;

  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

module.exports = connectDb;
