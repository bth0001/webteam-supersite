var Projects = require("../models/projects");
var User = require("../models/user");
var Comment = require("../models/projectComments");
var TeamTracker = require("../models/teamTracker");

var middlewareObj = {};


middlewareObj.isMaster = function (req, res, next) {
  if ((req.isAuthenticated() && req.user.isMaster)) {
    return next();
  }
  req.flash("error", "Only Admins are able to view this page");
  res.redirect("/dashboard");
};

middlewareObj.checkTrackerOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    TeamTracker.findById(req.params.id, function (err, foundTracker) {
      console.log(foundTracker);
      if (err) {
        req.flash("error", "Tracker not Found");
        res.redirect("/tracker");
      } else {
        // does user own the comment?
        if (foundTracker.author.id.equals(req.user._id) || req.user.isAdmin || req.user.isMaster) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that!");
          res.redirect("/tracker");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        req.flash("error", "Comment not Found");
        res.redirect("back");
      } else {
        // does user own the comment?
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin || req.user.isMaster) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkProjectOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Projects.findById(req.params.id, function (err, foundProject) {
      if (err) {
        req.flash("error", "Project not Found");
        res.redirect("back");
      } else {
        // does user own the project?
        if (foundProject.author.id.equals(req.user._id) || req.user.isAdmin || req.user.isMaster) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
};

//Middleware for Logged in
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
};

module.exports = middlewareObj;
