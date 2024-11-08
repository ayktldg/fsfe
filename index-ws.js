const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("/index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

/** Begin WebSocket */

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New connection");
  const numClients = wss.clients.size;
  console.log(`Number of clients: ${numClients}`);

  wss.broadcast(`${numClients} clients connected`);

  if (ws.readyState === WebSocket.OPEN) {
    ws.send("Welcome to the WebSocket server!");
  }

  ws.on("close", () => {
    console.log("Connection closed");
    console.log(`Number of clients: ${numClients}`);
    wss.broadcast(`${numClients} clients disconnected`);
  });
});

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};
