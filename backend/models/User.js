const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true, default: "USER" },
  password: { type: String, default: "delhi123" }
});

module.exports = mongoose.model("User", UserSchema);
