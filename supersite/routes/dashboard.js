var express = require('express');
var router = express.Router();
var TeamTracker = require("../models/teamTracker");

// Dashboard Index Route
router.get("/", isLoggedIn, function(req, res){
    TeamTracker.find({}, function(err, allTracks){
      if(err){
        console.log(err);
      } else {
        res.render("dashboard", {tracking: allTracks});
      }
    })
  });

  //middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
  }
  
  
  module.exports = router;