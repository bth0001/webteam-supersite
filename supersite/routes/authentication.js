var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var localStrategy = require("passport-local");
var session = require("express-session");
var User = require("../models/user");


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
    req.flash("success", "Your have successfully logged out!");
    res.redirect("/login");
  });
  //==============================================================================
  
  // EDIT Task
  router.get("/edit-task", function(req, res){
    res.render("edit-task");
  });

  //==============================================================================

  // EDIT Profile
  router.get("/edit-profile", function(req, res){
    res.render("edit-profile");
  });
  
  
  router.post('/edit-profile', function(req, res, next){
    User.findById(req.user.id, function (err, sanitizedUser) {
        if (!sanitizedUser) {
            req.flash('error', 'No account found');
            return res.redirect('/edit-profile');
        }
        var email = req.body.email.trim();
        var firstName = req.body.firstName.trim();
        var lastName = req.body.lastName.trim();
        var profileImageUrl = req.body.profileImageUrl.trim();
        var team = req.body.team.trim();
        // validate 
        if (!email || !firstName || !lastName || !team) { // simplified: '' is a falsey
            req.flash('error', 'One or more fields are empty');
            return res.redirect('/edit-profile'); // modified
        }
        // no need for else since you are returning early ^
        sanitizedUser.email = email;
        sanitizedUser.firstName = firstName;
        sanitizedUser.lastName = lastName;
        sanitizedUser.profileImageUrl = profileImageUrl;
        sanitizedUser.team = team;
        // don't forget to save!
        sanitizedUser.setPassword(req.body.password, function(){
          sanitizedUser.save(function(err){
            if (err) {
              if (err.name === 'MongoError' && err.code === 11000) {
                req.flash("error", "This email address is already in use.");
                return res.redirect("/edit-profile");
              }
              return res.status(500).send(err);
            }
             req.flash("success", "Your profile has successfully been updated.");
             res.redirect('/dashboard');
          });
      });
    });
  });

    module.exports = router;
