require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const AnniversaryType = require("../models/anniversaryType");

// Connect to MongoDB
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const generateAnniversaryTypes = async () => {
  try {
   
    await AnniversaryType.deleteMany(); // Clear existing data

    const anniversaryTypes = [];

    for (let i = 1; i <= 20; i++) {
    let word = faker.word.noun();
      anniversaryTypes.push({
        Anniversary_Type_Id: i, // Ensure it's between 1-20
        Description: word.length <= 16 ? word : word.substring(0, 16),
      });
    }

    await AnniversaryType.insertMany(anniversaryTypes);
    console.log("✅ Successfully seeded Anniversary Types!");
  } catch (error) {
    console.error("❌ Error seeding Anniversary Types:", error);
  } finally {
    mongoose.connection.close();
  }
};

generateAnniversaryTypes();
