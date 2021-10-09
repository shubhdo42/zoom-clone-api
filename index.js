const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
let users = [];
const port = 3001;
app.get("/", (req, res) => {
  res.send("heloo");
});

const addUser = (userName, roomId) => {
  users.push({
    userName: userName,
    roomId: roomId,
  });
};

const userLeave = (userName) => {
  users = users.filter((user) => user.userName != userName);
};
const getRoomUsers = (roomId) => {
  return users.filter((user) => user.roomId == roomId);
};

io.on("connection", (socket) => {
  console.log("somene connected");
  socket.on("join-room", ({ roomId, userName }) => {
    console.log("user joined");
    console.log(roomId);
    console.log(userName);
    socket.join(roomId);
    addUser(userName, roomId);
    socket.to(roomId).emit("user-connected", userName);

    io.to(roomId).emit("all-users", getRoomUsers(roomId));
    socket.on("disconnect", () => {
      console.log("disconned");
      socket.leave(roomId);
      userLeave(userName);

      io.to(roomId).emit("all-users", getRoomUsers(roomId));
    });
  });
});

server.listen(port, () => {
  console.log("it does listen");
});
