// routes/relationship.js
const express = require("express");
const router = express.Router();
const Relationship = require("../models/relationship");

// Create a new relationship
router.post("/", async (req, res) => {
  try {
    const relationship = new Relationship(req.body);
    await relationship.save();
    res.status(201).send(relationship);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all relationships
router.get("/", async (req, res) => {
  try {
    const relationships = await Relationship.find({});
    res.status(200).send(relationships);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a relationship by ID
router.get("/:id", async (req, res) => {
  try {
    const relationship = await Relationship.findById(req.params.id);
    if (!relationship) {
      return res.status(404).send();
    }
    res.status(200).send(relationship);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a relationship by ID
router.patch("/:id", async (req, res) => {
  try {
    const relationship = await Relationship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!relationship) {
      return res.status(404).send();
    }
    res.status(200).send(relationship);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a relationship by ID
router.delete("/:id", async (req, res) => {
  try {
    const relationship = await Relationship.findByIdAndDelete(req.params.id);
    if (!relationship) {
      return res.status(404).send();
    }
    res.status(200).send(relationship);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
