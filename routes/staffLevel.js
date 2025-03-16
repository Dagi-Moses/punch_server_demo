// routes/staffLevel.js
const express = require("express");
const router = express.Router();
const StaffLevel = require("../models/staffLevel");

// Create a new staff level entry
router.post("/", async (req, res) => {
  try {
    const staffLevel = new StaffLevel(req.body);
    await staffLevel.save();
    res.status(201).send(staffLevel);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all staff level entries
router.get("/", async (req, res) => {
  try {
    const staffLevels = await StaffLevel.find({});
    res.status(200).send(staffLevels);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a staff level entry by ID
router.get("/:id", async (req, res) => {
  try {
    const staffLevel = await StaffLevel.findById(req.params.id);
    if (!staffLevel) {
      return res.status(404).send();
    }
    res.status(200).send(staffLevel);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a staff level entry by ID
router.patch("/:id", async (req, res) => {
  try {
    const staffLevel = await StaffLevel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!staffLevel) {
      return res.status(404).send();
    }
    res.status(200).send(staffLevel);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a staff level entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const staffLevel = await StaffLevel.findByIdAndDelete(req.params.id);
    if (!staffLevel) {
      return res.status(404).send();
    }
    res.status(200).send(staffLevel);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
