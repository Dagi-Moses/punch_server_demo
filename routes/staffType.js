// routes/staffType.js
const express = require("express");
const router = express.Router();
const StaffType = require("../models/staffType");

// Create a new staff type entry
router.post("/", async (req, res) => {
  try {
    const staffType = new StaffType(req.body);
    await staffType.save();
    res.status(201).send(staffType);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all staff type entries
router.get("/", async (req, res) => {
  try {
    const staffTypes = await StaffType.find({});
    res.status(200).send(staffTypes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a staff type entry by ID
router.get("/:id", async (req, res) => {
  try {
    const staffType = await StaffType.findById(req.params.id);
    if (!staffType) {
      return res.status(404).send();
    }
    res.status(200).send(staffType);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a staff type entry by ID
router.patch("/:id", async (req, res) => {
  try {
    const staffType = await StaffType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!staffType) {
      return res.status(404).send();
    }
    res.status(200).send(staffType);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a staff type entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const staffType = await StaffType.findByIdAndDelete(req.params.id);
    if (!staffType) {
      return res.status(404).send();
    }
    res.status(200).send(staffType);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
