const slugify = require("slugify");
const connection = require("../database/connection");
const { v4: uuidv4 } = require("uuid");

// Create category
module.exports.createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).json({ message: "Name is required" });
    }

    // Check if category exists
    const [existingCategory] = await connection
      .promise()
      .query(`SELECT * FROM category WHERE name = ?`, [name]);
    if (existingCategory.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Category Already Exists",
      });
    }

    // Insert new category
    const slug = slugify(name);
    const id = uuidv4();
    await connection
      .promise()
      .query(`INSERT INTO category (id, name, slug) VALUES (?, ?, ?)`, [
        id,
        name,
        slug,
      ]);

    return res.status(201).json({
      success: true,
      message: "New category created",
      category: {
        id,
        name,
        slug,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

// Update category
module.exports.updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const slug = slugify(name);
    await connection
      .promise()
      .query(`UPDATE category SET name = ?, slug = ? WHERE id = ?`, [
        name,
        slug,
        id,
      ]);

    return res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category: {
        id,
        name,
        slug,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

// Get all categories
module.exports.getCategoryController = async (req, res) => {
  try {
    const [categories] = await connection
      .promise()
      .query(`SELECT * FROM category`);

    return res.status(200).json({
      success: true,
      message: "All Categories List",
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// Get single category
module.exports.singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const [category] = await connection
      .promise()
      .query(`SELECT * FROM category WHERE slug = '${slug}'`);
    return res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category: category[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting single category",
    });
  }
};

// Delete category
module.exports.deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await connection.promise().query(`DELETE FROM category WHERE id = ?`, [id]);

    return res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};
