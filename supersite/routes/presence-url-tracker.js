var express = require('express');
var router = express.Router();
var TeamTracker = require("../models/teamTracker");

// Dashboard Index Route
router.get("/", function(req, res){
    TeamTracker.find({}, function(err, allTracks){
      if(err){
        console.log(err);
      } else {
        res.render("presence-url-tracker", {tracking: allTracks});
      }
    })
  });

module.exports = router;