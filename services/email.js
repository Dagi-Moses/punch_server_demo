const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const ENV = require("../config/config");
const Anniversary = require("../models/anniversary");
const AnniversaryType = require("../models/anniversaryType");

const logFilePath = path.join(__dirname, "lastExecution.log");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});



function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error while sending email:", error);

      // Retry sending email when internet is available
      retryWhenOnline(mailOptions);
      return;
    }
    console.log("Email sent successfully:", info.response);
    fs.writeFileSync(logFilePath, new Date().toISOString());
  });
}



async function retryWhenOnline(mailOptions) {
  const { default: isOnline } = await import("is-online"); // Correct way to access the default export
  console.log("No internet connection. Waiting for connectivity to retry...");

  // Continuously check for internet connection until available
  const interval = setInterval(async () => {
    const online = await isOnline(); // Call the function properly
    if (online) {
      console.log("Internet is back. Retrying email...");
      clearInterval(interval); // Stop checking once online
      sendEmail(mailOptions); // Retry sending the email
    } else {
      console.log("Still offline. Waiting...");
    }
  }, 10000); // Check every 10 seconds
}


async function sendUpcomingAnniversaries() {
  console.log("sendUpcomingAnniversaries function called");
  const now = new Date();
  // Convert the current date to West African Time (WAT) using timeZone
  const nowWAT = new Date(
    now.toLocaleString("en-US", { timeZone: "Africa/Lagos" })
  );
  // Calculate the start and end of the two-week period, starting two weeks from now
  const startOfFuturePeriod = new Date(nowWAT);
  startOfFuturePeriod.setDate(nowWAT.getDate() + 14 - nowWAT.getDay()); // Start of the week two weeks from now
  startOfFuturePeriod.setHours(0, 0, 0, 0); // Set time to midnight
  const endOfFuturePeriod = new Date(startOfFuturePeriod);
  endOfFuturePeriod.setDate(startOfFuturePeriod.getDate() + 6); // End of the two-week period
  endOfFuturePeriod.setHours(23, 59, 59, 999); // Set time to end of day

  const startOfFuturePeriodFormatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos", // Ensure WAT is used
  }).format(startOfFuturePeriod);

  const endOfFuturePeriodFormatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos", // Ensure WAT is used
  }).format(endOfFuturePeriod);

  // Dynamic subject line
  const subject = `Upcoming Punch Anniversaries for the period of ${startOfFuturePeriodFormatted} to ${endOfFuturePeriodFormatted}`;

  // Fetch all anniversaries without filtering by year
  const anniversaries = await Anniversary.find({});
  let upcomingAnniversaries = anniversaries
    .map((a) => {
      const anniversaryDate = new Date(a.Date);

      // Adjust to the current year and next year
      const currentYearAnniversary = new Date(anniversaryDate);
      currentYearAnniversary.setFullYear(nowWAT.getFullYear());

      const nextYearAnniversary = new Date(anniversaryDate);
      nextYearAnniversary.setFullYear(nowWAT.getFullYear() + 1);

      // Adjust both dates to WAT
      const currentYearAnniversaryWAT = new Date(
        currentYearAnniversary.toLocaleString("en-US", { timeZone: "Africa/Lagos" })
      );
      const nextYearAnniversaryWAT = new Date(
        nextYearAnniversary.toLocaleString("en-US", { timeZone: "Africa/Lagos" })
      );

      // Check if the anniversary falls within the future two-week period
      if (
        (currentYearAnniversaryWAT >= startOfFuturePeriod &&
          currentYearAnniversaryWAT <= endOfFuturePeriod) ||
        (nextYearAnniversaryWAT >= startOfFuturePeriod &&
          nextYearAnniversaryWAT <= endOfFuturePeriod)
      ) {
        // Return the matching anniversary with the correct date
        const thisYearAnniversary =
          currentYearAnniversaryWAT >= startOfFuturePeriod &&
            currentYearAnniversaryWAT <= endOfFuturePeriod
            ? currentYearAnniversaryWAT
            : nextYearAnniversaryWAT;
        return { ...a._doc, thisYearAnniversary };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => a.thisYearAnniversary - b.thisYearAnniversary);



  console.log("Found anniversaries:", upcomingAnniversaries.length);

  if (upcomingAnniversaries.length > 0) {
    const emailContentPromises = upcomingAnniversaries.map(async (a) => {
      const anniversaryType = await AnniversaryType.findOne({
        Anniversary_Type_Id: a.Anniversary_Type_Id,
      });

      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Africa/Lagos", // Ensure the formatted date is in WAT
      }).format(a.thisYearAnniversary);

      return `${a.Name}, Type: ${anniversaryType ? anniversaryType.Description : "Unknown"
        }, Date: ${formattedDate}. \n`;
    });

    // Wait for all promises to resolve
    const emailContentArray = await Promise.all(emailContentPromises);
    const emailContent = emailContentArray.join("\n");

    // Email options
    const mailOptions = {
      from: process.env.SMTP_USER,
      to:process.env.EMAIL_RECIPIENTS,
  

      subject: subject,
      text: emailContent,
      headers: { "X-Mailer": "Nodemailer" },
    };

    console.log("Sending email with content:", emailContent);

    sendEmail(mailOptions);


  } else {
    console.log("No upcoming anniversaries found for this period.");
  }
}



// Check if the task was missed
function getLastSundayAt9AM() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday

  // Calculate how many days ago the last Sunday was
  const daysSinceSunday = dayOfWeek === 0 ? 7 : dayOfWeek;

  // Create a new date object for last Sunday at 9:00 AM
  const lastSunday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysSinceSunday,
    9, 0, 0, 0 // 9 AM
  );

  return lastSunday;
}


function checkAndRunTask() {
  const lastSundayAt9AM = getLastSundayAt9AM();
  const now = new Date();

  if (fs.existsSync(logFilePath)) {
    const lastExecutionTime = new Date(fs.readFileSync(logFilePath, "utf8"));

    // Check if the task was executed after the last Sunday at 9 AM
    if (lastExecutionTime < lastSundayAt9AM && now > lastSundayAt9AM) {
      console.log(
        `Task not executed after ${lastExecutionTime}. Running now...`
      );
      sendUpcomingAnniversaries();
    } else {
      console.log(`Task already executed on ${lastExecutionTime}.`);
    }
  } else {
    console.log("No previous execution found. Running task...");
    sendUpcomingAnniversaries();
  }
}

module.exports = { checkAndRunTask, sendUpcomingAnniversaries };