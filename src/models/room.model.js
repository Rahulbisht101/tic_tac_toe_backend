const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    owner_id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "x",
    },
    code: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      required: true,
      default: "blue",
    },
    mode: {
      type: String,
      require: true,
      default: "bot",
    },
    other_user: {
      type: Object,
      default: null,
    },
    status: {
      type: String,
      default: "pending",
    },
    table: {
      type: [[Number]],
      required: false,
      default: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    },
    winner_id: {
      type: String,
      required: false,
    },
    winner_status: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
