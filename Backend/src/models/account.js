const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["debit", "cash", "deposit"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
