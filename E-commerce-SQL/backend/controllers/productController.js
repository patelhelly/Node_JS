const connection = require("../database/connection");
const fs = require("fs");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cloudinary = require("cloudinary").v2;
const ExpressError = require("../utils/ExpressError.js");
const braintree = require("braintree");
const dotenv = require("dotenv");

dotenv.config();

//payment gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

module.exports.createProductController = async (req, res, next) => {
  upload.array("files", 10)(req, res, async (err) => {
    try {
      if (err) {
        console.error("File upload error: ", err);
        return res.status(500).json({ error: "File uploaded fail" });
      }
      const { name, description, price, category, quantity, shipping } =
        req.body;
      const files = req.files;
      const slug = slugify(name);
      const id = uuidv4();

      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        // case file && file.size > 1000000:
        //   return res
        //     .status(500)
        //     .json({ error: "photo is Required and should be less then 1mb" });
      }

      if (files) {
        const { buffer, mimetype } = files;
        // if (
        //   mimetype !== "image/png" &&
        //   mimetype !== "image/jpeg" &&
        //   mimetype !== "image/webp" &&
        //   mimetype !== "image/jpg"
        // ) {
        //   return next(new ExpressError(405, "File format is not supported"));
        // }
        const uploadPromises = files.map(async (file) => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(async (error, result) => {
                if (error) {
                  console.error("Cloudinary upload error: ", error);
                  reject(error);
                }
                const { public_id } = result;
                const url = cloudinary.url(public_id, {
                  // width: 200,
                  // height: 200,
                  crop: "fill",
                });
                resolve(result.secure_url);
              })
              .end(file.buffer);
          });
        });

        const photoUrls = await Promise.all(uploadPromises);

        let product = [
          id,
          name,
          slug,
          description,
          price,
          category,
          quantity,
          photoUrls.join(","), // Join photo URLs into a single string
          shipping,
        ];
        let q = `INSERT INTO product (id, name, slug,description, price, category,quantity,product_photo,shipping) VALUES (?, ?, ?, ?, ?,?,?,?,?)`;

        connection.query(q, product, (err, result) => {
          if (err) {
            console.error("Database insert error: ", err);
            return res.status(500).json({ error: "Failed to create user." });
          }
          return res.status(200).json({
            success: true,
            message: "Product Created Successfully",
          });
        });
      } else {
        // If no file is provided, insert user without image URL
        let product = [
          id,
          name,
          slug,
          description,
          price,
          category,
          quantity,
          shipping,
        ];
        let q = `INSERT INTO product (id, name, slug,description, price, category,quantity) VALUES (?, ?, ?, ?, ?,?,?,?)`;

        connection.query(q, product, (err, result) => {
          if (err) {
            console.error("Database insert error: ", err);
            return res.status(500).json({ error: "Failed to create user." });
          }
          return res.status(200).json({
            success: true,
            message: "Product Created Successfully",
          });
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        error,
        message: "Error in crearing product",
      });
    }
  });
};

