// kết nối collection categories
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const categorySchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true, default: "" },
});
module.exports = mongoose.models.category || mongoose.model("category", categorySchema);
