require("dotenv").config();
require("./server");
require("./config/database");
require("./services/backup")
require("./services/cronJobs");

const { checkAndRunTask } = require("./services/email");

checkAndRunTask();
