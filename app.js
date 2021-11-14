const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var globalRoomId;
app.get("/", (req, res) => {
  if (req.query.link) res.redirect(`/${req.query.link}`);
  else res.render("route");
});

app.get("/favicon.ico", (req, res) => {
  return "favicon.ico";
});
app.get("/:roomid", (req, res) => {
  res.render("index");
  var roomId = req.params.roomid;
  globalRoomId = roomId;
});

details = {};
userAndRoom = {};

function createSocketioConnection() {
  io.on("connection", (socket) => {
    details[socket.id] = null;

    socket.on("login", (username) => {
      console.log(`${username} is connected !`);
      details[socket.id] = username;
      userAndRoom[socket.id] = [username, globalRoomId];

      socket.join(userAndRoom[socket.id][1]);
      console.log("joined on room : " + userAndRoom[socket.id][1]);
      console.log(userAndRoom);
      try {
        socket.to(userAndRoom[socket.id][1]).emit("user join", username);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("user chat", (msg, username) => {
      //   error when undifined
      try {
        socket.to(userAndRoom[socket.id][1]).emit("user msg", msg, username);
      } catch (e) {
        console.log(e);
      }
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
      //since undified is possible error may occur
      try {
        socket
          .to(userAndRoom[socket.id][1])
          .emit("user leave", details[socket.id]);
        console.log(`${details[socket.id]} is disconnected`);
      } catch (e) {
        console.log(e);
      }
    });
  });
}
createSocketioConnection();

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
