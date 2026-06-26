const express = require("express");
const router = express.Router();
const VolunteerApp = require("../models/VolunteerApp");
const Subscriber = require("../models/Subscriber");
const GeneralVolunteer = require("../models/GeneralVolunteer");
const Donation = require("../models/Donation");
const mailer = require("../config/mailer");

// Get all volunteer applications
router.get("/volunteer-apps", async (req, res) => {
  try {
    const apps = await VolunteerApp.find({});
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit volunteer application
router.post("/volunteer-apps", async (req, res) => {
  try {
    const newApp = new VolunteerApp({
      ...req.body,
      id: "vapp-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
      status: "applied",
      createdAt: new Date().toISOString()
    });
    await newApp.save();

    // Fetch task details to get title for the email
    const Task = require("../models/Task");
    const task = await Task.findOne({ id: newApp.taskId });
    const taskTitle = task ? task.title : "Community Initiative";

    // Send application receipt and alert admin
    mailer.sendVolunteerAppReceived(newApp, taskTitle).catch((err) =>
      console.error("Failed to send volunteer application received email:", err)
    );

    res.json(newApp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update volunteer application status
router.put("/volunteer-apps/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appRecord = await VolunteerApp.findOneAndUpdate({ id }, { status }, { new: true });
    if (appRecord) {
      const Task = require("../models/Task");
      const task = await Task.findOne({ id: appRecord.taskId });
      const taskTitle = task ? task.title : "Community Initiative";

      if (status === "approved" && task) {
        if (!task.volunteers.some((v) => v.email === appRecord.email)) {
          task.volunteers.push({
            id: "vol-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
            name: appRecord.name,
            email: appRecord.email,
            phone: appRecord.phone,
            joinedAt: new Date().toISOString(),
            message: appRecord.reason
          });
          await task.save();
        }
      }

      // Send approval or rejection email notification to the applicant
      if (status === "approved" || status === "rejected") {
        mailer.sendVolunteerAppStatusUpdate(appRecord, taskTitle, status).catch((err) =>
          console.error("Failed to send volunteer status update email:", err)
        );
      }

      res.json({ success: true, application: appRecord });
    } else {
      res.status(404).json({ error: "Application not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subscribe to newsletter updates
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const cleanEmail = email.trim().toLowerCase();
    
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const existing = await Subscriber.findOne({ email: cleanEmail });
    if (existing) {
      return res.json({ success: true, message: "You are already subscribed!" });
    }

    const newSub = new Subscriber({
      email: cleanEmail,
      createdAt: new Date().toISOString()
    });
    await newSub.save();

    // Trigger welcome subscription email
    mailer.sendSubscriptionWelcome(cleanEmail).catch((err) =>
      console.error("Failed to send subscription welcome email:", err)
    );

    res.json({ success: true, message: "Thank you for subscribing!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get list of newsletter subscribers
router.get("/subscribers", async (req, res) => {
  try {
    const subs = await Subscriber.find({}).sort({ createdAt: -1 });
    res.json(subs.map(s => s.email));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register as a general volunteer
router.post("/general-volunteers", async (req, res) => {
  try {
    const { name, email, phone, preferredRole, location } = req.body;
    if (!name || !email || !phone || !preferredRole || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const existing = await GeneralVolunteer.findOne({ email: cleanEmail });
    if (existing) {
      return res.json({ success: true, message: "You are already registered as a volunteer!" });
    }

    const newVol = new GeneralVolunteer({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      preferredRole: preferredRole.trim(),
      location: location.trim(),
      createdAt: new Date().toISOString(),
    });
    await newVol.save();

    // Trigger welcome email and admin notification
    mailer.sendGeneralVolunteerWelcome(newVol).catch((err) =>
      console.error("Failed to send general volunteer welcome email:", err)
    );

    res.json({ success: true, message: "Thank you for registering! We will reach out to you soon." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all general volunteers
router.get("/general-volunteers", async (req, res) => {
  try {
    const vols = await GeneralVolunteer.find({}).sort({ createdAt: -1 });
    res.json(vols);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Report a new donation
router.post("/donations/report", async (req, res) => {
  try {
    const { name, email, phone, amount, method, transactionId } = req.body;
    if (!name || !email || !phone || !amount || !method || !transactionId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    // Check for duplicate transaction ID
    const existing = await Donation.findOne({ transactionId: transactionId.trim() });
    if (existing) {
      return res.status(400).json({ error: "A donation with this Transaction ID has already been reported." });
    }

    const newDonation = new Donation({
      id: "don-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      amount: Number(amount),
      method: method.trim(),
      transactionId: transactionId.trim(),
      status: "pending",
      createdAt: new Date().toISOString()
    });

    await newDonation.save();

    // Send confirmation email asynchronously to avoid blocking the API response
    mailer.sendDonationReportAcknowledgement(
      cleanEmail,
      name.trim(),
      Number(amount),
      method.trim(),
      transactionId.trim()
    ).catch(err => console.error("Error sending donation report acknowledgement:", err));

    res.json({ success: true, donation: newDonation, message: "Donation reported successfully! We will verify it and send your receipt soon." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all donation reports
router.get("/donations", async (req, res) => {
  try {
    const donations = await Donation.find({}).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update donation report status (Approve / Reject)
router.put("/donations/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" | "rejected"
    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const donation = await Donation.findOne({ id });
    if (!donation) {
      return res.status(404).json({ error: "Donation report not found" });
    }

    donation.status = status;
    if (status === "approved") {
      donation.approvedAt = new Date().toISOString();
      
      // Trigger SMTP receipt email
      mailer.sendDonationReceipt(donation.email, donation.name, {
        amount: donation.amount,
        txId: donation.transactionId
      }).catch((err) =>
        console.error("Failed to send donation receipt email:", err)
      );
    }

    await donation.save();
    res.json({ success: true, donation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
