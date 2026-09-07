const User = require("../models/user.model");

const createUser = async (userData) => {
  const user = await User.create(userData);

  return user;
};

const getUser = async () => {
  const user = await User.find();
  return user;
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (err) {
    return null;
  }
};

const getUserByMail = async (email) => {
  try {
    const user = await User.findOne({
      email: email,
    });
    return user;
  } catch (err) {
    return null;
  }
};

const updateUser = async (id, userData) => {
  const user = await User.findByIdAndUpdate(id, userData, { new: true });
  return user;
};

const deleteUserDB = async (id) => {
  const user = await User.deleteOne({ _id: id });
  return user;
};

module.exports = {
  createUser,
  getUser,
  getUserByMail,
  getUserById,
  updateUser,
  deleteUserDB,
};
