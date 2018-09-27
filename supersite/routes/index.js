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

router.get("/strom", function(req, res){
  res.render("strom");
});

router.get("/search", function(req, res){
  req.session.searchHistory = req.session.searchHistory || [];
  if (req.query.search === "strom"){
    res.redirect("/strom")
  }
  if (req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');

        TeamTracker.find({$text: {$search : regex}}, function(err, allTracks){
          console.log(regex);
        if(err){
            console.log("Something went wrong");
            console.log(err);
        } else {
          if (req.session.searchHistory.indexOf(req.query.search) === -1){
            req.session.searchHistory.unshift(req.query.search);
          } else {
            var searchIndex = req.session.searchHistory.indexOf(req.query.search);
            var array = req.session.searchHistory;
            array.splice(searchIndex, 1);
            req.session.searchHistory.unshift(req.query.search);
          }
            res.render("search-results", {
              tracking : allTracks,
              searchWord: req.query.search,
              searchHistory: req.session.searchHistory
            });
        }
      }).sort({});   
      } else {
        req.flash("error", "You didn't enter a search word.");
        res.redirect("/dashboard");
      }
});

router.get("/clear-search", function(req, res){
  req.session.searchHistory = []
  req.flash("success", "Search History has been cleared!");
  res.redirect("/dashboard");
});

function escapeRegex(text) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/, '\\$&');
};

module.exports = router;