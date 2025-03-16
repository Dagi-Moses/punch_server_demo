// routes/userRecord.js
const express = require("express");
const router = express.Router();
const UserRecord = require("../models/userRecord");
const WebSocket = require("ws");

function broadcast(channel, data, wss) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.channel === channel) {
      client.send(JSON.stringify(data));
      console.log(`Broadcasted to ${channel}: ${JSON.stringify(data)}`);
    }
  });
}


// Create a new user record entry
router.post("/", async (req, res) => {
  try {
    // Find the highest current Record_Id
    const lastRecord = await UserRecord.findOne()
      .sort({ Record_Id: -1 })
      .exec();
    const newRecordId = (await (lastRecord ? lastRecord.Record_Id : 0)) + 1;

    // Create a new UserRecord with the incremented Record_Id
    const userRecord = new UserRecord({
      ...req.body,
      Record_Id: newRecordId,
    });

    console.log("new Record:", JSON.stringify(userRecord, null, 2));

    // Save the new record to the database
    await userRecord.save();
  broadcast("userRecord", { type: "ADD", data: userRecord }, req.app.locals.wss);
    res.status(201).send(userRecord);
  } catch (error) {
    console.error("Error saving user record:", error);
    res.status(400).send(error);
  }
});

// Get all user record entries
router.get("/", async (req, res) => {
  try {
    const userRecords = await UserRecord.find({});
    res.status(200).send(userRecords);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a user record entry by ID
router.get("/:id", async (req, res) => {
  try {
    const userRecord = await UserRecord.findById(req.params.id);
    if (!userRecord) {
      return res.status(404).send();
    }
    res.status(200).send(userRecord);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a user record entry by ID
router.patch("/:id", async (req, res) => {
  try {
    const userRecord = await UserRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!userRecord) {
      return res.status(404).send();
    }
    res.status(200).send(userRecord);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete user records by staff_no
router.delete("/:staff_no", async (req, res) => {
  try {
    // Extract staff_no from request parameters
    const staffNo = req.params.staff_no;

    // Find and delete all user records with the given staff_no
    const result = await UserRecord.deleteMany({ staff_no: staffNo });

    // Check if any records were deleted
    if (!result) {
      return res
        .status(404)
        .send({ message: "No records found with the specified staff number." });
    }

    
    broadcast(
      "userRecord",
      { type: "DELETE", data: req.params.staff_no },
      req.app.locals.wss
    );
    res
      .status(200)
      .send({ message: `user record deleted ${result}` });
  } catch (error) {
    console.error("Error deleting user records:", error);
    res.status(500).send(error);
  }
});

module.exports = router;
