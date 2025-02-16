const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "project_1",
  password: "helly@123",
});

module.exports = connection;
