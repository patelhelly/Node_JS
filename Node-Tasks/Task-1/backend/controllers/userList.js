const connection = require("../database/connection");

module.exports.showUserList = async (req, res) => {
  let q = `SELECT * FROM user`;
  connection.query(q, (err, result) => {
    if (err) {
      console.error("Database query error: ", err);
      return res
        .status(500)
        .json({ status: "Error", message: "Failed to fetch user list." });
    }
    let userData = result;
    return res.json({ status: "Success", result: userData });
  });
};
