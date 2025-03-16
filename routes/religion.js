// routes/religion.js
const express = require("express");
const router = express.Router();
const Religion = require("../models/religion");

// Create a new religion
router.post("/", async (req, res) => {
  try {
    const religion = new Religion(req.body);
    await religion.save();
    res.status(201).send(religion);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all religions
router.get("/", async (req, res) => {
  try {
    const religions = await Religion.find({});
    res.status(200).send(religions);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a religion by ID
router.get("/:id", async (req, res) => {
  try {
    const religion = await Religion.findById(req.params.id);
    if (!religion) {
      return res.status(404).send();
    }
    res.status(200).send(religion);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a religion by ID
router.patch("/:id", async (req, res) => {
  try {
    const religion = await Religion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!religion) {
      return res.status(404).send();
    }
    res.status(200).send(religion);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a religion by ID
router.delete("/:id", async (req, res) => {
  try {
    const religion = await Religion.findByIdAndDelete(req.params.id);
    if (!religion) {
      return res.status(404).send();
    }
    res.status(200).send(religion);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
