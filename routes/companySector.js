// routes/companySector.js
const express = require("express");
const router = express.Router();
const CompanySector = require("../models/companySector");

// Create a new company sector

router.post("/", async (req, res) => {
  try {
    // Find the document with the highest Anniversary_Type_Id
    const highestCompanySector = await CompanySector.findOne({})
      .sort({ Company_Sector_Id: -1 })
      .exec();

    // Increment the highest Anniversary_Type_Id by 1
    const newCompanySectorId = highestCompanySector
      ? highestCompanySector.Company_Sector_Id + 1
      : 1; // Start from 1 if there are no existing records

    // Debugging statement to check the computed ID
    console.log(`New Company Sector Id: ${newCompanySectorId}`);

    // Ensure newAnniversaryTypeId is a number
    if (isNaN(newCompanySectorId)) {
      throw new Error("Computed Company Sector is NaN");
    }

    // Create a new AnniversaryType with the incremented ID
    const companySector = new CompanySector({
      Company_Sector_Id: newCompanySectorId,
      Description: req.body.Description,
    });

    // Save the new AnniversaryType to the database
    await companySector.save();

    res.status(201).send(companySector);
  } catch (error) {
    console.error(error); // Debugging statement
    res.status(400).send(error);
  }
});

// Get all company sectors
router.get("/", async (req, res) => {
  try {
    const companySectors = await CompanySector.find({});
    res.status(200).send(companySectors);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a company sector by ID
router.get("/:id", async (req, res) => {
  try {
    const companySector = await CompanySector.findById(req.params.id);
    if (!companySector) {
      return res.status(404).send();
    }
    res.status(200).send(companySector);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a company sector by ID

// PATCH an AnniversaryType by Anniversay_Type_Id
router.patch("/:id", async (req, res) => {
  try {
    const { Description } = req.body;
    console.log("Received update data:", Description);
    // Update the document by Anniversay_Type_Id
    const companySector = await CompanySector.findOneAndUpdate(
      { Company_Sector_Id: req.params.id }, // Filter by Anniversay_Type_Id
      { $set: { Description } }, // Update fields
      { new: true, runValidators: true } // Run validators
    );
    if (!companySector) {
      return res
        .status(404)
        .send("AnniversaryType not found or no changes made");
    }
    res.status(200).send(companySector);
  } catch (error) {
    console.error(error); // Debugging statement
    res.status(400).send(error);
  }
});

// Delete a company sector by ID
router.delete("/:id", async (req, res) => {
  try {
    const companySector = await CompanySector.deleteOne({
      Company_Sector_Id: req.params.id,
    });

    if (!companySector) {
      return res.status(404).send();
    }
    res.status(200).send(companySector);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
