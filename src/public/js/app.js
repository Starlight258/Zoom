//프론트엔드(Front-end)
const frontSocket = new WebSocket(`ws://${window.location.host}`);
//소켓: 서버로의 연결
frontSocket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});
frontSocket.addEventListener("message", (message) => {
  console.log("New message:", message.data);
});

frontSocket.addEventListener("close", () => {
  console.log("Disconnected to Server ❌");
});

setTimeout(() => {
  frontSocket.send("hello from the browser!");
}, 10000); //10초 뒤에 메세지 보내기
