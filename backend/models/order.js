const mongoose = require("mongoose");
const mongooseValidator = require("mongoose-unique-validator");

const orderSchema = mongoose.Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  adress: { type: String, require: true },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    require: true
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    require: true
  },
  amounts: [Number],
  totalPrice: { type: Number, require: true }
});

orderSchema.plugin(mongooseValidator);
module.exports = mongoose.model("Order", orderSchema);
