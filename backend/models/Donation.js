const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true }, // "upi" | "bank"
  transactionId: { type: String, required: true, unique: true }, // UPI Ref / Bank UTR
  status: { type: String, default: "pending" }, // "pending" | "approved" | "rejected"
  createdAt: { type: String, required: true },
  approvedAt: { type: String }
});

module.exports = mongoose.model("Donation", DonationSchema);
