var express = require("express");
var router = express.Router();
const categoryController = require("../mongo/category.controller");

// lấy all danh mục
// http://localhost:3000/category
router.get("/", async function (req, res) {
  try {
    const categories = await categoryController.getAll();
    res.json(categories);
  } catch (error) {
    console.log("Lỗi lấy danh sách danh mục", error);
    res.status(500).json({ message: "Lỗi lấy danh sách danh mục" });
  }
});
// lấy danh mục theo name
// http://localhost:3000/category/:name
router.get("/:name", async function (req, res) {
  try {
    const name = req.params.name;
    const category = await categoryController.getByName(name);
    res.json(category);
  } catch (error) {
    console.log("Lỗi lấy danh mục theo name", error);
    res.status(500).json({ message: "Lỗi lấy danh mục theo name" });
  }
});
// lấy danh mục theo id
router.get("/category/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const category = await categoryController.getById(id);
    res.json(category);
  } catch (error) {
    console.log("Lỗi lấy danh mục theo id", error);
    res.status(500).json({ message: "Lỗi lấy danh mục theo id" });
  }
});
// thêm danh mục
// http://localhost:3000/category/addCategory
router.post("/addCategory", async function (req, res) {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const category = await categoryController.addCategory(name, description);
    res.json(category);
  } catch (error) {
    console.log("Lỗi thêm danh mục", error);
    res.status(500).json({ message: "Lỗi thêm danh mục" });
  }
});
// sửa danh mục theo id
// http://localhost:3000/category/updateCategory/:id
router.put("/updateCategory/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const category = req.body;
    const result = await categoryController.updateCategory(id, category);
    res.json(result);
  } catch (error) {
    console.log("Lỗi sửa danh mục", error);
    res.status(500).json({ message: "Lỗi sửa danh mục" });
  }
});
// xóa danh mục theo id
// http://localhost:3000/category/deleteCategory/:id
router.delete("/deleteCategory/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const result = await categoryController.deleteCategory(id);
    res.json(result);
  } catch (error) {
    console.log("Lỗi xóa danh mục", error);
    res.status(500).json({ message: "Lỗi xóa danh mục" });
  }
});
module.exports = router;
