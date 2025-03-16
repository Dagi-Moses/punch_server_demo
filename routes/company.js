
const express = require("express");
const router = express.Router();
const Company = require("../models/company");
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
// Create
router.post("/", async (req, res) => {
  try {
    const { company, companyExtra } = req.body;

    // Find the highest clientNo
    const highestCompany = await Company.findOne().sort({ Company_No: -1 }).exec();
    const newCompanyNo = await highestCompany ? highestCompany.Company_No + 1 : 1;

    // Extract client and clientExtra data from the request body
    
    // Create new Client with the incremented clientNo
    const newCompany = new Company({
      ...company,
      Company_No: newCompanyNo,

      // Add any other fields here
    });

    // Create new ClientExtra with the same clientNo
    const newCompanyExtra = new CompanyExtra({
      ...companyExtra,
      Company_No: newCompanyNo,

      // Add any other fields here
    });

    // Save both Client and ClientExtra to the database
    await newCompany.save();
    await newCompanyExtra.save();
    broadcast("company", { type: "ADD", data: newCompany }, req.app.locals.wss);
    broadcast(
      "companyExtra",
      { type: "ADD", data: newCompanyExtra },
      req.app.locals.wss
    );
    // Send a successful response
    res.status(201).json({
      message: "Company and CompanyExtra added successfully!",
      company: newCompany,
      companyExtra: newCompanyExtra,
    });
  } catch (error) {
    console.error("Error adding company:", error);
    res.status(500).json({ message: "Failed to add company", error });
  }
});
// Get all clients

// Get all companies
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a company by ID
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).send();
    }
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a company by ID
router.patch("/:id", async (req, res) => {
  try {
     console.log("starting company ",req.body);
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!company) {
      return res.status(404).send();
    }
     broadcast(
       "company",
       { type: "UPDATE", data: company },
       req.app.locals.wss
     );
    res.status(200).send(company);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Delete a company by ID
router.delete("/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).send();
    }
    res.status(200).send(company);
    broadcast(
      "company",
      { type: "DELETE", data: req.params.id },
      req.app.locals.wss
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
