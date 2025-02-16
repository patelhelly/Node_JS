require("dotenv").config();

// Disable SSL verification (for development purposes only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "helly@123",
});
const connection1 = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "cloudinary_images",
  password: "helly@123",
});

app.use(express.static("public"));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

connection.connect(function (err) {
  if (err) {
    console.log("Error in Connection");
  } else {
    console.log("Connected");
  }
});
connection1.connect(function (err) {
  if (err) {
    console.log("Error in Connection");
  } else {
    console.log("Connected");
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const storage1 = multer.memoryStorage();

const upload = multer({ storage });
const upload1 = multer({ storage1: storage1 });

function uploadImage(req, res, next) {
  upload1.single("file")(req, res, (err) => {
    if (err) throw err;
    const imageFile = req.file;

    const { originalname, mimetype, buffer } = imageFile;

    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error) throw error;
        const { public_id } = result;

        const url = cloudinary.url(public_id, {
          // width: 200,
          // height: 200,
          crop: "fill",
        });

        const data = {
          name: originalname,
          type: mimetype,
          url: url,
          public_id: public_id,
        };

        const sql = `INSERT INTO image SET ?`;

        connection1.query(sql, data, (err, result) => {
          if (err) throw err;
          res.json({ message: "Image uploaded successfully" });
        });
      })
      .end(buffer);
  });
}

// app.post("/upload", upload.single("file"), (req, res) => {
//   console.log(req.body);
//   console.log(req.file);
//   return res.json({ Status: "Success" });
// });

app.post("/upload", upload.single("file"), (req, res) => {
  const sql = `INSERT INTO img (filename) VALUES (?)`;
  const values = [req.file.filename];
  connection.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: "Error singup query" });
    console.log("Result:", result);
    return res.json({ Status: "Success" });
  });
});

app.get("/display", (req, res) => {
  const sql = `SELECT * FROM img`;
  connection.query(sql, (err, results) => {
    if (err) return res.json({ Error: "Error in displaying images" });
    // console.log(result);
    return res.json({ Status: "Success", data: results });
  });
});

app.post("/cloudinary-upload", uploadImage);
app.get("/display-cloudinary", (req, res) => {
  const sql = `SELECT * FROM image`;

  connection1.query(sql, (err, result) => {
    if (err) throw err;
    res.json({ data: result });
  });
});

app.listen(8080, () => {
  console.log("server listening");
});
