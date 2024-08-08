const userModel = require("./user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

module.exports = { getAll, register, login, checkToken, getUserDetails };
// Lấy tất cả người dùng
async function getAll() {
  try {
    const users = await userModel.find();
    return users;
  } catch (error) {
    console.error("Lỗi lấy danh sách user", error);
    throw new Error("Lỗi lấy danh sách người dùng");
  }
}

// Đăng ký người dùng mới và mã hóa mật khẩu
async function register(user) {
  try {
    const existingUser = await userModel.findOne({ email: user.email });
    if (existingUser) {
      return { status: 400, message: "Email đã tồn tại" };
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await userModel.create(user);
    return { status: 200, message: "Đăng ký thành công", data: newUser };
  } catch (error) {
    console.error("Lỗi đăng ký user", error);
    return { status: 500, message: "Đăng ký thất bại", error: error.message };
  }
}

// Đăng nhập người dùng và tạo JWT
async function login(user) {
  try {
    const existingUser = await userModel.findOne({ email: user.email });
    if (!existingUser) {
      return { status: 400, message: "Email không tồn tại" };
    }

    const isValidPassword = await bcrypt.compare(user.password, existingUser.password);
    if (!isValidPassword) {
      return { status: 400, message: "Mật khẩu không chính xác" };
    }

    // Tạo JWT
    const token = jwt.sign({ email: existingUser.email, role: existingUser.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return {
      status: 200,
      message: "Đăng nhập thành công",
      token: token,
    };
  } catch (error) {
    console.error("Lỗi đăng nhập user", error);
    return { status: 500, message: "Đăng nhập thất bại", error: error.message };
  }
}

// Kiểm tra tính hợp lệ của token
async function checkToken(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Không có header Authorization");
    }
    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token, SECRET_KEY);
    return { message: "Token hợp lệ", user };
  } catch (error) {
    console.error("Lỗi xác thực token", error);
    throw new Error("Token không hợp lệ");
  }
}

// Hàm lấy thông tin người dùng
async function getUserDetails(req) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Token không hợp lệ");
    }

    let decodedUser;
    try {
      decodedUser = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }

    const db = await connectDb();
    const userCollection = db.collection("users");
    const userInfo = await userCollection.findOne({ email: decodedUser.email });

    if (userInfo) {
      return userInfo;
    } else {
      throw new Error("Không tìm thấy user");
    }
  } catch (error) {
    console.error("Lỗi lấy thông tin chi tiết user", error);
    throw new Error(error.message || "Lỗi lấy thông tin chi tiết người dùng");
  }
}

