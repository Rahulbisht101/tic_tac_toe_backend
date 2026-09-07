const express = require("express");
const {
  createRoom,
  getRoomDetails,
  getRoomList,
  updateTable,
  joinRoom,
} = require("../controllers/room.controllers");
const { validateToken } = require("../middleware/user.middleware");
const roomRouter = express.Router();

roomRouter.post("/create", validateToken, createRoom);
roomRouter.post("/join", validateToken, joinRoom);

roomRouter.get("/:id", validateToken, getRoomDetails);
roomRouter.get("/", validateToken, getRoomList);
roomRouter.post("/updateTable", validateToken, updateTable);
module.exports = roomRouter;
