const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
