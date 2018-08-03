var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
  res.render("index");
});

router.get("/dashboard", isLoggedIn, function(req, res){
  res.render("dashboard");
});

router.get("/tracker", isLoggedIn, function(req, res){
  res.render("tracker");
});


router.post("/tracker", function(req, res){
  res.render("tracker");
});

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