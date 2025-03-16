// routes/familyType.js
const express = require("express");
const router = express.Router();
const FamilyType = require("../models/familyType");

// Create a new family type
router.post("/", async (req, res) => {
  try {
    const familyType = new FamilyType(req.body);
    await familyType.save();
    res.status(201).send(familyType);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all family types
router.get("/", async (req, res) => {
  try {
    const familyTypes = await FamilyType.find({});
    res.status(200).send(familyTypes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a family type by ID
router.get("/:id", async (req, res) => {
  try {
    const familyType = await FamilyType.findById(req.params.id);
    if (!familyType) {
      return res.status(404).send();
    }
    res.status(200).send(familyType);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a family type by ID
router.patch("/:id", async (req, res) => {
  try {
    const familyType = await FamilyType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!familyType) {
      return res.status(404).send();
    }
    res.status(200).send(familyType);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a family type by ID
router.delete("/:id", async (req, res) => {
  try {
    const familyType = await FamilyType.findByIdAndDelete(req.params.id);
    if (!familyType) {
      return res.status(404).send();
    }
    res.status(200).send(familyType);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
