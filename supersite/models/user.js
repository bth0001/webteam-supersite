const mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  profileImageUrl: {
    type: String
  },
  team: {
    type: String,
    required: true
  },
  role: {
    type: String,
  }
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email"});

const User = mongoose.model("User", UserSchema);

module.exports = User;
