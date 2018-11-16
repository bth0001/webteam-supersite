var express = require("express");
var router = express.Router();
var Project = require("../models/projects");
var User = require("../models/user");
var middleware = require("../middleware");
var moment = require("moment");

//Index route
router.get("/", function (req, res) {
  Project.find({}, function (err, allProjects) {
    if (err) {
      console.log(err);
    } else {
      res.render("projects/index", { projects: allProjects, moment: moment });
    }
  }).sort({ name: 1 });
});

router.get("/done", function (req, res) {
  Project.find({}, function (err, allProjects) {
    if (err) {
      console.log(err);
    } else {
      res.render("projects/completed", { projects: allProjects, moment: moment });
    }
  }).sort({ name: 1 });
});

//POST new Project
router.post("/", function (req, res) {
  //Get Data from form
  const { name, status, date, desc, owners, deadline, delivery, requestedBy } = req.body;
  var author = {
    id: req.user._id,
    firstName: req.user.firstName,
    email: req.user.email
  };
  var newProject = {
    name: name,
    status: status,
    date: date,
    description: desc,
    author: author,
    deadline: deadline,
    delivery: delivery,
    owners: owners,
    requestedBy: requestedBy
  };
  Project.create(newProject, function (err, newlyCreatedProject) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to projects
      req.flash("success", "You have successfully created a project");
      res.redirect("/projects");
    }
  });
});

//new Project form
router.get("/new", function (req, res) {
  User.find({}, function (err, allUsers) {
    res.render("projects/new", { users: allUsers });
  });
});

//==============================================================================

//SHOW - show more info about one projects
router.get("/:id", function (req, res) {
  //find the projects with provided ID
  Project.findById(req.params.id)
    .populate({ path: 'comments', options: { sort: { created_at: -1 } } })
    .exec(function (err, foundProject) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundProject);
        //render show template with that campground
        res.render("projects/show", { project: foundProject, moment: moment });
      }
    });
});

//edit projects route
router.get("/:id/edit", function (req, res) {
  User.find({}, function (err, allUsers) {
    Project.findById(req.params.id, function (err, foundProject) {
      res.render("projects/edit", {
        project: foundProject,
        moment: moment,
        users: allUsers
      });
    });
  });
});

router.put("/:id", function (req, res) {
  var historyArray = [];
  Project.findById(req.params.id, function (err, foundProject) {
    for (i = 0; i < foundProject.history.length; i++) {
      historyArray.push(foundProject.history[i]);
    }
    var history = { historyName: req.user.firstName, id: req.user._id };
    historyArray.push(history);
    //find and update correct project
    var projectTracking = req.body.project;
    if (projectTracking.status === "Completed") {
      projectTracking.completedDate = Date.now()
      projectTracking.isCompleted = true;
    }
    if (projectTracking.status.indexOf("Completed") === -1) {
      projectTracking.completedDate = null;
      projectTracking.isCompleted = false;
    }
    const newProject = Object.assign(projectTracking, {
      history: historyArray
    });
    Project.findByIdAndUpdate(req.params.id, newProject, function (
      err,
      updatedProject
    ) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/projects");
      } else {
        req.flash("success", "You have successfully updated the Project");
        res.redirect("/projects/" + req.params.id);
      }
    });
  });
});

///////////////////////////

//Destroy Route
router.delete("/:id", middleware.checkProjectOwnership, function (req, res) {
  Project.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/projects");
    } else {
      res.redirect("/projects");
    }
  });
});

module.exports = router;
