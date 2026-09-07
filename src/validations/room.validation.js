const { default: z } = require("zod");

const createRoomValidation = z.object({
  type: z.enum(["x", "o"]).default("x"),
  color: z.string().default("blue"),
  status: z.enum(["pending", "in_game", "finished"]).default("pending"),
  mode: z.enum(["bot", "user"]).default("bot"),
});

const finishRoomValidation = z.object({
  room_id: z.string(),
  table: z
    .array(z.array(z.number().min(-1).max(1)).min(3), "Invalid Table Format")
    .length(3),
});

const formatError = (data) => {
  let errorData = {};
  let res = (data?.error?.issues || [])?.map(
    (e) => (errorData[`${e?.path[0]}`] = e?.message),
  );

  return errorData;
};

module.exports = {
  createRoomValidation,
  finishRoomValidation,
  formatError,
};
