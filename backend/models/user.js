const mongoose = require("mongoose");
const mongooseValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  phone: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true }
});

userSchema.plugin(mongooseValidator);
module.exports = mongoose.model("User", userSchema);
