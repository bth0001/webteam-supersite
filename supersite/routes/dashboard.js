var express = require('express');
var router = express.Router();
var TeamTracker = require("../models/teamTracker");
var User = require("../models/user");

// Dashboard Index Route
router.get("/", isLoggedIn, function(req, res){
  TeamTracker.find({}, function(err, allTracks){
    User.find({}, function(err, allUsers){
    if(err){
      console.log(err);
    } else {
      res.render("dashboard", {
        tracking: allTracks,
        users: allUsers
      });
    }
  })
  })
});

// Edit task Route
router.get("/edit-task", isLoggedIn, function(req, res){
  TeamTracker.find({}, function(err, allTracks){
    User.find({}, function(err, allUsers){
      if(err){
        console.log(err);
      } else {
        res.render("edit-task", {
          tracking: allTracks,
          users: allUsers
        });
      }
    })
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