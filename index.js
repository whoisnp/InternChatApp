var express = require("express");
var http = require("http");

var app = express();
var server = http.createServer(app);

var io = require("socket.io")(server);
var path = require("path");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/users", (req, res) => {
  console.log(users);
  res.render(__dirname + "/public/users.html", { users: users });
});
app.get("/dum-e-users", (req, res) => {
  console.log(dummyusers);
  res.render(__dirname + "/public/dum-e-users.html", {
    dummyusers: dummyusers,
  });
});
app.post("/create-user", (req, res) => {
  var name = req.body.name;
  res.render(__dirname + "/public/chat.html", { name: name });
});
var name;
var users = [];
var dummyusers = [
  "Leanne Graham",
  "Ervin Howell",
  "Clementine Bauch",
  "Patricia Lebsack",
  "Chelsey Dietrich",
];

io.on("connection", (socket) => {
  console.log("new user connected");

  socket.on("joining msg", (username) => {
    name = username;
    users.push(`${name}`);
    io.emit("chat message", `---${name} joined the chat---`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const index = users.indexOf(`${name}`);
    if (index > -1) {
      users.splice(index, 1);
    }
    io.emit("chat message", `---${name} left the chat---`);
  });
  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg); //sending message to all except the sender
  });
});

server.listen(3000, () => {
  console.log("Server listening on :3000");
});
