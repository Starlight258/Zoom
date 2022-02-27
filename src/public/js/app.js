//프론트엔드(Front-end)
const socket = io(); //백엔드 소켓io와 연결

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(msg) {
  console.log(`The backend says:`, msg);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, backendDone); //이벤트와 인자(객체도 가능), 콜백함수
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
