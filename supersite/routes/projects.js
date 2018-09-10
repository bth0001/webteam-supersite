var express = require("express");
var router = express.Router();
var Project = require("../models/projects");
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
    var author = {id: req.user._id, firstName: req.user.firstName, email: req.user.email};
    var newProject = {name: name, status: status, date: date, description: desc, author: author};
    Project.create(newProject, function(err, newlyCreatedProject){
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
    res.render("projects/new");
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
router.get("/:id/edit", middleware.checkProjectOwnership, function(req, res){
        Project.findById(req.params.id, function(err, foundProject){
                    res.render("projects/edit", {project: foundProject, moment: moment});
});
});
//update projects route
router.put("/:id", middleware.checkProjectOwnership, function(req, res){
   //find and update correct project
   Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updatedProject){
       if(err){
           res.redirect("/projects");
       } else {
           req.flash("success", "You have successfully updated the project");
           res.redirect("/projects/" + req.params.id);
       }
   });
});


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