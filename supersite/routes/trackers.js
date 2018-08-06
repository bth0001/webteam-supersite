var express = require("express");
var router = express.Router({mergeParams: true});
var TeamTracker = require("../models/teamTracker");

// Get the tracker page so user can input data
router.get("/tracker", isLoggedIn, function(req, res){
    TeamTracker.find({}, function(err, allTracks){
      if(err){
        console.log(err);
      } else {
        res.render("tracker", {tracking: allTracks});
      }
    })
  });
  
  // Post the user input to the database
  router.post("/tracker", function(req, res){
    const { acctNum, date, buildPkg, starterTemplate, specialFeatures, domain, server, note, }  = req.body;
    const author = {id: req.user._id, firstName: req.user.firstName};
    var newTrack = {acctNum: acctNum, author: author, date: date, buildPkg: buildPkg, starterTemplate: starterTemplate, specialFeatures: specialFeatures, domain: domain, server: server, note: note};
    TeamTracker.create(newTrack, function(err, newlyTracked){
      if(err){
        console.log(err)
      } else {
        console.log(newlyTracked);
        res.redirect("/tracker");
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