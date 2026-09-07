const jsonWebToken = require("jsonwebtoken");
const generateToken = (data) => {
  const token = jsonWebToken.sign(data, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

const validateToken = async (token) => {
  let data = await jsonWebToken.verify(token, process.env.JWT_SECRET);
  return data;
};

module.exports = {
  generateToken,
  validateToken,
};
