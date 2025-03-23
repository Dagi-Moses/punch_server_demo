require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Staff = require("../models/staff"); // Update with actual model path

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Function to generate random staff records
const generateStaff = async () => {
  const staffData = [];

  for (let i = 1; i <= 100; i++) {
    const staff = new Staff({
      Staff_No: faker.string.uuid(),
      Last_Name: faker.person.lastName(),
      First_Name: faker.person.firstName(),
      Middle_Name: faker.person.middleName(),
      Date_of_Birth: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
      Sex: faker.helpers.arrayElement(["M", "F"]),
      Religion: faker.helpers.arrayElement(["Christianity", "Islam", "Other"]),
      Health_Status: faker.helpers.arrayElement([
        "Healthy",
        "Minor Issues",
        "Chronic Condition",
      ]),
      Nationality: faker.location.country(),
      Town_Of_Origin: faker.location.city(),
      State_Of_Origin: faker.location.state(),
      Local_Government_Area: faker.location.city(),
      Former_Last_Name: faker.person.lastName(),
      Marital_Status: faker.number.int({ min: 0, max: 3 }),
      No_Of_Children: faker.number.int({ min: 0, max: 10 }),
      Title: faker.number.int({ min: 1, max: 10 }),
      Type: faker.number.int({ min: 1, max: 5 }),
      Level: faker.number.int({ min: 1, max: 15 }),
      Target: mongoose.Types.Decimal128.fromString(
        faker.finance.amount({ min: 10000, max: 1000000, dec: 2 })
      ),
    });

    staffData.push(staff);
  }

  try {
    await Staff.insertMany(staffData);
    console.log("✅ Successfully inserted 100 staff records!");
  } catch (err) {
    console.error("❌ Error inserting records:", err);
  }

  mongoose.connection.close(); // Close DB connection after inserting
};

// Run the function
generateStaff();
