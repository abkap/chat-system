const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index");
});
detials = {};
io.on("connection", (socket) => {
  //   console.log(" user is connected");
  socket.on("login", (username) => {
    console.log(`${username} is connected !`);
    detials[socket.id] = username;
    console.log(detials);
  });
  socket.on("user chat", (msg, username) => {
    socket.broadcast.emit("user msg", msg, username);
    console.log(`${username} : ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log(`${detials[socket.id]} is disconnected`);
  });
});

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
