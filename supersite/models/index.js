const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.connect(
  "mongodb://haney:Gators21@ds263791.mlab.com:63791/webteam-super-site",
  {
    keepAlive: true,
    useNewUrlParser: true
  }
);

module.exports.TeamTracker = require("./teamTracker");
module.exports.User = require("./user");
