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
    type: String
  },
  role: {
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  skills: [],
  bio: {
    type: String
  },
  socials: []
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

UserSchema.pre("save", function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
