var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var TeamTracker = require("../models/teamTracker");
var taskType = require("../models/taskType");

var tracking = [
  {accNum: 212},
  {accNum: 213},
  {accNum: 214}
];

router.get("/", function(req, res){
  res.render("index");
});

router.get("/dashboard", isLoggedIn, function(req, res){
  res.render("dashboard");
});

router.get("/tracker", isLoggedIn, function(req, res){
  TeamTracker.find({}, function(err, allTracks){
    if(err){
      console.log(err);
    } else {
      res.render("tracker", {tracking: allTracks});
    }
  })
});

router.post("/tracker", function(req, res){
  const { acctNum, date, buildPkg, starterTemplate, specialFeatures, domain, server, note, }  = req.body;
  const author = {id: req.user._id, firstName: req.user.firstName};
  var newTrack = {acctNum: acctNum, author: author, date: date, buildPkg: buildPkg, starterTemplate: starterTemplate, specialFeatures: specialFeatures, domain: domain, server: server, note: note};
  TeamTracker.create(newTrack, function(err, newlyTracked){
    if(err){
      console.log(err)
    } else {
      console.log(newlyTracked);
      res.redirect("/tracker");
    }
  });
});

// router.get("/tracker/new", isLoggedIn, function(req, res){
//     res.render("trackerNew");
// })

router.get("/idea-warehouse", function(req, res){
  res.render("idea-warehouse");
})

router.get("/hats-off", function(req, res){
  res.render("hats-off");
})

router.get("/presence-url-tracker", function(req, res){
  res.render("presence-url-tracker");
})

router.get("/blueprint-generator", function(req, res){
  res.render("blueprint-generator");
})

router.get("/checklist", function(req, res){
  res.render("checklist");
})

router.get("/projects-tracker", function(req, res){
  res.render("projects-tracker");
})

//Register form route
router.get("/signup", function(req, res){
  res.render("signup")
});

//handles signup route
router.post("/signup", function(req, res){
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    profileImageUrl: req.body.profileImageUrl,
    team: req.body.team
  });
 
  User.register(newUser, req.body.password, function(err, user){
      if(err){
          req.flash("error", err.message);
          return res.render("signup");
      }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/dashboard");
      });
  });
});
//==============================================================================

//Show Login Form
router.get("/login", function(req, res){
  res.render("login", {});
});

//handling login logic
router.post("/login", passport.authenticate("local", 
  {
      successRedirect: "/dashboard", 
      failureRedirect: "/login",
      failureFlash: true
  }), function(req, res){
});
//==============================================================================

//Logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/login");
});
//==============================================================================

//middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error", "Please Login First!");
  res.redirect("/login");
}


module.exports = router;