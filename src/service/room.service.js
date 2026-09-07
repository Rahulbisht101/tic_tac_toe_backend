const Room = require("../models/room.model");

const createRoomDB = async (data) => {
  const room = await Room.create(data);
  return room;
};

const getRoomById = async (id) => {
  const roomData = await Room.findById(id);
  return roomData;
};

const getRoom = async (id) => {
  let list = [];
  if (!!id) {
    list = Room.find({ owner_id: id });
  } else {
    list = Room.find();
  }
  return list;
};

const updateRoomDB = async (id, data) => {
  let roomData = Room.findByIdAndUpdate(id, data, {
    new: true,
  });
  return roomData;
};

module.exports = {
  createRoomDB,
  getRoomById,
  getRoom,
  updateRoomDB,
};
