const mongoose = require("mongoose");
const mongooseValidator = require("mongoose-unique-validator");

const storeSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  category: { type: String, require: true },
  description: { type: String, require: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  imagePath: { type: String, require: true },
  deliveryArea: { type: String, require: true },
  openingHours: { type: String, require: true },
  phone: { type: String, require: true },
  products: { type: mongoose.Schema.Types.Array }
});

storeSchema.plugin(mongooseValidator);
module.exports = mongoose.model("Store", storeSchema);
