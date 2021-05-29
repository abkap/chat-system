const input = document.querySelector(".input-cls");
const btn = document.querySelector("button");
const msgContainer = document.querySelector(".msg");
const outgoingUl = document.querySelector(".outgoing-ul");
btn.addEventListener("click", (e) => {
  e.preventDefault();
});

function sendMsg() {
  if (input.value) {
    var msg = input.value;
    var li = document.createElement("li");
    li.textContent = msg;
    outgoingUl.appendChild(li);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    input.value = "";
  }
}

btn.addEventListener("click", sendMsg);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMsg();
  }
});
