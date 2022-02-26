//프론트엔드(Front-end)
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const frontSocket = new WebSocket(`ws://${window.location.host}`);
//소켓: 서버로의 연결
function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}
frontSocket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});
frontSocket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

frontSocket.addEventListener("close", () => {
  console.log("Disconnected to Server ❌");
});

function handleSubmit(event) {
  event.preventDefault(); //기본동작 방지
  const input = messageForm.querySelector("input");
  frontSocket.send(makeMessage("new_message", input.value)); //메세지 보내기
  // 내가 보낸거 보여주기
  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  messageList.append(li);
  input.value = "";
}
function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  frontSocket.send(makeMessage("nickname", input.value));
  input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
