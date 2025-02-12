const { v4: uuidv4 } = require("uuid");
const connection = require("../database/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cloudinary = require("cloudinary").v2;
const ExpressError = require("../utils/ExpressError.js");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports.register = async (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("File upload error: ", err);
      return res.status(500).json({ error: "File upload failed." });
    }
    let id = uuidv4();
    let { username, email, phone, password, role } = req.body;
    const file = req.file;

    // Validate input
    if (!username || !email || !phone || !password || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check for existing user
    let userExistsQuery = `SELECT * FROM user WHERE email = ?`;
    connection.query(userExistsQuery, [email], async (err, results) => {
      if (err) {
        console.error("Database error: ", err);
        return res.status(500).json({ error: "Database query failed." });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "User already exists." });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      if (file) {
        const { buffer, mimetype } = file;

        if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
          return next(new ExpressError(405, "File format is not supported"));
        }

        cloudinary.uploader
          .upload_stream(async (error, result) => {
            if (error) {
              console.error("Cloudinary upload error: ", error);
              return res
                .status(500)
                .json({ error: "File upload to cloudinary failed." });
            }
            const { public_id } = result;

            const url = cloudinary.url(public_id, {
              // width: 200,
              // height: 200,
              crop: "fill",
            });
            let user = [id, username, email, phone, url, hashedPassword, role];
            let q = `INSERT INTO user (id, username, email,phone, profile, password,role) VALUES (?, ?, ?, ?, ?,?,?)`;

            connection.query(q, user, (err, result) => {
              if (err) {
                console.error("Database insert error: ", err);
                return res
                  .status(500)
                  .json({ error: "Failed to create user." });
              }
              return res.json({ status: "Success" });
            });
          })
          .end(buffer);
      } else {
        // If no file is provided, insert user without image URL
        let user = [id, username, email, phone, hashedPassword, role];
        let q = `INSERT INTO user (id, username, email,phone, password,role) VALUES (?, ?, ?, ?,?,?)`;

        connection.query(q, user, (err, result) => {
          if (err) {
            console.error("Database insert error: ", err);
            return res.status(500).json({ error: "Failed to create user." });
          }
          return res.json({ status: "Success" });
        });
      }
    });
  });
};

module.exports.userSignin = async (req, res) => {
  let { email, password: formPass } = req.body;
  let q = `SELECT * FROM user WHERE email='${email}'`;
  connection.query(q, async (err, result) => {
    if (err) {
      console.error("Database insert error: ", err);
      return res.status(500).json({ error: "Failed to login user." });
    }
    if (result.length > 0) {
      const match = await bcrypt.compare(formPass, result[0].password);
      if (!match) {
        return res.status(400).json({ error: "WRONG PASSWORD." });
      } else {
        const id = result[0].id;
        const username = result[0].username;
        const email = result[0].email;
        const phone = result[0].phone;
        const profile = result[0].profile;
        const role = result[0].role;

        const token = jwt.sign(
          { id, username, email, phone, profile, role },
          "jwt-secret-key",
          {
            expiresIn: "7d",
          }
        );
        // res.cookie("token", token);
        return res.json({
          status: "Success",
          user: {
            id,
            username,
            email,
            phone,
            profile,
            role,
          },
          token,
        });
      }
    } else {
      return res.status(400).json({ error: "User doesn't exists." });
    }
  });
};

module.exports.testRoute = (req, res) => {
  res.json("Successful");
};

module.exports.userLogout = async (req, res) => {
  res.clearCookie("token");
  return res.json({ status: "Success" });
};

