const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
  // name: [
  //   {
  //     firstName: {
  //       type: String,
  //       //required: true
  //     },
  //     lastName: {
  //       type: String,
  //       //required: true
  //     }
  //   }
  // ]
  // ,
  // password: {
  //   type: String,
  //   required: true
  // },
  // profileImageUrl: {
  //   type: String
  // },
  // team: {
  //   type: String,
  //   required: true
  // },
  // role: {
  //   type: String,
  // },
  // messages: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Message"
  //   }
  // ]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;