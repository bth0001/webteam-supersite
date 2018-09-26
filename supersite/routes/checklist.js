var express = require("express");
var router = express.Router();
var User = require("../models/user");
var DeveloperChecklist = require("../models/checklist");

// Checklist Index Route
router.get("/", function(req, res) {
  User.find({}, function(err, allUsers) {
    DeveloperChecklist.find({}, function(err, allChecklist) {
      res.render("checklist", { checklist: allChecklist, users: allUsers });
    });
  });
});

//POST new checklist
router.post("/", function(req, res) {
  var author = {
    id: req.user._id,
    firstName: req.user.firstName,
    email: req.user.email
  };
  var checklist = req.body.checklist;
  const newChecklist = Object.assign(checklist, { author: author });
  DeveloperChecklist.create(newChecklist, function(err, newlyChecked) {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Checklist Updated");
      res.redirect("/checklist");
    }
  });
});

//new Project form
router.get("/new", function(req, res) {
  User.find({}, function(err, allUsers) {
    res.render("checklist/new", { users: allUsers });
  });
});

module.exports = router;
