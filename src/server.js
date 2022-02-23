//백엔드(Back-end)
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
const app = express();

app.set("view engine", "pug"); //pug 사용
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public")); //public 연결하기
app.get("/", (req, res) => res.render("home")); //렌더링
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocketServer({ server }); //http서버 위에 ws서버 만들기

wss.on("connection", (socket) => {
  console.log("Connected to Browser ✅");
  socket.on("close", () => {
    console.log("Disconnected from the Browser ❌");
  });
  socket.on("message", (message) => {
    console.log(message.toString("utf8"));
  });
  socket.send("hello!!!");
}); //연결시 함수 실행
server.listen(3000, handleListen);