//get all products
module.exports.getProductController = async (req, res) => {
  try {
    const query = `
        SELECT p.id, p.name, p.slug, p.description, p.price, p.category, p.quantity, p.product_photo , p.shipping, c.name AS category_name
        FROM product p
        JOIN category c ON p.category = c.id
        ORDER BY p.createdAt DESC
        LIMIT 12
      `;

    connection.query(query, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          success: false,
          message: "Error in getting products",
          error: err.message,
        });
      }

      res.status(200).send({
        success: true,
        countTotal: results.length,
        message: "All Products",
        products: results,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// get single product
module.exports.getSingleProductController = async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.name, p.slug, p.description, p.price, p.category, p.quantity, p.shipping, c.name AS category_name
      FROM product p
      JOIN category c ON p.category = c.id
      WHERE p.slug = ?
    `;

    const { slug } = req.params;

    connection.query(query, [slug], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          success: false,
          message: "Error while getting single product",
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).send({
        success: true,
        message: "Single Product Fetched",
        product: results[0],
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

//delete controller
module.exports.deleteProductController = async (req, res) => {
  try {
    const query = ` DELETE FROM product WHERE id = ?`;

    const { id } = req.params;

    connection.query(query, [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          success: false,
          message: "Error while getting single product",
          error: err.message,
        });
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({
          success: false,
          id: id,
          message: "Product not found",
        });
      }

      res.status(200).send({
        success: true,
        message: "Product deleted successfully",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

//upate producta
module.exports.updateProductController = async (req, res) => {
  upload.array("files", 10)(req, res, async (err) => {
    try {
      if (err) {
        console.error("File upload error: ", err);
        return res.status(500).json({ error: "File upload failed" });
      }

      const { name, description, price, category, quantity, shipping } =
        req.body;
      const files = req.files;
      const slug = slugify(name);
      const { id } = req.params;

      switch (true) {
        case !name:
          return res.status(400).send({ error: "Name is required" });
        case !description:
          return res.status(400).send({ error: "Description is required" });
        case !price:
          return res.status(400).send({ error: "Price is required" });
        case !category:
          return res.status(400).send({ error: "Category is required" });
        case !quantity:
          return res.status(400).send({ error: "Quantity is required" });
      }

      let photoUrls = [];
      if (files && files.length > 0) {
        const uploadPromises = files.map((file) => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream((error, result) => {
                if (error) {
                  console.error("Cloudinary upload error: ", error);
                  reject(error);
                }
                resolve(result.secure_url);
              })
              .end(file.buffer);
          });
        });

        photoUrls = await Promise.all(uploadPromises);
      }

      const product = [
        name,
        slug,
        description,
        price,
        category,
        quantity,
        photoUrls.join(",") || null, // Join photo URLs into a single string, use null if no photos
      ];

      const query = `UPDATE product SET name = ?, slug = ?, description = ?, price = ?, category = ?, quantity = ?, product_photo = ? WHERE id = '${id}'`;

      connection.query(query, product, (err, result) => {
        if (err) {
          console.error("Database update error: ", err);
          return res.status(500).json({ error: "Failed to update product." });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Product not found." });
        }

        res.status(200).json({
          success: true,
          message: "Product updated successfully",
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error,
        message: "Error updating product",
      });
    }
  });
};

module.exports.productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let query = "SELECT * FROM product WHERE 1=1";
    let params = [];

    if (checked.length > 0) {
      query += " AND category IN (?)";
      params.push(checked);
    }

    if (radio.length) {
      query += " AND price BETWEEN ? AND ?";
      params.push(radio[0], radio[1]);
    }

    console.log(params);

    connection.query(query, params, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          success: false,
          message: "Error while filtering products",
          error: err.message,
        });
      }

      res.status(200).send({
        success: true,
        products: results,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while filtering products",
      error: error.message,
    });
  }
};

module.exports.productCountController = async (req, res) => {
  try {
    const query = "SELECT COUNT(*) as total FROM product";

    connection.query(query, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          success: false,
          message: "Error in product count",
          error: err.message,
        });
      }

      const total = results[0].total;
      res.status(200).send({
        success: true,
        total,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in product count",
      error: error.message,
    });
  }
};

module.exports.productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? parseInt(req.params.page) : 1;
    const offset = (page - 1) * perPage;

    const query = `
      SELECT * 
      FROM product
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `;

    connection.query(query, [perPage, offset], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          success: false,
          message: "Error in per page ctrl",
          error: err.message,
        });
      }

      res.status(200).send({
        success: true,
        products: results,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in per page ctrl",
      error: error.message,
    });
  }
};

module.exports.braintrerTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        return res.status(500).json({ err: err.message });
      } else {
        return res.json(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.braintrerPaymentController = async (req, res) => {
  try {
    const { nonce, auth, cartDetails } = req.body;
    let id = uuidv4();
    let total = 0;
    cartDetails.map((i) => {
      total += i.price;
    });
    // console.log(nonce, cartDetails, auth.user.id, total);
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (error, result) {
        if (result) {
          try {
            for (let i = 0; i < cartDetails.length; i++) {
              // Insert order into orders table
              const [orderResult] = await connection
                .promise()
                .query(
                  `INSERT INTO orders (id,payment, buyer_id, product_id) VALUES (?, ?, ?, ?)`,
                  [id, JSON.stringify(result), auth.user.id, cartDetails[i].id]
                );
            }
            for (let i = 0; i < cartDetails.length; i++) {
              const sql = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`;
              const [result] = await connection
                .promise()
                .query(sql, [auth.user.id, cartDetails[i].id]);
              if (result) {
                res.json({ ok: true });
              }
            }
          } catch (dbError) {
            console.error(dbError);
            return res.status(500).json("Database error");
          }
        } else {
          return res.status(500).json(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
