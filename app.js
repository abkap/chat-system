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
  //   console.log(`room id(/:roomid) : ${roomId}`);
});

details = {};
userAndRoom = {};

function createSocketioConnection() {
  io.on("connection", (socket) => {
    //   console.log(" user is connected");
    // as soon as the connection is avialable
    // details[socket.id] = null;
    // console.log(details);

    socket.on("login", (username) => {
      console.log(`${username} is connected !`);
      details[socket.id] = username;
      userAndRoom[socket.id] = [username, globalRoomId];
      //   console.log(details);
      socket.join(userAndRoom[socket.id][1]);
      console.log("joined on room : " + userAndRoom[socket.id][1]);
      console.log(userAndRoom);
    });

    socket.on("user chat", (msg, username) => {
      // socket.broadcast.emit("user msg", msg, username);
      socket.to(userAndRoom[socket.id][1]).emit("user msg", msg, username);
    });

    // while typing
    socket.on("typing event", (inputValue, username) => {
      // comses error due to undifined
      try {
        socket
          .to(userAndRoom[socket.id][1])
          .emit("typing event", inputValue, username);
      } catch (e) {
        console.log(e);
      }
    });
    // final
    socket.on("disconnect", () => {
      console.log(`${details[socket.id]} is disconnected`);
    });
  });
}
createSocketioConnection();

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
