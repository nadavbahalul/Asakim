const mongoose = require("mongoose");
const mongooseValidator = require("mongoose-unique-validator");

const categorySchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  subCategories: { type: mongoose.Schema.Types.Array, require: true }
});

categorySchema.plugin(mongooseValidator);
module.exports = mongoose.model("Category", categorySchema);
