const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: process.env.DATABASE_NAME,
  password: "helly@123",
});

module.exports = connection;
