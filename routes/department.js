// routes/department.js
const express = require("express");
const router = express.Router();
const Department = require("../models/department");

// Create a new department
router.post("/", async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).send(department);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all departments
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find({});
    res.status(200).send(departments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a department by ID
router.get("/:id", async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).send();
    }
    res.status(200).send(department);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a department by ID
router.patch("/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!department) {
      return res.status(404).send();
    }
    res.status(200).send(department);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a department by ID
router.delete("/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).send();
    }
    res.status(200).send(department);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
