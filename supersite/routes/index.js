var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var TeamTracker = require("../models/teamTracker");
var taskType = require("../models/taskType");
const escapeStringRegexp = require('escape-string-regexp');

router.get("/", function(req, res){
  res.render("index");
});

router.get("/search", function(req, res){
  if (req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'g');
    
    // const escapedString = escapeStringRegexp(req.query.search);
    //console.log(escapedString);
    //console.log(regex);
        TeamTracker.find({$text: {$search : regex}}, function(err, allTracks){
          console.log(regex);
        // TeamTracker.find({$text: {$search : escapedString}}, function(err, allTracks){
        if(err){
            console.log("Something went wrong");
            console.log(err);
        } else {
            res.render("search-results", {
              tracking : allTracks,
              searchWord: req.query.search
            });
        }
      });   
      } else {
        req.flash("error", "You didn't enter a search word.");
        res.redirect("/dashboard");
      }
});

function escapeRegex(text) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/, '\\$&');
};

module.exports = router;