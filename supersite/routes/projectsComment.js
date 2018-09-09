var express = require("express");
var router = express.Router({mergeParams: true});
var Projects = require("../models/projects");
var Comment = require("../models/projectComments");
var middleware = require("../middleware");

//Comments New
router.get("/new", function(req, res){
    Projects.findById(req.params.id, function(err, project){
        if(err){
            console.log(err);
        } else {
            res.render("projectComments/new", {project: project});
            
        }
    })
    
});

//Comments Create and save
router.post("/", function(req, res){
    //lookup project using ID
    Projects.findById(req.params.id, function(err, project){
        if(err) {
            console.log(err);
            res.redirect("/projects");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.firstName = req.user.username;
                    comment.author.email = req.user.email;
                    //save comment
                    comment.save();
                    project.comments.push(comment);
                    project.save();
                    req.flash("success", "You have successfully posted a comment");
                    res.redirect('/projects/' + project._id);
                }
            })
        }
    })
});

// comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("projectComments/edit", {project_id: req.params.id, comment: foundComment})
        }
    })
});

// comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/project/" + req.params.id);
        }
    })
});

// Destroy Comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Destroyed");
            res.redirect("/projects/" + req.params.id);
        }
    });
});





module.exports = router;