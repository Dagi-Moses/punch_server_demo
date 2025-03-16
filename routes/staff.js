// routes/staff.js
const express = require("express");
const router = express.Router();
const Staff = require("../models/staff");


function broadcast(channel, data, wss) {
  wss.clients.forEach((staff) => {
    if (staff.readyState === WebSocket.OPEN && staff.channel === channel) {
      staff.send(JSON.stringify(data));
      console.log(`Broadcasted to ${channel}: ${JSON.stringify(data)}`);
    }
  });
}
router.post("/", async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).send(staff);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all staff entries
router.get("/", async (req, res) => {
  try {
    const staffs = await Staff.find({});
    res.status(200).send(staffs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a staff entry by ID
router.get("/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).send();
    }
    res.status(200).send(staff);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a staff entry by ID
router.patch("/:id", async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!staff) {
      return res.status(404).send();
    }
    res.status(200).send(staff);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a staff entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).send();
    }
    res.status(200).send(staff);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
