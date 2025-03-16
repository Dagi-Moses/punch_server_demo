// routes/maritalStatus.js
const express = require("express");
const router = express.Router();
const MaritalStatus = require("../models/maritalStatus");

// Create a new marital status
router.post("/", async (req, res) => {
  try {
    const maritalStatus = new MaritalStatus(req.body);
    await maritalStatus.save();
    res.status(201).send(maritalStatus);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all marital statuses
router.get("/", async (req, res) => {
  try {
    const maritalStatuses = await MaritalStatus.find({});
    res.status(200).send(maritalStatuses);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a marital status by ID
router.get("/:id", async (req, res) => {
  try {
    const maritalStatus = await MaritalStatus.findById(req.params.id);
    if (!maritalStatus) {
      return res.status(404).send();
    }
    res.status(200).send(maritalStatus);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a marital status by ID
router.patch("/:id", async (req, res) => {
  try {
    const maritalStatus = await MaritalStatus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!maritalStatus) {
      return res.status(404).send();
    }
    res.status(200).send(maritalStatus);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a marital status by ID
router.delete("/:id", async (req, res) => {
  try {
    const maritalStatus = await MaritalStatus.findByIdAndDelete(req.params.id);
    if (!maritalStatus) {
      return res.status(404).send();
    }
    res.status(200).send(maritalStatus);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
