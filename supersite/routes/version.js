var express = require("express");
var router = express.Router();
var db = require("../models");
var moment = require("moment");

//Index route
router.get("/", function (req, res) {
  db.Version.find({}, function (err, allVersions) {
    if (err) {
      console.log(err);
    } else {
      res.render("versions/index", { versions: allVersions });
    }
  }).sort({ version: 1 });
});

//help route
router.get("/help", function (req, res) {
  db.Version.find({}, function (err, allVersions) {
    if (err) {
      console.log(err);
    } else {
      res.render("versions/help", { versions: allVersions });
    }
  });
});

//POST new Version
router.post("/", function (req, res) {
  //Get Data from form
  const { version, versionItems, description, bugs, isReleased, status } = req.body;
  var author = {
    id: req.user._id,
    firstName: req.user.firstName,
    email: req.user.email
  };
  var newVersion = {
    version,
    versionItems,
    bugs,
    status,
    description,
    author,
    isReleased
  };
  db.Version.create(newVersion, function (err, newlyCreatedVersion) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to Version
      req.flash("success", "You have successfully created a Version");
      res.redirect("/versions");
    }
  });
});

//new Version form
router.get("/new", function (req, res) {
  db.User.find({}, function (err, allUsers) {
    res.render("versions/new", { users: allUsers });
  });
});

// //SHOW - show more info about one projects
// router.get("/:id", function (req, res) {
//   //find the projects with provided ID
//   Project.findById(req.params.id)
//     .populate({ path: 'comments', options: { sort: { created_at: -1 } } })
//     .exec(function (err, foundProject) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(foundProject);
//         //render show template with that project
//         res.render("projects/show", { project: foundProject, moment: moment });
//       }
//     });
// });

//edit projects route
router.get("/:id/edit", function (req, res) {
  db.User.find({}, function (err, allUsers) {
    db.Version.findById(req.params.id, function (err, foundVersion) {
      res.render("versions/edit", {
        version: foundVersion,
        users: allUsers
      });
    });
  });
});

router.put("/:id", function (req, res) {
  var historyArray = [];
  db.Version.findById(req.params.id, function (err, foundVersion) {
    for (i = 0; i < foundVersion.history.length; i++) {
      historyArray.push(foundVersion.history[i]);
    }
    var history = { historyName: req.user.firstName, id: req.user._id };
    historyArray.push(history);
    //find and update correct project
    var versionTracking = req.body.version;
    if (versionTracking.status === "Completed") {
      versionTracking.completedDate = Date.now()
      versionTracking.isCompleted = true;
    }
    if (versionTracking.status.indexOf("Completed") === -1) {
      versionTracking.completedDate = null;
      versionTracking.isCompleted = false;
    }
    const newVersion = Object.assign(versionTracking, {
      history: historyArray
    });
    db.Version.findByIdAndUpdate(req.params.id, newVersion, function (
      err,
      updatedVersion
    ) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/versions");
      } else {
        req.flash("success", "You have successfully updated the Version");
        res.redirect("/versions/" + req.params.id);
      }
    });
  });
});

//Destroy Route
router.delete("/:id", function (req, res) {
  db.Version.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/versions");
    } else {
      res.redirect("/versions");
    }
  });
});

module.exports = router;
