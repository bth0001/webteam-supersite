var express = require('express');
var router = express.Router();
var TeamTracker = require("../models/teamTracker");
var User = require("../models/user");
var TaskTypes = require("../models/taskType");

// Dashboard Index Route
router.get("/", function(req, res){
  TeamTracker.find({}, function(err, allTracks){
    User.find({}, function(err, allUsers){
      TaskTypes.find({}, function(err, allTask){
        if(err){
          console.log(err);
        } else {
          res.render("dashboard", {
            tracking: allTracks,
            users: allUsers,
            task: allTask
          });
        }
      })
    })
  })
});

// Edit task Route
router.get("/edit-task", function(req, res){
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

module.exports = router;