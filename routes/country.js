// routes/country.js
const express = require("express");
const router = express.Router();
const Country = require("../models/country");

// Create a new country
router.post("/", async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();
    res.status(201).send(country);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all countries
router.get("/", async (req, res) => {
  try {
    const countries = await Country.find({});
    res.status(200).send(countries);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a country by ID
router.get("/:id", async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).send();
    }
    res.status(200).send(country);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a country by ID
router.patch("/:id", async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!country) {
      return res.status(404).send();
    }
    res.status(200).send(country);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a country by ID
router.delete("/:id", async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) {
      return res.status(404).send();
    }
    res.status(200).send(country);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
