const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.connect("mongodb://chase123:chase123@ds121982.mlab.com:21982/testforsupersite", {
  keepAlive: true,
  useNewUrlParser: true 
});

module.exports.User = require("./user");