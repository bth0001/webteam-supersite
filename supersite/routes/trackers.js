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
    TeamTracker.create(newTrack, function(err, newlyTracked){
      console.log(author.firstName);
      if(err){
      console.log(err)
    } else {
      res.redirect("/dashboard");
    }
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
router.get("/:id/edit", function(req, res){
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
router.put("/:id", function(req, res){
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