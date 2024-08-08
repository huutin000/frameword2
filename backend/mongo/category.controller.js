const categoryModel = require("./category.model");

module.exports = { getAll, getByName, getById, addCategory, updateCategory, deleteCategory };

// tìm all danh mục
async function getAll() {
  try {
    const cateAll = await categoryModel.find();
    return cateAll;
  } catch (error) {
    console.log("Lỗi lấy danh sách danh mục", error);
    throw error;
  }
}
// lấy danh mục theo name
async function getByName(name) {
  try {
    const cate = await categoryModel.findOne({ name: name });
    return cate;
  } catch (error) {
    console.log("Lỗi lấy danh mục theo name", error);
    throw error;
  }
}
// lấy danh mục theo id
async function getById(id) {
  try {
    const cate = await categoryModel.findById(id);
    return cate;
  } catch (error) {
    console.log("Lỗi lấy danh mục theo id", error);
    throw error;
  }
}
// thêm danh mục
async function addCategory(name, description) {
  try {
    const cate = new categoryModel({ name, description });
    const result = await cate.save();
    return result;
  } catch (error) {
    console.log("Lỗi thêm danh mục", error);
    throw error;
  }
}
// sửa danh mục theo id
async function updateCategory(id, category) {
  try {
    const result = await categoryModel.findByIdAndUpdate(id, category, { new: true });
    return result;
  } catch (error) {
    console.log("Lỗi sửa danh mục", error);
    throw error;
  }
}
// xóa danh mục theo id
async function deleteCategory(id) {
  try {
    const result = await categoryModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log("Lỗi xóa danh mục", error);
    throw error;
  }
}
