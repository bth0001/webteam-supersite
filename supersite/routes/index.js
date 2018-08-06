var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var TeamTracker = require("../models/teamTracker");
var taskType = require("../models/taskType");

router.get("/", function(req, res){
  res.render("index");
});

router.get("/dashboard", isLoggedIn, function(req, res){
  TeamTracker.find({}, function(err, allTracks){
    if(err){
      console.log(err);
    } else {
      res.render("dashboard", {tracking: allTracks});
    }
  })
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
  const { acctNum, date, buildPkg, starterTemplate, specialFeatures, domain, server, note }  = req.body;
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


router.get("/edit-profile", function(req, res){
  res.render("edit-profile");
});


router.post('/edit-profile', isLoggedIn, function(req, res, next){
  // User.findById(req.user.id).then(function(sanitizedUser){
  //     if (sanitizedUser){
  //         sanitizedUser.setPassword(req.body.password, function(){
  //             sanitizedUser.save();
  //             res.status(200).json({message: 'password reset successful'});
  //         });
  //     } else {
  //         res.status(500).json({message: 'This user does not exist'});
  //     }
  // },function(err){
  //     console.error(err);
  // });

  User.findById(req.user.id, function (err, sanitizedUser) {

      // todo: don't forget to handle err

      if (!sanitizedUser) {
          req.flash('error', 'No account found');
          return res.redirect('/edit-profile');
      }

      // good idea to trim 
      var email = req.body.email.trim();
      var firstName = req.body.firstName.trim();
      var lastName = req.body.lastName.trim();
      var profileImageUrl = req.body.profileImageUrl.trim();
      var team = req.body.team.trim();

      // validate 
      if (!email || !profileImageUrl || !firstName || !lastName || !team) { // simplified: '' is a falsey
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
              req.flash("error", "Email already in use");
              return res.redirect("/edit-profile");
            }
            // Some other error
            return res.status(500).send(err);
          }
           req.flash("success", "Password reset Successful");
           res.redirect('/dashboard');
        });
        // res.status(200).json({message: 'password reset successful'});
      
    });
      // sanitizedUser.save(function (err) {

      //     // todo: don't forget to handle err

      //     res.redirect('/dashboard');
      // });
  });
});

//middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error", "Please Login First!");
  res.redirect("/login");
}


module.exports = router;