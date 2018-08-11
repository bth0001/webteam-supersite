var express = require("express");
var router = express.Router();
var TeamTracker = require("../models/teamTracker");
var User = require("../models/user");
var TaskTypes = require("../models/taskType");


//Index route
router.get("/", isLoggedIn, function(req, res){
  TeamTracker.find({}, function(err, allTracks){
    User.find({}, function(err, allUsers){
      TaskTypes.find({}, function(err, allTask){
    if(err){
      console.log(err);
    } else {
      res.render("tracker", {
        tracking: allTracks,
        users: allUsers,
        task: allTask
      });
    }
  })
  })
})
});

//POST new teamTracked
router.post("/", isLoggedIn, function(req, res){
  // var task = {taskType: req.body.taskType, quantity: req.body.quantity, taskNotes: req.body.taskNotes};
  var author = {id: req.user._id, firstName: req.user.firstName};
  var { taskTypeName, quantity, taskNotes} = req.body;
  var taskTypes = {taskTypeName: taskTypeName, quantity: quantity, taskNotes: taskNotes}
    TaskTypes.create(taskTypes, function(err, newlyTask){
      var { acctNum, date, buildPkg, starterTemplate, specialFeatures, domain, cssPath, server, notes, onboarder, designer}  = req.body;
      var newTrack = {acctNum: acctNum, author: author, date: date, buildPkg: buildPkg, starterTemplate: starterTemplate, specialFeatures: specialFeatures, domain: domain, cssPath: cssPath, server: server, notes: notes, onboarder: onboarder, designer: designer, taskTypes: taskTypes};
      TeamTracker.create(newTrack, function(err, newlyTracked){
    if(err){
      console.log(err)
    } else {
      console.log(taskTypes);
      res.redirect("/dashboard");
    }
    });
  });
});


//==============================================================================

//SHOW - show more info about one campground
router.get("/:id", isLoggedIn, function(req, res){
    //find the campground with provided ID - .populate("comments")
    TeamTracker.findById(req.params.id).exec(function(err, allTracks){
      User.find({}, function(err, allUsers){
       if(err) {
         console.log(err);
       } else {
           console.log(allTracks);
         //render show template with that campground
         res.render("tracker/show", {
          tracking: allTracks,
          users: allUsers
        });
      }
    })
  })
});

//edit tracker route
router.get("/:id/edit", isLoggedIn , function(req, res){
  TeamTracker.findById(req.params.id, function(err, foundTracked){
    User.find({}, function(err, allUsers){
      res.render("tracker/edit", {
      tracking: foundTracked,
      users: allUsers
    });
  })
})
});

//update tracker route
router.put("/:id", isLoggedIn, function(req, res){
   //find and update correct tracker
   TeamTracker.findByIdAndUpdate(req.params.id, req.body.tracking, function(err, updatedTracker){
       if(err){
        console.log()
          req.flash("error", err.message);
          res.redirect("/tracker");
       } else {
           req.flash("success", "You have successfully updated the Task");
           res.redirect("/tracker/" + req.params.id);
       }
   });
});


//Destroy Route
router.delete("/:id", isLoggedIn, function(req, res){
    TeamTracker.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/tracker");
        } else {
            res.redirect("/tracker");
        }
    });
});
//Delete Route

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login")
}

module.exports = router;