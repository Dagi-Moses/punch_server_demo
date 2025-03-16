// routes/title.js
const express = require("express");
const router = express.Router();
const Title = require("../models/title");

  // Create a new title entry
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    
    // Find the document with the highest Title_Id
    const highestTitle = await Title.findOne({})
      .sort({ Title_Id: -1 })
      .exec();

    // Start from 1 if there are no existing records, otherwise increment by 1
    const newTitleId = highestTitle ? highestTitle.Title_Id + 1 : 1;
    
    // Debugging statement to check the computed ID
    console.log(`New Title_Id: ${newTitleId}`);

    // Create a new Title with the incremented ID
    const title = new Title({
      Title_Id: newTitleId,
      Description: req.body.Description,
    });

    // Save the new Title to the database
    await title.save();
    res.status(201).send(title);
  } catch (error) {
    console.error(error); // Debugging statement
    res.status(400).send(error);
  }
});

// Get all title entries
router.get("/", async (req, res) => {
  try {
    const titles = await Title.find({});
    res.status(200).send(titles);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a title entry by ID
router.get("/:id", async (req, res) => {
  try {
    const title = await Title.findById(req.params.id);
    if (!title) {
      return res.status(404).send();
    }
    res.status(200).send(title);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a title entry by ID
router.patch("/:id", async (req, res) => {
  try {
    const { Description } = req.body;
    console.log("Received update data:", Description);
    // Update the document by Anniversay_Type_Id
    const title = await Title.findOneAndUpdate(
      { Title_Id: req.params.id }, // Filter by Anniversay_Type_Id
      { $set: { Description } }, // Update fields
      { new: true, runValidators: true } // Run validators
    );

    if (!title) {
      return res
        .status(404)
        .send("title not found or no changes made");
    }
    // Fetch the updated document to return it
    res.status(200).send(title);
  } catch (error) {
    console.error(error); // Debugging statement
    res.status(400).send(error);
  }
});


// Delete a title entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const title = await Title.deleteOne({
      Title_Id: req.params.id,
    });
    if (!title) {
      return res.status(404).send();
    }
    res.status(200).send(title);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
