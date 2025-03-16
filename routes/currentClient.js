// routes/currentClient.js
const express = require("express");
const router = express.Router();
const CurrentClient = require("../models/currentClient");

// Create a new current client
router.post("/", async (req, res) => {
  try {
    const currentClient = new CurrentClient(req.body);
    await currentClient.save();
    res.status(201).send(currentClient);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all current clients
router.get("/", async (req, res) => {
  try {
    const currentClients = await CurrentClient.find({});
    res.status(200).send(currentClients);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a current client by ID
router.get("/:id", async (req, res) => {
  try {
    const currentClient = await CurrentClient.findById(req.params.id);
    if (!currentClient) {
      return res.status(404).send();
    }
    res.status(200).send(currentClient);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a current client by ID
router.patch("/:id", async (req, res) => {
  try {
    const currentClient = await CurrentClient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!currentClient) {
      return res.status(404).send();
    }
    res.status(200).send(currentClient);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a current client by ID
router.delete("/:id", async (req, res) => {
  try {
    const currentClient = await CurrentClient.findByIdAndDelete(req.params.id);
    if (!currentClient) {
      return res.status(404).send();
    }
    res.status(200).send(currentClient);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
