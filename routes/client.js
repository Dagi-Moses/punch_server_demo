// routes/client.js
const express = require("express");
const router = express.Router();
const Client = require("../models/client");
const ClientExtra = require("../models/clientExtra");
const WebSocket = require("ws");

// Broadcast utility function for specific channels
function broadcast(channel, data, wss) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.channel === channel) {
      client.send(JSON.stringify(data));
      console.log(`Broadcasted to ${channel}: ${JSON.stringify(data)}`);
    }
  });
}
router.post("/", async (req, res) => {
  try {
    const { client, clientExtra } = req.body;

    // Find the highest clientNo
    const highestClient = await Client.findOne().sort({ Client_No: -1 }).exec();
    const newClientNo = await highestClient ? highestClient.Client_No + 1 : 1;

    // Extract client and clientExtra data from the request body
    
    // Create new Client with the incremented clientNo
    const newClient = new Client({
      ...client,
      Client_No: newClientNo,

      // Add any other fields here
    });

    // Create new ClientExtra with the same clientNo
    const newClientExtra = new ClientExtra({
      ...clientExtra,
      Client_No: newClientNo,

      // Add any other fields here
    });

    // Save both Client and ClientExtra to the database
    await newClient.save();
    await newClientExtra.save();
    broadcast("client", { type: "ADD", data: newClient }, req.app.locals.wss);
    broadcast(
      "clientExtra",
      { type: "ADD", data: newClientExtra },
      req.app.locals.wss
    );
    // Send a successful response
    res.status(201).json({
      message: "Client and ClientExtra added successfully!",
      client: newClient,
      clientExtra: newClientExtra,
    });
  } catch (error) {
    console.error("Error adding client:", error);
    res.status(500).json({ message: "Failed to add client", error });
  }
});
// Get all clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find({});
    res.status(200).send(clients);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a client by ID
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).send();
    }
    res.status(200).send(client);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a client by ID
router.patch("/:id", async (req, res) => {

  try {
    
    console.log("started client", req.body);
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!client) {
      return res.status(404).send();
    }
    broadcast(
      "client",
      { type: "UPDATE", data: client },
      req.app.locals.wss
    );
    res.status(200).send(client);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Delete a client by ID
router.delete("/:id", async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).send();
    }
    broadcast(
      "client",
      { type: "DELETE", data: req.params.id },
      req.app.locals.wss
    );
    res.status(200).send(client);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