module.exports.updateUser = async (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("File upload error: ", err);
      return res.status(500).json({ error: "File upload failed." });
    }

    const { id, email, username, phone } = req.body;
    const file = req.file;

    // Log received body and file
    // console.log("Received body: ", req.body);
    // console.log("Received file: ", req.file);

    if (!id || !email || !username || !phone) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    try {
      if (file) {
        const { buffer, mimetype } = file;
        if (
          mimetype !== "image/png" &&
          mimetype !== "image/jpeg" &&
          mimetype !== "image/webp"
        ) {
          return next(new ExpressError(405, "File format is not supported"));
        }

        cloudinary.uploader
          .upload_stream(async (error, result) => {
            if (error) {
              console.error("Cloudinary upload error: ", error);
              return res
                .status(500)
                .json({ error: "File upload to Cloudinary failed." });
            }

            const { url } = result;

            const querySelect = `SELECT * FROM user WHERE id='${id}'`;
            connection.query(querySelect, async (err, result) => {
              if (err) {
                console.error("Database query error: ", err);
                return res
                  .status(500)
                  .json({ error: "Database query failed." });
              }

              if (result.length <= 0) {
                return res
                  .status(400)
                  .json({ error: "Error in updating user." });
              } else {
                const queryUpdate = `UPDATE user SET username=?, email=?,phone=?, profile=? WHERE id=?`;
                connection.query(
                  queryUpdate,
                  [username, email, phone, url, id],
                  (err, result) => {
                    if (err) {
                      console.error("Update query error: ", err);
                      return res
                        .status(500)
                        .json({ error: "Failed to update user." });
                    }

                    const querySelectAfter = `SELECT * FROM user WHERE id=?`;
                    connection.query(querySelectAfter, [id], (err, result) => {
                      if (err) {
                        console.error("Final select query error: ", err);
                        return res
                          .status(500)
                          .json({ error: "Database query failed." });
                      }

                      const user = result[0];
                      const token = jwt.sign(
                        {
                          id: user.id,
                          username: user.username,
                          email: user.email,
                          phone: user.phone,
                          profile: user.profile,
                          role: user.role,
                        },
                        "jwt-secret-key",
                        { expiresIn: "1d" }
                      );
                      // res.cookie("token", token);
                      return res.json({
                        status: "Success",
                        user: {
                          user,
                        },
                        token,
                      });
                    });
                  }
                );
              }
            });
          })
          .end(buffer);
      } else {
        const queryUpdate = `UPDATE user SET username=?, email=?, phone=? WHERE id=?`;
        connection.query(
          queryUpdate,
          [username, email, phone, id],
          (err, result) => {
            if (err) {
              console.error("Update query error: ", err);
              return res.status(500).json({ error: "Failed to update user." });
            }

            const querySelectAfter = `SELECT * FROM user WHERE id=?`;
            connection.query(querySelectAfter, [id], (err, result) => {
              if (err) {
                console.error("Final select query error: ", err);
                return res
                  .status(500)
                  .json({ error: "Database query failed." });
              }

              const user = result[0];
              const token = jwt.sign(
                {
                  id: user.id,
                },
                "jwt-secret-key",
                { expiresIn: "1d" }
              );

              res.cookie("token", token);
              return res.json({
                status: "Success",
                user: {
                  user,
                },
                token,
              });
            });
          }
        );
      }
    } catch (err) {
      console.error("Unexpected error: ", err);
      return next(new ExpressError(500, "An unexpected error occurred."));
    }
  });
};

module.exports.deleteUser = async (req, res) => {
  let { id } = req.body;
  let q = `DELETE FROM user WHERE id='${id}'`;
  // console.log(id);
  connection.query(q, async (err, result) => {
    if (err) throw err;
    res.clearCookie("token");
    return res.json({ status: "Success" });
  });
};

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

module.exports.getUserOrderController = async (req, res) => {
  const { userId } = req.query;
  const sql = `SELECT * FROM orders WHERE buyer_id = ?`;
  const [result] = await connection.promise().query(sql, [userId]);

  if (result.length > 0) {
    const [productDetial] = [];
    for (let i = 0; i < result.length; i++) {
      const sql1 = `SELECT * FROM product WHERE id = ?`;
      [productDetial] = await connection
        .promise()
        .query(sql1, [result[i].product_id]);
    }
    return res.status(200).json({
      success: true,
      payment: result,
      product_Detial: productDetial,
    });
  }
};
