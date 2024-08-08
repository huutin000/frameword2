// kết nối collection product
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  image: { type: String, require: true },
  price: { type: Number, require: true },
  del: { type: Number, require: true },
  quantity: { type: Number, require: true },
  // hotdeal: { type: String, require: true, default: 0 },
  category: {
    type: {
      categoryId: { type: ObjectId, require: true },
      categoryName: { type: String, require: true },
    },
  },
  view: { type: Number, require: false },
});
module.exports = mongoose.models.product || mongoose.model("product", productSchema);
