const express = require("express");
const router = express.Router();
const userController = require("../mongo/user.controller");

// Lấy tất cả người dùng
router.get("/", async function (req, res) {
  try {
    const users = await userController.getAll();
    res.json(users);
  } catch (error) {
    console.error("Lỗi lấy danh sách user", error);
    res.status(500).json({ message: "Lỗi lấy danh sách người dùng", error: error.message });
  }
});

// Đăng ký người dùng và mã hóa mật khẩu
router.post("/register", async function (req, res) {
  try {
    const user = req.body;
    const result = await userController.register(user);
    res.status(result.status).json({ message: result.message, data: result.data });
  } catch (error) {
    console.error("Lỗi đăng ký user", error);
    res.status(500).json({ message: "Đăng ký thất bại", error: error.message });
  }
});

// Đăng nhập người dùng
router.post("/login", async function (req, res) {
  try {
    const user = req.body;
    const result = await userController.login(user);

    if (result.token) {
      return res.status(result.status).json({ message: result.message, token: result.token });
    }

    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Lỗi đăng nhập user:", error);
    res.status(500).json({ message: "Đăng nhập thất bại", error: error.message });
  }
});
// Kiểm tra token
router.get("/checktoken", async (req, res) => {
  try {
    const result = await checkToken(req);
    res.json(result);
  } catch (error) {
    console.error("Lỗi xác thực token", error);
    res.status(401).json({ message: error.message });
  }
});

// Router để lấy thông tin người dùng
router.get("/detailuser", async (req, res) => {
  try {
    const userInfo = await getUserDetails(req);
    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Lỗi lấy thông tin chi tiết user", error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
