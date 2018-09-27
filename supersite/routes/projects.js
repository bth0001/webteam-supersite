var express = require("express");
var router = express.Router();
var Project = require("../models/projects");
var User = require("../models/user");
var middleware = require("../middleware");
var moment = require('moment');

//Index route
router.get("/", function(req, res){   
    Project.find({}, function(err, allProjects){
        if(err){
            console.log(err);
        } else {
            res.render("projects/index", {projects: allProjects, moment: moment});
        }
    });
});

//POST new Project
router.post("/", function(req, res){
    //Get Data from form
    var name = req.body.name;
    var status = req.body.status;
    var date = req.body.date;
    var desc = req.body.description;
    var owner = req.body.owner;
    var author = {id: req.user._id, firstName: req.user.firstName, email: req.user.email};
    var newProject = {name: name, status: status, date: date, description: desc, author: author};

    console.log("-------owner-----")
    console.log(owner.length);

    Project.create(newProject, function(err, newlyCreatedProject){
        console.log("-------NEW PROJECT-----")
        console.log(newlyCreatedProject);
        if(err){
            console.log(err);
        } else {
            //redirect back to projects
            req.flash("success", "You have successfully created a project");
            res.redirect("/projects");         
        }
    })
});

//new Project form
router.get("/new", function(req, res){
    User.find({}, function(err, allUsers){
        res.render("projects/new", {users: allUsers}); 
    })
});

//==============================================================================

//SHOW - show more info about one projects
router.get("/:id", function(req, res){
    //find the projects with provided ID
    Project.findById(req.params.id).populate("comments").exec(function(err, foundProject){
       if(err) {
           console.log(err);
       } else {
           console.log(foundProject);
         //render show template with that campground
         res.render("projects/show", {project: foundProject, moment: moment});
       }
    });

});

//edit projects route
router.get("/:id/edit", function(req, res){
        Project.findById(req.params.id, function(err, foundProject){
                    res.render("projects/edit", {project: foundProject, moment: moment});
});
});
//update projects route
// router.put("/:id", middleware.checkProjectOwnership, function(req, res){
//    //find and update correct project
//    Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updatedProject){
//        if(err){
//            res.redirect("/projects");
//        } else {
//            req.flash("success", "You have successfully updated the project");
//            res.redirect("/projects/" + req.params.id);
//        }
//    });
// });

/////////////////////////////////////

router.put("/:id", function(req, res){
  
    var historyArray = [];
    Project.findById(req.params.id, function(err, foundProject){
      for(i=0; i < foundProject.history.length; i++){
        historyArray.push(foundProject.history[i]);
      }
      var history = {historyName: req.user.firstName, id: req.user._id};
      historyArray.push(history);
     //find and update correct project
     var projectTracking = req.body.project;
     const newProject = Object.assign(projectTracking, {history: historyArray});
      Project.findByIdAndUpdate(req.params.id, newProject, function(err, updatedProject){
        if(err){
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
router.delete("/:id", middleware.checkProjectOwnership, function(req, res){
    Project.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/projects");
        } else {
            res.redirect("/projects");
        }
    });
});



module.exports = router;