// routes/clientOld.js
const express = require("express");
const router = express.Router();
const ClientOld = require("../models/clientOld");

// Create a new client old
router.post("/", async (req, res) => {
  try {
    const clientOld = new ClientOld(req.body);
    await clientOld.save();
    res.status(201).send(clientOld);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all client olds
router.get("/", async (req, res) => {
  try {
    const clientOlds = await ClientOld.find({});
    res.status(200).send(clientOlds);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a client old by ID
router.get("/:id", async (req, res) => {
  try {
    const clientOld = await ClientOld.findById(req.params.id);
    if (!clientOld) {
      return res.status(404).send();
    }
    res.status(200).send(clientOld);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a client old by ID
router.patch("/:id", async (req, res) => {
  try {
    const clientOld = await ClientOld.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!clientOld) {
      return res.status(404).send();
    }
    res.status(200).send(clientOld);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a client old by ID
router.delete("/:id", async (req, res) => {
  try {
    const clientOld = await ClientOld.findByIdAndDelete(req.params.id);
    if (!clientOld) {
      return res.status(404).send();
    }
    res.status(200).send(clientOld);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
