var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
  res.render("index");
});

router.get("/dashboard", function(req, res){
  res.render("dashboard");
});

router.get("/tracker", function(req, res){
  res.render("tracker");
})

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
          console.log(err);
          return res.render("signup")
      }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/dashboard");
      });
  });
});
//==============================================================================

//Show Login Form
router.get("/login", function(req, res){
  res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
  {
      successRedirect: "/dashboard", 
      failureRedirect: "/login"
  }), function(req, res){
});
//==============================================================================

//Logout route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/login");
});
//==============================================================================

//middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}


module.exports = router;