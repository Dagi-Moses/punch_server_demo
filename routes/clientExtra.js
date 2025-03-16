// routes/clientExtra.js
const express = require("express");
const router = express.Router();
const ClientExtra = require("../models/clientExtra");
const WebSocket = require("ws");

function broadcast(channel, data, wss) {
 
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.channel === channel) {
      client.send(JSON.stringify(data));
      console.log(`Broadcasted to ${channel}: ${JSON.stringify(data)}`);
    }
  });
}


// Create a new client extra
router.post("/", async (req, res) => {
  try {
    const clientExtra = new ClientExtra(req.body);
    await clientExtra.save();
    res.status(201).send(clientExtra);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all client extras
router.get("/", async (req, res) => {
  try {
    const clientExtras = await ClientExtra.find({});
    res.status(200).send(clientExtras);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a client extra by ID
router.get("/:id", async (req, res) => {
  try {
    const clientExtra = await ClientExtra.findById(req.params.id);
    if (!clientExtra) {
      return res.status(404).send();
    }
    res.status(200).send(clientExtra);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a client extra by ID
router.patch("/:id", async (req, res) => {
  try {
   console.log("started extra", req.body);

    const clientExtra = await ClientExtra.findOneAndUpdate(
      { Client_No: req.params.id }, // Query to find the document by Client_No
      req.body, // Data to update
      { 
        new: true, // Return the updated document
        runValidators: true, // Apply validation rules
        upsert: true // Create the document if it doesn't exist
      }
    );
    if (!clientExtra) {
      return res.status(404).send();
    }
     broadcast(
       "clientExtra",
       {
         type: "UPDATE",
         data: clientExtra ,
       },
       req.app.locals.wss
     );
console.log('clientExtra', clientExtra);
    res.status(200).send(clientExtra);
  } catch (error) {
    console.log('error', error);
    res.status(400).send(error);
  }
});

// Delete a client extra by ID
router.delete("/:id", async (req, res) => {
  try {
    console.log("started deleting extra",req.params.id);
    const clientExtra = await ClientExtra.findByIdAndDelete(req.params.id);
    if (!clientExtra) {
        console.log("couldnt delete", req.params.id);
      return res.status(404).send();
      
    }
    
    broadcast(
      "clientExtra",
      { type: "DELETE", data: req.params.id },
      req.app.locals.wss
    );
    res.status(200).send(clientExtra);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    
  }
});

module.exports = router;