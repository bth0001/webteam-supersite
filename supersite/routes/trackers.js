var express = require("express");
var router = express.Router();
var TeamTracker = require("../models/teamTracker");
var User = require("../models/user");
var TaskTypes = require("../models/taskType");
var middleware = require("../middleware");

//Index route
router.get("/", function(req, res) {
  TeamTracker.find({}, function(err, allTracks) {
    User.find({}, function(err, allUsers) {
      TaskTypes.find({}, function(err, allTask) {
        if (err) {
          console.log(err);
        } else {
          res.render("tracker", {
            tracking: allTracks,
            users: allUsers,
            task: allTask
          });
        }
      });
    });
  });
});
//archive route
router.get("/archive", function(req, res) {
  TeamTracker.find({}, function(err, allTracks) {
    User.find({}, function(err, allUsers) {
      TaskTypes.find({}, function(err, allTask) {
        if (err) {
          console.log(err);
        } else {
          res.render("tracker/archive", {
            tracking: allTracks,
            users: allUsers,
            task: allTask
          });
        }
      });
    });
  });
});

//POST new teamTracked
router.post("/", function(req, res) {
  var author = {
    id: req.user._id,
    firstName: req.user.firstName,
    email: req.user.email
  };
  var teamTrack = req.body.teamTrack;
  const newTrack = Object.assign(teamTrack, { author: author });
  TaskTypes.create(teamTrack.taskTypes, function(err, newlyTask) {
    TeamTracker.create(newTrack, function(err, newlyTracked) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/");
      } else {
        req.flash("success", "Successful Tracker Added");
        res.redirect("/dashboard");
      }
    });
  });
});

router.get("/:id", function(req, res) {
  TeamTracker.findById(req.params.id).exec(function(err, allTracks) {
    TaskTypes.find({}, function(err, allTasks) {
      User.find({}, function(err, allUsers) {
        if (err) {
          console.log(err);
        } else {
          //render show template with that campground
          res.render("tracker/show", {
            tracking: allTracks,
            users: allUsers,
            task: allTasks
          });
        }
      });
    });
  });
});

//edit tracker route
router.get("/:id/edit", middleware.checkTrackerOwnership, function(req, res) {
  TeamTracker.findById(req.params.id, function(err, foundTracked) {
    TaskTypes.find({}, function(err, allTasks) {
      User.find({}, function(err, allUsers) {
        res.render("tracker/edit", {
          tracking: foundTracked,
          users: allUsers,
          task: allTasks
        });
      });
    });
  });
});

//update tracker route
router.put("/:id", middleware.checkTrackerOwnership, function(req, res) {
  var historyArray = [];
  TeamTracker.findById(req.params.id, function(err, foundTracked) {
    for (i = 0; i < foundTracked.history.length; i++) {
      historyArray.push(foundTracked.history[i]);
    }
    var history = { historyName: req.user.firstName, id: req.user._id };
    historyArray.push(history);
    //find and update correct tracker
    var teamTracking = req.body.tracking;
    var taskTrack = req.body.teamTrack;
    const newTrack = Object.assign(teamTracking, taskTrack, {
      history: historyArray
    });
    TeamTracker.findByIdAndUpdate(req.params.id, newTrack, function(
      err,
      updatedTracker
    ) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/tracker");
      } else {
        req.flash("success", "You have successfully updated the Task");
        res.redirect("/tracker/" + req.params.id);
      }
    });
  });
});

//Destroy Route
router.delete("/:id", function(req, res) {
  TeamTracker.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/tracker");
    } else {
      res.redirect("/tracker");
    }
  });
});

module.exports = router;
