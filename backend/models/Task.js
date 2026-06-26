const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  joinedAt: { type: String, required: true },
  message: { type: String }
});

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  applicantType: { type: String, required: true },
  applicantName: { type: String, required: true },
  organizationName: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  locality: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventTime: { type: String, required: true },
  volunteersNeeded: { type: Number, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: String, required: true },
  volunteers: { type: [VolunteerSchema], default: [] },
  moderatorRequest: { type: String },
  userResponse: { type: String }
});

module.exports = mongoose.model("Task", TaskSchema);
