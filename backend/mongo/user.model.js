const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: false, default: "user" },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
