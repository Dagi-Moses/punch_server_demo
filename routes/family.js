// routes/family.js
const express = require("express");
const router = express.Router();
const Family = require("../models/family");

// Create a new family
router.post("/", async (req, res) => {
  try {
    const family = new Family(req.body);
    await family.save();
    res.status(201).send(family);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all families
router.get("/", async (req, res) => {
  try {
    const families = await Family.find({});
    res.status(200).send(families);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a family by ID
router.get("/:id", async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).send();
    }
    res.status(200).send(family);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a family by ID
router.patch("/:id", async (req, res) => {
  try {
    const family = await Family.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!family) {
      return res.status(404).send();
    }
    res.status(200).send(family);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a family by ID
router.delete("/:id", async (req, res) => {
  try {
    const family = await Family.findByIdAndDelete(req.params.id);
    if (!family) {
      return res.status(404).send();
    }
    res.status(200).send(family);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
