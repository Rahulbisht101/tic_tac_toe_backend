const jsonWebToken = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const bearer = req.headers.authorization;
  let token = !!bearer ? bearer.split(" ")[1].trim() : "";

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = {
  validateToken,
};
