const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;
    if (!authHeader) res.status(401).json({ msg: "Token required" });
    const token = authHeader.split(" ")[1];
    decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    if (!decoded) res.sendStatus(403);
    req.decoded = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};

module.exports = authMiddleware;
