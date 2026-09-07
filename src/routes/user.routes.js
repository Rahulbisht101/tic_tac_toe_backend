const express = require("express");
const {
  getAlluser,
  register,
  deleteUser,
  getUserDetails,
  updateUserDetails,
  loginUser,
} = require("../controllers/user.controllers");
const { validateToken } = require("../middleware/user.middleware");
const upload = require("../middleware/upload");

const userRouter = express.Router();
userRouter.post("/register", upload.single("profilePic"), register);
userRouter.post("/login", loginUser);

userRouter.get("/", validateToken, getAlluser);
userRouter.get("/:id", validateToken, getUserDetails);
userRouter.post(
  "/",
  validateToken,
  upload.single("profilePic"),
  updateUserDetails,
);

userRouter.delete("/:id", validateToken, deleteUser);

module.exports = userRouter;
