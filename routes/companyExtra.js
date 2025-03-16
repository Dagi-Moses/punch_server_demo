// routes/companyExtra.js
const express = require("express");
const router = express.Router();
const CompanyExtra = require("../models/companyExtra");
const WebSocket = require("ws");

function broadcast(channel, data, wss) {
  console.log(`Preparing to broadcast to ${channel}: ${JSON.stringify(data)}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.channel === channel) {
      client.send(JSON.stringify(data));
      console.log(`Broadcasted to ${channel}: ${JSON.stringify(data)}`);
    }
  });
}
// Create a new company extra
router.post("/", async (req, res) => {
  try {
    const companyExtra = new CompanyExtra(req.body);
    await companyExtra.save();
    res.status(201).send(companyExtra);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all company extras
router.get("/", async (req, res) => {
  try {
    const companyExtras = await CompanyExtra.find({});
    res.status(200).send(companyExtras);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a company extra by ID
router.get("/:id", async (req, res) => {
  try {
    const companyExtra = await CompanyExtra.findById(req.params.id);
    if (!companyExtra) {
      return res.status(404).send();
    }
    res.status(200).send(companyExtra);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a company extra by ID
router.patch("/:id", async (req, res) => {
  try {
        console.log("starting companyExtra ", req.body);
    const companyExtra = await CompanyExtra.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!companyExtra) {
      return res.status(404).send();
    }
     broadcast(
       "companyExtra",
       { type: "UPDATE", data: companyExtra },
       req.app.locals.wss
     );
    res.status(200).send(companyExtra);
  } catch (error) {
     console.log(error);
    res.status(400).send(error);
  }
});

// Delete a company extra by ID
router.delete("/:id", async (req, res) => {
  try {
    const companyExtra = await CompanyExtra.findByIdAndDelete(req.params.id);
    if (!companyExtra) {
      return res.status(404).send();
    }
    res.status(200).send(companyExtra);
    broadcast(
      "companyExtra",
      { type: "DELETE", data: req.params.id },
      req.app.locals.wss
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
