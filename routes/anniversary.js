// anniversary route

const express = require("express");
const router = express.Router();
const Anniversary = require("../models/anniversary");
const Paper = require("../models/paper");
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

// Get all anniversariesß
router.get("/", async (req, res) => {
  try {
    console.log('getting');
    const anniversaries = await Anniversary.find();
    res.json(anniversaries);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});


// router.get("/", async (req, res) => {
//   try {
//     // Fetch all the papers to validate Paper_Id
//     const papers = await Paper.find();
//     const validPaperIds = papers.map((paper) => paper.Paper_Id);

//     // Fetch all anniversaries
//     const anniversaries = await Anniversary.find();

//     // Modify the Placed_By field to ensure Paper_Id is valid
//     anniversaries.forEach((anniversary) => {
//       if (anniversary.Placed_By) {
//         anniversary.Placed_By.forEach((placedBy) => {
//           if (!validPaperIds.includes(placedBy.Paper_Id)) {
//             // Set invalid Paper_Id to 4 (Unknown)
//             placedBy.Paper_Id = 4;
//           }
//         });
//       }
//     });

//     // Return the modified anniversaries
//     res.json(anniversaries);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: err.message });
//   }
// });

router.get("/last", async (req, res) => {
  try {
    console.log("Getting the last anniversary");
    const lastAnniversary = await Anniversary.findOne()
      .sort({ Anniversary_No: -1 })
      .exec();
    if (!lastAnniversary) {
      return res.status(404).json({ message: "No anniversaries found" });
    }
    res.json(lastAnniversary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});



// Create a new anniversary
router.post("/", async (req, res) => {
  try {
    // Validate input data
    const {
      Name,
      Anniversary_Type_Id,
      Date,
    } = req.body;

    // Check if at least one required field is provided
    if (
      !Name &&
      !Anniversary_Type_Id &&
      !Date 
     
      
    ) {
      return res.status(400).json({
        message: "At least one of the required fields must be provided.",
      });
    }

    // Find the highest Anniversary_No
    const highestAnniversary = await Anniversary.findOne({})
      .sort({ Anniversary_No: -1 })
      .exec();

    // Increment the highest Anniversary_No by 1
    const newAnniversaryNo = highestAnniversary
      ? highestAnniversary.Anniversary_No + 1
      : 1; // Start from 1 if there are no existing records

    // Create a new Anniversary with the incremented Anniversary_No
    const anniversary = new Anniversary({
      ...req.body,
      Anniversary_No: newAnniversaryNo,
    });

    // Save the new Anniversary to the database
    const newAnniversary = await anniversary.save();

    // Broadcast the new anniversary
    broadcast(
      "anniversary",
      { type: "ADD", data: newAnniversary },
      req.app.locals.wss
    );

    res.status(201).json(newAnniversary);
    console.debug("Anniversary created: " + newAnniversary);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.debug("Error: " + err.message);
  }
});

// Update anniversary
router.patch("/:id", async (req, res) => {
  try {
    console.log(req.body);
    // const updatedAnniversary = await res.anniversary.save();
    const updatedAnniversary = await Anniversary.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedAnniversary) {
      return res.status(404).send();
    }
    broadcast(
      "anniversary",
      { type: "UPDATE", data: updatedAnniversary },
      req.app.locals.wss
    );
    res.json(updatedAnniversary);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete anniversary
router.delete("/:id", async (req, res) => {
  try {
    console.log('deleting');
    const anniversary = await Anniversary.findByIdAndDelete(req.params.id);
    if (!anniversary) {
      return res.status(404).json({ message: "Anniversary not found" });
    }
    broadcast(
      "anniversary",
      { type: "DELETE", data: req.params.id },
      req.app.locals.wss
    );
    res.json({ message: "Deleted Anniversary" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("error " + err.message);
  }
});


module.exports = router;
