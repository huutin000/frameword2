const productModel = require("./product.model");

module.exports = { getAll, getProCate, searchProduct, getDetail, addProduct, updateProduct, deleteProduct };

// lấy all sản phẩm
async function getAll() {
  try {
    const products = await productModel.find();
    return products;
  } catch (error) {
    console.log("Lỗi lấy danh sách sản phẩm", error);
    throw error;
  }
}
// chi tiết sản phẩm
async function getDetail(id) {
  try {
    const product = await productModel.findById(id);
    return product;
  } catch (error) {
    console.log("Lỗi lấy chi tiết sản phẩm", error);
    throw error;
  }
}

async function getProCate(id) {
  try {
    const productcate = await productModel.find({ "category.categoryID": id });
    return productcate;
  } catch (error) {
    console.log("Lỗi lấy sản phẩm theo id danh mục ", error);
    throw error;
  }
}
// search san pham
async function searchProduct(keyword) {
  try {
    const products = await productModel.find({ name: new RegExp(keyword, "i") });
    return products;
  } catch (error) {
    console.log("Lỗi tìm kiếm sản phẩm", error);
    throw error;
  }
}
// thêm sản phẩm và upload ảnh sản phẩm
async function addProduct(product) {
  try {
    const newProduct = new productModel(product);
    const result = await newProduct.save();
    return result;
  } catch (error) {
    console.log("Lỗi thêm sản phẩm", error);
    throw error;
  }
}
// sửa sản phẩm
async function updateProduct(id, product) {
  try {
    const result = await productModel.findByIdAndUpdate(id, product, { new: true });
    return result;
  } catch (error) {
    console.log("Lỗi sửa sản phẩm", error);
    throw error;
  }
}
// xóa sản phẩm
async function deleteProduct(id) {
  try {
    const result = await productModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log("Lỗi xóa sản phẩm", error);
    throw error;
  }
}
