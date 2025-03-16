// routes/sex.js
const express = require("express");
const router = express.Router();
const Sex = require("../models/sex");

// Create a new sex entry
router.post("/", async (req, res) => {
  try {
    const sex = new Sex(req.body);
    await sex.save();
    res.status(201).send(sex);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all sex entries
router.get("/", async (req, res) => {
  try {
    const sexes = await Sex.find({});
    res.status(200).send(sexes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a sex entry by ID
router.get("/:id", async (req, res) => {
  try {
    const sex = await Sex.findById(req.params.id);
    if (!sex) {
      return res.status(404).send();
    }
    res.status(200).send(sex);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a sex entry by ID
router.patch("/:id", async (req, res) => {
  try {
    const sex = await Sex.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sex) {
      return res.status(404).send();
    }
    res.status(200).send(sex);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a sex entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const sex = await Sex.findByIdAndDelete(req.params.id);
    if (!sex) {
      return res.status(404).send();
    }
    res.status(200).send(sex);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
