const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, require: true },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    require: true
  },
  content: { type: String, require: true },
  imagePath: { type: String, require: true },
  price: { type: String, require: true },
  category: { type: String },
  subCategory: { type: String },
  measureUnit: { type: String }
});

module.exports = mongoose.model("Product", productSchema);
