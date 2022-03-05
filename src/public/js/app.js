//프론트엔드(Front-end)
const socket = io(); //백엔드 소켓io와 연결

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true; //처음에는 방 숨겨주기
let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`; //방 이름 바뀔수도있으므로
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomInput = form.querySelector("input");
  const nameInput = form.querySelector("#name"); //닉네임
  socket.emit("enter_room", roomInput.value, nameInput.value, showRoom); //이벤트와 인자(객체도 가능), 콜백함수
  roomName = roomInput.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

// function handleNicknameSubmit(event) {
//   event.preventDefault();
//   const input = welcome.querySelector("#name input");
//   socket.emit("nickname", input.value);
// }
// const nameForm = welcome.querySelector("#name");
// nameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} arrived!`);
});
socket.on("bye", (left) => {
  addMessage(`${left} left ㅠㅠ`);
});
socket.on("new_message", (msg) => addMessage(msg));
