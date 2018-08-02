var express = require("express");
var router = express.Router();
var User = require("../models/user");

// ===== INDEX =====
router.get("/", function(req, res){
    // Get all from database
    User.find({}, function(err, allCampgrounds){
       if(err){
           console.log("Something went wrong");
           console.log(err);
       } else {
           res.render("campgrounds/index", {campgrounds : allCampgrounds});
       }
    });
    //res.render("campgrounds", {campgrounds : campgrounds});
});

// ===== Post request to the same route as above =====
router.post("/", isLoggedIn, function(req, res){
    //get data from form and add to the campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
             id: req.user.id,
             username: req.user.username
    }
    var newCampground = {name: name, image: image, description : description, author : author}
    //campgrounds.push(newCampground);
    // Create a new campground and save to the database
    Campground.create(newCampground, function(err, newlyCreatedCampground){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// ===== Shows the new campground form =====
router.get("/new", isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// ===== Show info on one campground =====
router.get("/:id", function(req, res){
    // Capture id and show the corresponding campground
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground : foundCampground});
        }
    });
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;