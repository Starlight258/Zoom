import express from "express";

const app = express();

app.set("view engine", "pug"); //pug 사용
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public")); //public 연결하기
app.get("/", (req, res) => res.render("home")); //렌더링
app.get("/*", (req, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);
