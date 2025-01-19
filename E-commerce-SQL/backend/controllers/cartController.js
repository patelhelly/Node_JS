const connection = require("../database/connection");
const { v4: uuidv4 } = require("uuid");

//add product
module.exports.addProductToCart = async (req, res) => {
  try {
    const { productId, userId, price } = req.body;
    const id = uuidv4();

    const existsProduct = `SELECT * FROM cart WHERE product_id = '${productId}' AND user_id = '${userId}'`;

    const [existsProductResult] = await connection
      .promise()
      .query(existsProduct);

    if (existsProductResult.length > 0) {
      return res.status(401).json({
        status: false,
        message: "Product Already in Cart",
      });
    }

    const sql = `INSERT INTO cart (id,product_id,user_id,price) VALUES(?,?,?,?)`;

    const [result] = await connection
      .promise()
      .query(sql, [id, productId, userId, price]);
    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      result: result,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      err: err.message,
      message: "Error in Adding product in Cart",
    });
  }
};

//diplay cart result acc to user
module.exports.cartDetail = async (req, res) => {
  try {
    const { userId } = req.body;

    const sql = `SELECT c.product_id from cart c WHERE user_id = ? `;

    const [cartItems] = await connection.promise().query(sql, [userId]);

    if (cartItems.length > 0) {
      // Fetch details for each product in the cart
      const productDetailsPromises = cartItems.map(async (item) => {
        const productSql = `SELECT * FROM product WHERE id = ?`;
        const [productDetails] = await connection
          .promise()
          .query(productSql, [item.product_id]);
        return productDetails[0]; // Assuming there will always be a result
      });

      const productDetails = await Promise.all(productDetailsPromises);

      return res.status(200).json({
        success: true,
        result: productDetails,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Empty Cart",
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      err: err.message,
    });
  }
};

//sum prices
module.exports.cartAmount = async (req, res) => {
  try {
    const { userId } = req.body;

    const sql = `SELECT SUM(price) as amount from cart WHERE user_id = ?`;

    const [result] = await connection.promise().query(sql, [userId]);

    return res.status(200).json({
      success: true,
      result: result,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      err: err.message,
    });
  }
};

//count items
module.exports.cartItem = async (req, res) => {
  try {
    const { userId } = req.body;

    const sql = `SELECT COUNT(*) from cart WHERE user_id = ?`;

    const [result] = await connection.promise().query(sql, [userId]);

    return res.status(200).json({
      success: true,
      result: result,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      err: err.message,
    });
  }
};

//remove item from cart
module.exports.removeCartItem = async (req, res) => {
  try {
    const { productId, userId } = req.query;
    const sql = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`;
    // console.log(productId, userId);

    const [result] = await connection.promise().query(sql, [userId, productId]);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      result,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      err: err.message,
    });
  }
};
