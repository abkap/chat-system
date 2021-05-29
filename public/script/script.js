var socket = io();

const input = document.querySelector(".input-cls");
const btn = document.querySelector("button");
const msgContainer = document.querySelector(".msg");
const incomingMsg = document.querySelector(".incoming-msg");
const outgoingMsg = document.querySelector(".outgoing-msg");
const outgoingUl = document.querySelector(".outgoing-ul");
const incomingUl = document.querySelector(".incoming-ul");
var username = window.prompt("username");
// when the user connects
socket.emit("login", username);

btn.addEventListener("click", (e) => {
  e.preventDefault();
});

function recieveMsg(msg, username) {
  var li = document.createElement("li");
  var span = document.createElement("span");
  var div = document.createElement("div");
  var div2 = document.createElement("div");
  var ul = document.createElement("ul");

  li.textContent = msg;
  span.textContent = username;

  div2.classList.add("person-msg");
  ul.classList.add("incoming-msg");
  div2.appendChild(span);
  div2.appendChild(li);
  ul.appendChild(div2);
  div.appendChild(ul);
  msgContainer.appendChild(div);
  msgContainer.scrollTop = msgContainer.scrollHeight;
}
function sendMsg() {
  if (input.value) {
    var msg = input.value;
    // event send msg form client side to server
    socket.emit("user chat", msg, username);

    var li = document.createElement("li");
    var div = document.createElement("div");
    var ul = document.createElement("ul");
    div.classList.add("outgoing-msg");
    ul.classList.add("outgoing-ul");
    li.textContent = msg;
    ul.appendChild(li);
    div.appendChild(ul);
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    input.value = "";
  }
}
socket.on("user msg", (msg, username) => {
  recieveMsg(msg, username);
});

btn.addEventListener("click", sendMsg);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMsg();
  }
});
