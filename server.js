const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000;
const { setupWebSocket } = require("./utils/webSocket");


const server = http.createServer(app);

  const wss = setupWebSocket(server);



const startServer = () => {
 
server.listen(port, "0.0.0.0", async () => {
 console.log("Listening on port " + port);



  const now = new Date();
  const formattedDatet = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
    hour12: true,
  }).format(now);
 
  console.log("server started at " + formattedDatet);
});
};

startServer();
