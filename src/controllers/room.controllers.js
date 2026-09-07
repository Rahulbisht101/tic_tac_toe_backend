const {
  createRoomDB,
  getRoomById,
  getRoom,
  updateRoomDB,
} = require("../service/room.service");
const { checkWinner } = require("../utils/game");
const {
  createRoomValidation,
  finishRoomValidation,
  formatError,
} = require("../validations/room.validation");

const createRoom = async (req, res) => {
  const body = req?.body || {};
  const validation = createRoomValidation.safeParse(body);
  if (!validation.success) {
    return res.status(400).json({
      message: "Invalid data",
      error: formatError(validation),
    });
  }
  const roomData = validation.data;
  roomData.owner_id = req.user.id;
  if (roomData.mode == "user") {
    roomData.code = Math.random().toString(36).substring(2, 4);
    roomData.status = "pending";
  } else {
    roomData.other_user = {
      name: "Guest",
      id: null,
    };
    roomData.status = "in_game";
  }
  try {
    const room = await createRoomDB(roomData);
    res.status(200).json({
      status: true,
      message: "Room created successfuly",
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create room",
      data: error,
    });
  }
};

const joinRoom = async (req, res) => {
  const body = req?.body || {};

  let roomList = await getRoom();
  let code = body.code || "";
  console.log("=======", code);
  if (!!code) {
    let findRoom = roomList.find((e) => e?.code == code);
    console.log(roomList);

    if (
      !!findRoom &&
      findRoom?.status == "pending" &&
      findRoom.mode == "user" &&
      !findRoom.other_user
    ) {
      let updateRoom = await updateRoomDB(findRoom._id, {
        other_user: req.user,
        status: "in_game",
      });

      return res.status(200).json({
        status: true,
        data: updateRoom,
        message: "Room joined successfully",
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Room not found",
      });
    }
  } else {
    return res.status(200).json({
      status: false,
      message: "Please enter valid code",
    });
  }
};

const getRoomDetails = async (req, res) => {
  var id = req.params?.id || "";

  try {
    let roomData = await getRoomById(id);

    if (!!roomData) {
      return res.status(200).json({
        status: true,
        message: "Room Details Fetched Successfully",
        data: roomData,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "No room Found",
      });
    }
  } catch (error) {
    console.log("====ERROR", error);

    res.status(400).json({
      status: false,
      message: "No room Found",
    });
  }
};

const getRoomList = async (req, res) => {
  const id = req.user?.id;
  console.log(id);

  try {
    let roomList = await getRoom(id);
    res.status(200).json({
      success: true,
      data: roomList,
      message: "Room fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateTable = async (req, res) => {
  let { table, room_id } = req?.body || {};

  try {
    let roomData = await getRoomById(room_id);
    if (!roomData?._id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Room",
      });
    }

    let validation = finishRoomValidation.safeParse({
      room_id: room_id,
      table: table,
    });
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        error: formatError(validation),
      });
    }
    let gameResult = checkWinner(table);

    let updatedData = {
      status: !!gameResult ? "finished" : "in_game",
      table: table,
      winner_id: gameResult === "draw" || !gameResult ? null : req?.user?.id,
      winner_status: !gameResult
        ? ""
        : gameResult == "draw"
          ? "draw"
          : gameResult == roomData?.type
            ? "win"
            : "loose",
    };
    let roomRes = await updateRoomDB(room_id, updatedData);
    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: roomRes,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to update room",
    });
  }
};

module.exports = {
  createRoom,
  getRoomDetails,
  getRoomList,
  updateTable,
  joinRoom,
};
