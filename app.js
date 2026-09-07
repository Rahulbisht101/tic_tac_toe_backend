require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/db");
const userRouter = require("./src/routes/user.routes");
const roomRouter = require("./src/routes/room.route");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);

app.use(express.json());
connectDB();
// Define a route for GET requests to the root URL
app.get("/", (req, res) => {
  res.send("Hello World from Express!");
});

app.use("/user", userRouter);
app.use("/room", roomRouter);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  try {
    // const token = socket.handshake.auth.token;
    // console.log("=socket.handshake.auth", socket.handshake.auth);

    // if (!token) {
    //   return next(new Error("Authentication required"));
    // }

    socket.user = token;

    next();
  } catch (error) {
    next();
    // next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id, socket);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);

    socket.to(roomId).emit("joined_room", {
      message: "User joined the room",
    });
    console.log(`${socket.id} joined ${roomId}`);
  });

  socket.on("send_table", (data, callback) => {
    console.log("Message:", data);

    socket.to(data.roomId).emit("receive_table", {
      message: data.message,
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
