var socket = io();
const container = document.querySelector(".container");
const input = document.querySelector(".input-cls");
const btn = document.querySelector(".primary-send-button");
const msgContainer = document.querySelector(".msg");
const incomingMsg = document.querySelector(".incoming-msg");
const outgoingMsg = document.querySelector(".outgoing-msg");
const outgoingUl = document.querySelector(".outgoing-ul");
const incomingUl = document.querySelector(".incoming-ul");
const starterMsg = document.querySelector(".starter-msg");
const continueButton = document.querySelector(".continue-button");
const usernameInput = document.querySelector(".username-input");
const usernameContainer = document.querySelector(".body");

function sendUserLoginSignal() {
  username = usernameInput.value;
  if (username.length >= 3) {
    socket.emit("login", username);
    usernameContainer.style.display = "none";
    container.style.display = "flex";
  }
}

continueButton.addEventListener("click", sendUserLoginSignal);
usernameInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") sendUserLoginSignal();
});

// when the user connects

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
  div.classList.add("incoming-msg");
  ul.classList.add("incoming-ul");
  div2.appendChild(span);
  div2.appendChild(li);
  ul.appendChild(div2);
  div.appendChild(ul);
  msgContainer.appendChild(div);
  msgContainer.scrollTop = msgContainer.scrollHeight;
}
function sendMsg() {
  if (input.value) {
    starterMsg.remove();
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
// typing
input.addEventListener("input", () => {
  socket.emit("typing event", input.value, username);
});

function createTyping(username) {
  var li = document.createElement("li"); //for msg
  var span = document.createElement("span"); //for username
  var div = document.createElement("div");
  var div2 = document.createElement("div"); //div containing span and li
  var ul = document.createElement("ul"); //for ul

  li.textContent = "typing...";

  span.textContent = username;

  div2.classList.add("person-msg");
  ul.classList.add("incoming-ul");
  div.classList.add("incoming-msg");
  div.classList.add("typing-div");
  div2.appendChild(span);
  div2.appendChild(li);
  ul.appendChild(div2);
  div.appendChild(ul);
  msgContainer.appendChild(div);
  msgContainer.scrollTop = msgContainer.scrollHeight;
}

// remove typing func

// recieving typing event
var isShowing = false;
var timeoutFunc;
socket.on("typing event", (inputValue, username) => {
  if (!isShowing) {
    // show
    createTyping(username);
  }

  // dont show more than once
  isShowing = true;

  if (timeoutFunc != undefined) {
    clearTimeout(timeoutFunc);
  }

  timeoutFunc = setTimeout(() => {
    var typing = document.querySelector(".typing-div");
    if (typing) typing.remove();
    isShowing = false;
  }, 1000);
});

// when user joins
socket.on("user join", (username) => {
  createUserJoin(username);
});

function createUserJoin(username) {
  const div = document.createElement("div");
  const ul = document.createElement("ul");
  const li = document.createElement("li");

  li.textContent = `${username} joined`;

  div.classList.add("user-join");

  ul.appendChild(li);
  div.appendChild(ul);
  msgContainer.appendChild(div);
  console.log(div);
  msgContainer.scrollTop = msgContainer.scrollHeight;
}
