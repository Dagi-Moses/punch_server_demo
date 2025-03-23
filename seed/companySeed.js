
require("dotenv").config(); 
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Company = require("../models/company"); // Update with actual model path
const CompanyExtra = require("../models/companyExtra"); // Update with actual model path

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

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

// Function to generate corresponding CompanyExtra data
const generateCompanyExtraData = (companyNo) => ({
  Company_No: companyNo,
  Managing_Director: faker.person.fullName(),
  Corporate_Affairs: faker.person.fullName(),
  Media_Manager: faker.person.fullName(),
  Friends: faker.company.name(),
  Competitors: faker.company.name(),
  Directors: faker.person.fullName(),
});

// Insert fake companies and corresponding company extras
const seedCompanies = async () => {
  try {
    await Company.deleteMany(); // Clear existing company data
    await CompanyExtra.deleteMany(); // Clear existing company extra data

    const companies = Array.from({ length: 20 }, (_, i) =>
      generateCompanyData(i + 1)
    );
    await Company.insertMany(companies);

    const companyExtras = companies.map((company) =>
      generateCompanyExtraData(company.Company_No)
    );
    await CompanyExtra.insertMany(companyExtras);

    console.log("✅ Successfully seeded companies and company extras!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    mongoose.connection.close(); // Close connection after seeding
  }
};

// Run the seeding function
seedCompanies();
