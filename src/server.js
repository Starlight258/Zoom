//백엔드(Back-end)
import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug"); //pug 사용
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public")); //public 연결하기
app.get("/", (req, res) => res.render("home")); //렌더링
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app); //express server
const wsServer = SocketIO(httpServer); //socket.io server

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    //인자, done함수
    console.log(roomName);
    setTimeout(() => {
      done("hello from the backend");
    }, 15000);
  });
});
// const sockets = []; //fake db

// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("Connected to Browser ✅");
//   socket.on("close", () => {
//     console.log("Disconnected from the Browser ❌");
//   });
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}:${message.payload}`)
//         );
//         break;
//       case "nickname":
//         socket["nickname"] = message.payload;
//         break;
//     }
//   });
// }); //연결시 함수 실행
httpServer.listen(3000, handleListen);
