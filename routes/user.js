// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const WebSocket = require("ws");

const bcrypt = require("bcryptjs");

function broadcast(channel, data, wss) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.channel === channel) {
      client.send(JSON.stringify(data));
      console.log(`Broadcasted to ${channel}: ${JSON.stringify(data)}`);
    }
  });
}

const saltRounds = 10; 
// router.post("/", async (req, res) => {
//   try {
//     const user = new User(req.body);
//     const savedUser = await user.save();
//     if (!savedUser._id) {
//       throw new Error("User ID was not generated after saving.");
//     }

//     broadcast("auth", { type: "ADD", data: savedUser }, req.app.locals.wss);

//     res.status(201).send(savedUser);
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(400).send(error);
//   }
// });

// ✅ CREATE USER (POST)
router.post("/", async (req, res) => {
  try {
    const { password, ...otherData } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      
      ...otherData,
      password: hashedPassword, // Store hashed password
    });

    const savedUser = await user.save();
    if (!savedUser._id) {
      throw new Error("User ID was not generated after saving.");
    }

    // Remove password before broadcasting & responding
    const { password: _, ...safeUser } = savedUser.toObject();
    safeUser.password = "*****";
    broadcast("auth", { type: "ADD", data: safeUser }, req.app.locals.wss);

    res.status(201).json(safeUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ UPDATE USER (PATCH)
router.patch("/:id", async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If updating password, hash it before storing
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove password before broadcasting & responding
    const { password: _, ...safeUser } = user.toObject();
 safeUser.password = "*****";
    broadcast("auth", { type: "UPDATE", data: safeUser }, req.app.locals.wss);
    res.status(200).json(safeUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ error: error.message });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }

    // Mask or remove password before sending response
    const { password: _, ...safeUser } = user.toObject();
    safeUser.password = "*****"; // Mask password

    res.status(200).send(safeUser);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    // Mask or remove passwords before sending response
    const safeUsers = users.map((user) => {
      const { password: _, ...safeUser } = user.toObject();
      safeUser.password = "*****"; // Mask password
      return safeUser;
    });

    res.status(200).send(safeUsers);
  } catch (error) {
    res.status(500).send(error);
  }
});


// router.patch("/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!user) {
//       return res.status(404).send();
//     }
//      broadcast(
//        "auth",
//        { type: "UPDATE", data: user },
//        req.app.locals.wss
//      );
//     res.status(200).send(user);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });


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
