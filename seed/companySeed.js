import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Company from "./models/Anniversary.js"; // Adjust path if needed


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Function to generate fake company data
const generateCompanyData = (id) => ({
  Company_No: id,
  Name: faker.company.name(),
  Company_Sector_Id: faker.number.int({ min: 1, max: 20 }), // Assuming 20 sectors
  Date: faker.date.past({ years: 10 }), // Random date in the past 10 years
  Address: faker.location.streetAddress(),
  Email: faker.internet.email(),
  Phone: faker.phone.number(),
  Fax: faker.phone.number(),
  Start_Date: faker.date.past({ years: 20 }),
  Image: Buffer.from(faker.image.url(), "base64"), // Dummy base64 image
  Description: faker.lorem.sentence(),
});

// Insert fake companies into the database
const seedCompanies = async () => {
  try {
    await Company.deleteMany(); // Clear existing data
    const companies = Array.from({ length: 20 }, (_, i) =>
      generateCompanyData(i + 1)
    );
    await Company.insertMany(companies);
    console.log("✅ Successfully seeded companies!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    mongoose.connection.close(); // Close connection after seeding
  }
};

seedCompanies();
