const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static("public"));
// app.get("/", (req, res) => {
//   res.render("index");
// });
var globalRoomId;
app.get("/:roomid", (req, res) => {
  res.render("index");
  var roomId = req.params.roomid;
  globalRoomId = roomId;
  console.log(`room id(/:roomid) : ${roomId}`);
});

details = {};
userAndRoom = {};

function createSocketioConnection() {
  io.on("connection", (socket) => {
    //   console.log(" user is connected");
    socket.on("login", (username) => {
      console.log(`${username} is connected !`);
      details[socket.id] = username;
    });

    socket.join(globalRoomId);

    socket.on("user chat", (msg, username) => {
      // socket.broadcast.emit("user msg", msg, username);
      socket.to(globalRoomId).emit("user msg", msg, username);
    });

    socket.on("disconnect", () => {
      console.log(`${details[socket.id]} is disconnected`);
    });
  });
}
createSocketioConnection();

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
