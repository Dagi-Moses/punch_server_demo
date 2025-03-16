const WebSocket = require("ws");
const url = require("url");
const app = require("../app");




function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });
    app.locals.wss = wss;
  wss.on("connection", (ws, req) => {
    const query = url.parse(req.url, true).query;
    ws.channel = query.channel;
    console.log(`Client connected to channel: ${ws.channel}`);

    ws.on("message", (message) =>
      console.log(`Message on ${ws.channel}: ${message}`)
    );
    ws.on("close", () =>
      console.log(`Client disconnected from channel: ${ws.channel}`)
    );
  });

  return wss;
}

module.exports = {  setupWebSocket };
