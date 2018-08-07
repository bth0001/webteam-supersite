var express = require("express");
var router = express.Router({mergeParams: true});
var TeamTracker = require("../models/teamTracker");
var User = require("../models/user");

router.get("/", isLoggedIn, function(req, res){
  TeamTracker.find({}, function(err, allTracks){
    User.find({}, function(err, allUsers){
    if(err){
      console.log(err);
    } else {
      res.render("tracker", {
        tracking: allTracks,
        users: allUsers
      });
    }
  })
})
});

router.post("/", function(req, res){
  const { acctNum, date, buildPkg, starterTemplate, specialFeatures, domain, cssPath, server, note }  = req.body;
  const author = {id: req.user._id, firstName: req.user.firstName};
  var newTrack = {acctNum: acctNum, author: author, date: date, buildPkg: buildPkg, starterTemplate: starterTemplate, specialFeatures: specialFeatures, domain: domain, cssPath: cssPath, server: server, note: note};
  TeamTracker.create(newTrack, function(err, newlyTracked){
    if(err){
      console.log(err)
    } else {
      console.log(newlyTracked);
      res.redirect("/dashboard");
    }
  });
});
  
  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

  module.exports = router;