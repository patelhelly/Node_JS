const JWT = require("jsonwebtoken");
const wrapAsync = require("../utils/wrapAsync.js");
const connection = require("../database/connection");

//Protected route token based
module.exports.requiredSign = wrapAsync(async (req, res, next) => {
  try {
    if (!req.headers.authorization.split(" ")[1]) {
      console.log("No token provided");
      return res.status(401).json({ error: "Token is required" });
    }
    const decoded = await JWT.verify(
      req.headers.authorization.split(" ")[1],
      "jwt-secret-key"
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
});

//check if it is Admin

module.exports.isAdmin = wrapAsync((req, res, next) => {
  const sql = `SELECT * FROM user where id = '${req.user.id}'`;
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to verify admin or not." });
    }
    if (result[0].role !== "1") {
      return res.status(401).send({
        success: false,
        message: "Unauthoried Access",
      });
    } else {
      next();
    }
  });
});
