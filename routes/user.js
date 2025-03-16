// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const WebSocket = require("ws");

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
    // Create the user object from the request body
    const user = new User(req.body);

    // Save the user to the database and wait for the save operation to complete
    const savedUser = await user.save(); // Ensure MongoDB assigns the _id here

    // Check if the savedUser has an _id (which it should after saving)
    if (!savedUser._id) {
      throw new Error("User ID was not generated after saving.");
    }

    // Now broadcast the saved user (with the _id)
    broadcast("auth", { type: "ADD", data: savedUser }, req.app.locals.wss);

    // Send a success response with the saved user
    res.status(201).send(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).send(error);
  }
});


router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
     broadcast(
       "auth",
       { type: "UPDATE", data: user },
       req.app.locals.wss
     );
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    broadcast(
      "auth",
      { type: "DELETE", data: req.params.id },
      req.app.locals.wss
    );
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
