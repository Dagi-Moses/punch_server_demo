// routes/anniversarySector.js
const express = require("express");
const router = express.Router();
const AnniversarySector = require("../models/anniversarySector");

// Get all anniversary sectors
router.get("/", async (req, res) => {
  try {
    const anniversarySectors = await AnniversarySector.find();
    res.json(anniversarySectors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single anniversary sector
router.get("/:id", getAnniversarySector, (req, res) => {
  res.json(res.anniversarySector);
});

// Create an anniversary sector
router.post("/", async (req, res) => {
  const anniversarySector = new AnniversarySector({
    _id: req.body._id,
    anniversary_sector_id: req.body.anniversary_sector_id,
    anniversary_no: req.body.anniversary_no,
    sub_sector_id: req.body.sub_sector_id,
  });

  try {
    const newAnniversarySector = await anniversarySector.save();
    res.status(201).json(newAnniversarySector);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an anniversary sector
router.patch("/:id", getAnniversarySector, async (req, res) => {
  if (req.body.anniversary_sector_id != null) {
    res.anniversarySector.anniversary_sector_id =
      req.body.anniversary_sector_id;
  }
  if (req.body.anniversary_no != null) {
    res.anniversarySector.anniversary_no = req.body.anniversary_no;
  }
  if (req.body.sub_sector_id != null) {
    res.anniversarySector.sub_sector_id = req.body.sub_sector_id;
  }
  try {
    const updatedAnniversarySector = await res.anniversarySector.save();
    res.json(updatedAnniversarySector);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an anniversary sector
router.delete("/:id", getAnniversarySector, async (req, res) => {
  try {
    await res.anniversarySector.remove();
    res.json({ message: "Deleted Anniversary Sector" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getAnniversarySector(req, res, next) {
  try {
    const anniversarySector = await AnniversarySector.findById(req.params.id);
    if (anniversarySector == null) {
      return res
        .status(404)
        .json({ message: "Cannot find anniversary sector" });
    }
    res.anniversarySector = anniversarySector;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;

