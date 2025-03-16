// routes/state.js
const express = require("express");
const router = express.Router();
const State = require("../models/state");

// Create a new state entry
router.post("/", async (req, res) => {
  try {
    const state = new State(req.body);
    await state.save();
    res.status(201).send(state);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all state entries
router.get("/", async (req, res) => {
  try {
    const states = await State.find({});
    res.status(200).send(states);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a state entry by ID
router.get("/:id", async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res.status(404).send();
    }
    res.status(200).send(state);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a state entry by ID
router.patch("/:id", async (req, res) => {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!state) {
      return res.status(404).send();
    }
    res.status(200).send(state);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a state entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) {
      return res.status(404).send();
    }
    res.status(200).send(state);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
