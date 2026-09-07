const User = require("../models/user.model");
const {
  getUser,
  createUser,
  deleteUserDB,
  getUserById,
  updateUser,
  getUserByMail,
} = require("../service/user.service");
const { generateToken } = require("../utils/jwt");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const {
  registerValidation,
  updateValidation,
  loginValidation,
} = require("../validations/user.validation");
const jsonWebToken = require("jsonwebtoken");
const getAlluser = async (req, res) => {
  const userList = await getUser();

  res.status(200).json({
    success: true,
    data: {
      users: userList,
    },
    message: "Users fetch Successfully",
  });
};

const loginUser = async (req, res) => {
  let bodyData = req.body || {};
  let validation = loginValidation.safeParse(bodyData);
  if (!validation.success) {
    let errorData = {};
    validation.error?.issues?.map(
      (e) => (errorData[`${e.path[0]}`] = e?.message),
    );
    return res.status(400).json({
      success: false,
      data: errorData,
      message: "Invalid Request",
    });
  }
  let userData = await getUserByMail(validation.data.email);
  if (!userData || userData?.password != validation.data.password) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  let token = await generateToken({
    id: userData?._id,
    email: userData?.email,
  });

  res.status(200).json({
    success: true,
    data: { user: userData, token: token },
    message: "Login Successfull",
  });
};

const register = async (req, res) => {
  const { name, email, age, password, confirmPassword, profilePic } =
    req.body || {};
  const body = { name, email, age, password, confirmPassword };

  const validation = registerValidation.safeParse(body);
  if (!validation.success) {
    let errorData = {};
    validation.error.issues?.map((e) => {
      errorData[e?.path[0]] = e?.message;
    });

    return res.status(400).json({
      success: false,
      data: errorData,
      message: "Invalid Data",
    });
  }

  try {
    if (!!req.file) {
      const image = await uploadToCloudinary(req.file.buffer);
      const imageUrl = image.secure_url;
      validation.data.profilePic = imageUrl;
    }
    const userData = await createUser(validation.data);
    let token = await generateToken({
      id: userData?._id,
      email: userData?.email,
    });

    res.status(200).json({
      success: true,
      data: { user: userData, token: token },
      message: "User created successfully",
    });
  } catch (error) {
    console.log("errorrr in SignIn", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteUser = async (req, res) => {
  let id = req.params?.id;

  let userData = await getUserById(id);
  console.log(userData);
  if (!!!userData?._id) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
  try {
    let deletedUser = await deleteUserDB(id);
    res.status(200).json({
      success: true,
      data: deletedUser,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: error,
      message: "Something went wrong",
    });
  }
};

const getUserDetails = async (req, res) => {
  var id = req.params?.id;
  let userData = await getUserById(id);
  if (!!!userData?.id) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
  res.status(200).json({
    success: true,
    data: userData,
    message: "User Fetched Successfully",
  });
};

const updateUserDetails = async (req, res) => {
  let bodyData = req?.body || {};
  let id = bodyData?._id || bodyData?.id;
  let userData = await getUserById(id);
  if (!!userData?._id) {
    try {
      const validation = updateValidation.safeParse(bodyData);
      if (!validation.success) {
        let errorData = {};
        validation.error.issues?.map((e) => {
          errorData[e?.path[0]] = e?.message;
        });
        return res.status(400).json({
          success: false,
          message: "Invalid Data",
          data: errorData,
        });
      }

      if (!!req.file) {
        const image = await uploadToCloudinary(req.file.buffer);
        const imageUrl = image.secure_url;
        validation.data.profilePic = imageUrl;
      }
      let updatedData = validation.data;
      let updatedUser = await updateUser(id, updatedData);
      res.status(200).json({
        status: true,
        message: "User Updated Successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        status: false,
        message: "Something went wrong",
        data: error,
      });
    }
  } else {
    res.status(400).json({
      status: false,
      message: "User not found",
    });
  }
};

module.exports = {
  getAlluser,
  register,
  deleteUser,
  getUserDetails,
  updateUserDetails,
  loginUser,
};
