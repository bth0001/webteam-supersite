var express = require("express");
var router = express.Router();
var TeamTracker = require("../models/teamTracker");
var User = require("../models/user");
var TaskTypes = require("../models/taskType");


//Index route
router.get("/", function(req, res){
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
router.post("/", function(req, res){
  var author = {id: req.user._id, firstName: req.user.firstName};
  var teamTrack = req.body.teamTrack;
  const newTrack = Object.assign(teamTrack, {author: author});
  TaskTypes.create(teamTrack.taskTypes, function(err, newlyTask){
    TeamTracker.create(newTrack, function(err, newlyTracked){
    if(err){
      console.log(err)
    } else {
      res.redirect("/dashboard");
    }
   });
  });
});

//==============================================================================
//SHOW - show more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID - .populate("comments")
    TeamTracker.findById(req.params.id).exec(function(err, allTracks){
      User.find({}, function(err, allUsers){
       if(err) {
         console.log(err);
       } else {
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
router.get("/:id/edit", function(req, res){
  TeamTracker.findById(req.params.id, function(err, foundTracked){
    TaskTypes.find({}, function(err, allTasks){
      User.find({}, function(err, allUsers){
        res.render("tracker/edit", {
        tracking: foundTracked,
        users: allUsers,
        task: allTasks
      });
    })
  })
})
});

//update tracker route
router.put("/:id", function(req, res){
   //find and update correct tracker
   var author = {id: req.user._id, firstName: req.user.firstName};
   var teamTracking = req.body.tracking;
   var taskTrack = req.body.teamTrack;
   const newTrack = Object.assign(teamTracking, {author: author}, taskTrack);
   TeamTracker.findByIdAndUpdate(req.params.id, newTrack, function(err, updatedTracker){
    console.log("test");
      if(err){
          req.flash("error", err.message);
          res.redirect("/tracker");
       } else {
           req.flash("success", "You have successfully updated the Task");
           res.redirect("/tracker/" + req.params.id);
       }
   });
  });



//Destroy Route
router.delete("/:id", function(req, res){
    TeamTracker.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/tracker");
        } else {
            res.redirect("/tracker");
        }
    });
});

module.exports = router;