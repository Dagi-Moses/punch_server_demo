
require("dotenv").config(); 
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Anniversary = require("../models/anniversary"); // Update with actual model path

// Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Function to generate random anniversary records
const generateAnniversaries = async () => {
  const anniversaryData = [];

  for (let i = 1; i <= 100; i++) {
    const randomDate = faker.date.past(20); // Random date in last 20 years
    const anniversary = new Anniversary({
      Anniversary_No: i,
      Name: faker.person.fullName(),
      Anniversary_Type_Id: faker.number.int({ min: 1, max: 20 }),
      Date: randomDate,
      Placed_By_Name: faker.person.fullName(),
      Placed_By_Address: faker.location.streetAddress(),
      Placed_By_Phone: faker.phone.number(),
      Friends: faker.person.fullName() + ", " + faker.person.fullName(),
      Associates: faker.person.fullName() + ", " + faker.person.fullName(),
      Paper_Id: faker.number.int({ min: 1, max: 20 }),

      Description: faker.lorem.sentence(),
      Image: Buffer.from(faker.string.alphanumeric(50), "base64"), // Dummy Base64 data
    });

    anniversaryData.push(anniversary);
  }

  try {
    await Anniversary.insertMany(anniversaryData);
    console.log("✅ Successfully inserted 100 anniversary records!");
  } catch (err) {
    console.error("❌ Error inserting records:", err);
  }

  mongoose.connection.close(); // Close DB connection after inserting
};

// Run the function
generateAnniversaries();
