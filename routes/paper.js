// routes/paper.js
const express = require("express");
const router = express.Router();
const Paper = require("../models/paper");

// Create a new paper


router.post("/", async (req, res) => {
  try {
    // Find the document with the highest Anniversary_Type_Id
    const highestPaper = await Paper.findOne({})
      .sort({ Paper_Id: -1 })
      .exec();

    // Increment the highest Anniversary_Type_Id by 1
    const newPaperId = highestPaper
      ? highestPaper.Paper_Id + 1
      : 1; // Start from 1 if there are no existing records

    // Debugging statement to check the computed ID
    console.log(`Paper_Id: ${newPaperId}`);

    // Ensure newAnniversaryTypeId is a number
    if (isNaN(newPaperId)) {
      throw new Error("Computed Paper_Id is NaN");
    }

    // Create a new AnniversaryType with the incremented ID
    const paper = new Paper({
      Paper_Id: newPaperId,
      Description: req.body.Description,
    });

    // Save the new AnniversaryType to the database
    await paper.save();

    res.status(201).send(paper);
  } catch (error) {
    console.error(error); // Debugging statement
    res.status(400).send(error);
  }
});


// Get all papers
router.get("/", async (req, res) => {
  try {
    const papers = await Paper.find({});
    res.status(200).send(papers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a paper by ID
router.get("/:id", async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).send();
    }
    res.status(200).send(paper);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a paper by ID

// PATCH an AnniversaryType by Anniversay_Type_Id
router.patch('/:id', async (req, res) => {
  try {
       const { Description } = req.body;
       console.log("Received update data:", Description);
    // Update the document by Anniversay_Type_Id
    const paper = await Paper.findOneAndUpdate(
      { Paper_Id: req.params.id }, // Filter by Anniversay_Type_Id
      { $set: { Description } }, // Update fields
      { new: true, runValidators: true } // Run validators
    );
    if (!paper) {
      return res
        .status(404)
        .send("Paper not found or no changes made");
    }
    // Fetch the updated document to return it
    res.status(200).send(paper);
  } catch (error) {
    console.error(error); // Debugging statement
    res.status(400).send(error);
  }
});


// Delete a paper by ID
router.delete("/:id", async (req, res) => {
  try {
    const paper = await Paper.deleteOne({
      Paper_Id: req.params.id,
    });

    if (!paper) {
      return res.status(404).send();
    }
    res.status(200).send(paper);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
