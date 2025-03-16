require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const setupRoutes = require("./middleware/routings");
const app = express();
 


app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

setupRoutes(app);

// Allow requests from Flutter Web on Vercel
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend!" });
});



module.exports = app;



