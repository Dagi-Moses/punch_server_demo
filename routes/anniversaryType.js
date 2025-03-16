// routes/anniversaryType.js
const express = require("express");
const router = express.Router();
const AnniversaryType = require("../models/anniversaryType");

// Create a new anniversary typ// Adjust the path as needed

router.post("/", async (req, res) => {
  try {
    // Find the document with the highest Anniversary_Type_Id
    const highestAnniversaryType = await AnniversaryType.findOne({})
      .sort({ Anniversary_Type_Id: -1 })
      .exec();

    // Increment the highest Anniversary_Type_Id by 1
    const newAnniversaryTypeId = highestAnniversaryType
      ? highestAnniversaryType.Anniversary_Type_Id + 1
      : 1; // Start from 1 if there are no existing records

    // Debugging statement to check the computed ID
    console.log(`New Anniversary_Type_Id: ${newAnniversaryTypeId}`);

    // Ensure newAnniversaryTypeId is a number
    if (isNaN(newAnniversaryTypeId)) {
      throw new Error("Computed Anniversary_Type_Id is NaN");
    }

    // Create a new AnniversaryType with the incremented ID
    const anniversaryType = new AnniversaryType({
      Anniversary_Type_Id: newAnniversaryTypeId,
      Description: req.body.Description,
    });

    // Save the new AnniversaryType to the database
    await anniversaryType.save();

    res.status(201).send(anniversaryType);
  } catch (error) {
    console.error(error); // Debugging statement
    res.status(400).send(error);
  }
});

// Get all anniversary types
router.get("/", async (req, res) => {
  try {
    const anniversaryTypes = await AnniversaryType.find({});
    res.status(200).send(anniversaryTypes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get an anniversary type by ID
router.get("/:id", async (req, res) => {
  try {
    const anniversaryType = await AnniversaryType.findById(req.params.id);
    if (!anniversaryType) {
      return res.status(404).send();
    }
    res.status(200).send(anniversaryType);
  } catch (error) {
    res.status(500).send(error);
  }
});

// PATCH an AnniversaryType by Anniversay_Type_Id
router.patch('/:id', async (req, res) => {
  try {
       const { Description } = req.body;
       console.log("Received update data:", Description);
    // Update the document by Anniversay_Type_Id
    const anniversaryType = await AnniversaryType.findOneAndUpdate(
      { Anniversary_Type_Id: req.params.id }, // Filter by Anniversay_Type_Id
      { $set: { Description } }, // Update fields
      { new: true, runValidators: true } // Run validators
    );
    if (!anniversaryType) {
      return res
        .status(404)
        .send("AnniversaryType not found or no changes made");
    }
    res.status(200).send(anniversaryType);
  } catch (error) {
    console.error(error); // Debugging statement
    res.status(400).send(error);
  }
});


// Delete an anniversary type by ID
router.delete("/:id", async (req, res) => {
  try {
    const anniversaryType = await AnniversaryType.deleteOne({
      Anniversary_Type_Id: req.params.id,
    });

    if (anniversaryType.deletedCount === 0) {
      return res.status(404).send("AnniversaryType not found");
    }
    if (!anniversaryType) {
      return res.status(404).send();
    }
    res.status(200).send(anniversaryType);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
