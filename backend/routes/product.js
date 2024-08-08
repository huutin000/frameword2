var express = require("express");
var router = express.Router();
const productController = require("../mongo/product.controller");
const multer = require("multer");
const path = require("path");
// Thiết lập nơi lưu trữ và tên file
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/image")); // Sử dụng path.join để đảm bảo đường dẫn chính xác
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname); // Thêm dấu thời gian vào tên file để tránh trùng lặp
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// Kiểm tra file upload
function checkFileUpLoad(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Bạn chỉ được upload file ảnh"));
  }
  cb(null, true);
}

// Upload file
let upload = multer({ storage: storage, fileFilter: checkFileUpLoad });

// http://localhost:3000/product
router.get("/", async (req, res) => {
  try {
    const products = await productController.getAll();
    return res.status(200).json(products);
  } catch (error) {
    console.log("Lỗi lấy danh sách sản phẩm", error);
    return res.status(500).json({ error: "Lỗi lấy danh sách sản phẩm" });
  }
});
// chi tiết sản phẩm
// http://localhost:3000/product/productdetail/:id
router.get("/productdetail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productController.getDetail(id);
    return res.status(200).json(product);
  } catch (error) {
    console.log("Lỗi lấy chi tiết sản phẩm", error);
    return res.status(500).json({ error: "Lỗi lấy chi tiết sản phẩm" });
  }
});

// http://localhost:3000/product/productcate/:id

router.get("/productcate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productController.getProCate(id);
    return res.status(200).json(products);
  } catch (error) {
    console.log("Lỗi lấy sản phẩm theo tên danh mục", error);
    return res.status(500).json({ error: "Lỗi lấy sản phẩm theo tên danh mục" });
  }
});

// search sản phẩm
router.get("/search/:keyword", async (req, res) => {
  try {
    const products = await productController.searchProduct(req.params.keyword);
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: "Không tìm thấy" });
    throw error;
  }
});
// thêm sản phẩm và upload ảnh sản phẩm
// http://localhost:3000/product/addProduct
router.post("/addProduct", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Chưa upload ảnh sản phẩm" });
    }
    const product = req.body;
    product.image = req.file.filename;

    const newProduct = await productController.addProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    console.log("Lỗi thêm sản phẩm", error);
    res.status(500).json({ message: "Lỗi thêm sản phẩm", error: error.message });
  }
});
// sửa sản phẩm
// http://localhost:3000/product/updateProduct:/id

router.put("/updateProduct/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    const productData = req.body;
    if (req.file) {
      productData.image = req.file.filename;
    }
    const result = await productController.updateProduct(id, productData);
    res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi sửa sản phẩm", error);
    res.status(500).json({ message: "Lỗi sửa sản phẩm", error: error.message });
  }
});

// xóa sản phẩm
// http://localhost:3000/product/deleteProduct/:id
router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productController.deleteProduct(id);
    res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi xóa sản phẩm", error);
    res.status(500).json({ message: "Lỗi xóa sản phẩm", error: error.message });
  }
});
module.exports = router;
