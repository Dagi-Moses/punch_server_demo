// routes/subSector.js
const express = require("express");
const router = express.Router();
const SubSector = require("../models/subSector");

// Create a new sub-sector entry
router.post("/", async (req, res) => {
  try {
    const subSector = new SubSector(req.body);
    await subSector.save();
    res.status(201).send(subSector);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all sub-sector entries
router.get("/", async (req, res) => {
  try {
    const subSectors = await SubSector.find({});
    res.status(200).send(subSectors);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a sub-sector entry by ID
router.get("/:id", async (req, res) => {
  try {
    const subSector = await SubSector.findById(req.params.id);
    if (!subSector) {
      return res.status(404).send();
    }
    res.status(200).send(subSector);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a sub-sector entry by ID
router.patch("/:id", async (req, res) => {
  try {
    const subSector = await SubSector.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subSector) {
      return res.status(404).send();
    }
    res.status(200).send(subSector);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a sub-sector entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const subSector = await SubSector.findByIdAndDelete(req.params.id);
    if (!subSector) {
      return res.status(404).send();
    }
    res.status(200).send(subSector);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
