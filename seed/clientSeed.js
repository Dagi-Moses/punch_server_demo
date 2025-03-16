require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Client = require("../models/client"); // Update the path if needed

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

async function seedClients() {
  try {
    // Remove existing clients
    await Client.deleteMany();

    let clients = [];

    for (let i = 1; i <= 20; i++) {
      clients.push({
        Client_No: i,
        Title_Id: faker.number.int({ min: 1, max: 10 }),
        Last_Name: faker.person.lastName(),
        First_Name: faker.person.firstName(),
        Middle_Name: faker.person.firstName(),
        Date_Of_Birth: faker.date.past({ years: 50, refDate: "2000-01-01" }), // Past 50 years from 2000
        Telephone: faker.phone.number(), // ✅ Updated phone method
        Email: faker.internet.email(),
        Place_Of_Work: faker.company.name(), // ✅ company.companyName() → company.name()
        Friends: faker.person.fullName() + ", " + faker.person.fullName(),
        Associates: faker.person.fullName() + ", " + faker.person.fullName(),
        Address: faker.location.streetAddress(), // ✅ address.streetAddress() → location.streetAddress()
        Image: Buffer.from(faker.string.alphanumeric(50), "base64"), // ✅ image.imageUrl() → image.url()
        Description: faker.lorem.sentence(),
      });
    }

 

    await Client.insertMany(clients);
    console.log("Client data seeded successfully");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedClients();
