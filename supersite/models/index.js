const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.connect("mongodb://chase:test123@ds123929.mlab.com:23929/usertest", {
  keepAlive: true,
  useNewUrlParser: true 
});

module.exports.User = require("./user");

