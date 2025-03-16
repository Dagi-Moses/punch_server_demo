const cron = require("node-cron");
const { sendUpcomingAnniversaries } = require("./email");

function scheduleCronJobs() {
  cron.schedule("0 9 * * 0", async () => {
    
if (process.env.NODE_ENV === ENV.PRODUCTION) {
 await sendUpcomingAnniversaries();
 console.log("Scheduled task executed: sending upcoming anniversaries");
} else {
  console.log("Skipping sending Upcoming on local development machine");
}
   
  });
}

scheduleCronJobs();


