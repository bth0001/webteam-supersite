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

router.get("/:id", function(req, res) {
  DeveloperChecklist.findById(req.params.id).exec(function(err, allChecklist) {
    User.find({}, function(err, allUsers) {
      if (err) {
        console.log(err);
      } else {
        //render show template with that campground
        res.render("checklist/show", {
          checklist: allChecklist,
          users: allUsers
        });
      }
    });
  });
});

//edit tracker route
router.get("/:id/edit", function(req, res) {
  DeveloperChecklist.findById(req.params.id, function(err, foundChecklist) {
    User.find({}, function(err, allUsers) {
      res.render("checklist/edit", {
        checklist: foundChecklist,
        users: allUsers
      });
    });
  });
});

//update tracker route
router.put("/:id", function(req, res) {
  DeveloperChecklist.findByIdAndUpdate(
    req.params.id,
    req.body.checklist,
    function(err, updatedChecklist) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/checklist");
      } else {
        req.flash("success", "You have successfully updated the Checklist");
        res.redirect("/checklist/" + req.params.id);
      }
    }
  );
});

//Destroy Route
router.delete("/:id", function(req, res) {
  DeveloperChecklist.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/checklist");
    } else {
      res.redirect("/checklist");
    }
  });
});
module.exports = router;
