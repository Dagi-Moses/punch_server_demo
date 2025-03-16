// routes/sector.js
const express = require("express");
const router = express.Router();
const Sector = require("../models/sector");

// Create a new sector
router.post("/", async (req, res) => {
  try {
    const sector = new Sector(req.body);
    await sector.save();
    res.status(201).send(sector);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all sectors
router.get("/", async (req, res) => {
  try {
    const sectors = await Sector.find({});
    res.status(200).send(sectors);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a sector by ID
router.get("/:id", async (req, res) => {
  try {
    const sector = await Sector.findById(req.params.id);
    if (!sector) {
      return res.status(404).send();
    }
    res.status(200).send(sector);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a sector by ID
router.patch("/:id", async (req, res) => {
  try {
    const sector = await Sector.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sector) {
      return res.status(404).send();
    }
    res.status(200).send(sector);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a sector by ID
router.delete("/:id", async (req, res) => {
  try {
    const sector = await Sector.findByIdAndDelete(req.params.id);
    if (!sector) {
      return res.status(404).send();
    }
    res.status(200).send(sector);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
