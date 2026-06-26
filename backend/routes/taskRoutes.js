const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const mailer = require("../config/mailer");

// Get all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new task
router.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      id: "task-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
      status: "pending",
      createdAt: new Date().toISOString(),
      volunteers: []
    });
    await newTask.save();

    // Trigger proposal raised notification
    mailer.sendProposalRaisedAlert(newTask).catch((err) =>
      console.error("Failed to send proposal raised email:", err)
    );

    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task status
router.put("/tasks/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Task.findOneAndUpdate({ id }, { status }, { new: true });
    if (task) {
      if (status === "approved") {
        // Trigger approval notification
        mailer.sendProposalApprovedNotice(
          task.email,
          task.applicantName,
          task.title
        ).catch((err) =>
          console.error("Failed to send proposal approved email:", err)
        );
      }
      res.json({ success: true, task });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register volunteer for task
router.post("/tasks/:id/volunteers", async (req, res) => {
  try {
    const { id } = req.params;
    const volunteer = req.body;
    const task = await Task.findOne({ id });
    if (task) {
      if (task.volunteers.some((v) => v.email === volunteer.email)) {
        return res.status(400).json({ error: "Already registered with this email" });
      }
      const newVol = {
        ...volunteer,
        id: "vol-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
        joinedAt: new Date().toISOString()
      };
      task.volunteers.push(newVol);
      await task.save();
      res.json({ success: true, volunteer: newVol });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system stats
router.get("/stats", async (req, res) => {
  try {
    const tasks = await Task.find({});
    const approved = tasks.filter((t) => t.status === "approved");
    const totalVolunteers = approved.reduce((sum, t) => sum + t.volunteers.length, 0);
    const pendingCount = tasks.filter((t) => t.status === "pending").length;
    const uniqueLocalities = [...new Set(approved.map((t) => t.locality))].length;

    res.json({
      totalTasks: approved.length,
      totalVolunteers,
      totalPending: pendingCount,
      localities: uniqueLocalities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request extra details from user
router.put("/tasks/:id/request", async (req, res) => {
  try {
    const { id } = req.params;
    const { moderatorRequest } = req.body;
    const task = await Task.findOneAndUpdate(
      { id },
      { moderatorRequest },
      { new: true }
    );
    if (task) {
      // Trigger info request notification
      mailer.sendInfoRequestedNotice(
        task.email,
        task.applicantName,
        task.title,
        moderatorRequest
      ).catch((err) =>
        console.error("Failed to send info requested email:", err)
      );

      res.json({ success: true, task });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User responds to moderator request
router.put("/tasks/:id/respond", async (req, res) => {
  try {
    const { id } = req.params;
    const { userResponse } = req.body;
    const task = await Task.findOneAndUpdate(
      { id },
      { userResponse },
      { new: true }
    );
    if (task) {
      res.json({ success: true, task });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
