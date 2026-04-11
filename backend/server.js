const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// 🔥 STORE SESSION DATA
const sessions = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
    console.log(`User joined session: ${sessionId}`);

    // Send existing data
    if (sessions[sessionId]) {
      socket.emit("tasks-updated", sessions[sessionId].tasks || []);
      socket.emit("connections-updated", sessions[sessionId].connections || []);
    }
  });

  socket.on("update-tasks", ({ sessionId, tasks }) => {
    if (!sessions[sessionId]) sessions[sessionId] = {};

    sessions[sessionId].tasks = tasks;

    io.to(sessionId).emit("tasks-updated", tasks);
  });

  socket.on("update-connections", ({ sessionId, connections }) => {
    if (!sessions[sessionId]) sessions[sessionId] = {};

    sessions[sessionId].connections = connections;

    io.to(sessionId).emit("connections-updated", connections);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});