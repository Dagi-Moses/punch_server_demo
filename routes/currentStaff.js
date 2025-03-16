// routes/currentStaff.js
const express = require("express");
const router = express.Router();
const CurrentStaff = require("../models/currentStaff");

// Create a new current staff
router.post("/", async (req, res) => {
  try {
    const currentStaff = new CurrentStaff(req.body);
    await currentStaff.save();
    res.status(201).send(currentStaff);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all current staff
router.get("/", async (req, res) => {
  try {
    const currentStaff = await CurrentStaff.find({});
    res.status(200).send(currentStaff);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a current staff by ID
router.get("/:id", async (req, res) => {
  try {
    const currentStaff = await CurrentStaff.findById(req.params.id);
    if (!currentStaff) {
      return res.status(404).send();
    }
    res.status(200).send(currentStaff);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a current staff by ID
router.patch("/:id", async (req, res) => {
  try {
    const currentStaff = await CurrentStaff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!currentStaff) {
      return res.status(404).send();
    }
    res.status(200).send(currentStaff);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a current staff by ID
router.delete("/:id", async (req, res) => {
  try {
    const currentStaff = await CurrentStaff.findByIdAndDelete(req.params.id);
    if (!currentStaff) {
      return res.status(404).send();
    }
    res.status(200).send(currentStaff);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
