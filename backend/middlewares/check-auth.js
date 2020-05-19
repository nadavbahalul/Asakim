const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: verifiedToken.email, userId: verifiedToken.userId };
    next();
  } catch {
    return res.status(401).json({
      message: "יש להתחבר לאתר כדי להמשיך"
    });
  }
};
