var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var localStrategy = require("passport-local");
var session = require("express-session");
var User = require("../models/user");
//----Image Upload Start
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname); // sets file name
  },
   destination: function (req, file, cb) {
    cb(null, "uploads"); //file upload destination
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ // options
    storage: storage,
    fileFilter: imageFilter
})
//----Image Upload End

//Register form route
router.get("/signup", function(req, res){
    res.render("signup")
  });
  
  //handles signup route
  router.post("/signup", upload.single('image'), function(req, res){
    req.body.profileImageUrl = req.file.path; //grabs file path and assigns to profileImageUrl
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
  router.get("/", function(req, res){
    res.render("index", {});
  });
  
  //handling login logic
  router.post("/", passport.authenticate("local", 
    {
        successRedirect: "/dashboard", 
        failureRedirect: "/",
        failureFlash: true
    }), function(req, res){
  });
  //==============================================================================
  
  //Logout route
  router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfully logged out!");
    req.session.destroy();
    res.redirect("/");
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
  
  router.post('/edit-profile', upload.single('image'), function(req, res, next){
    User.findById(req.user.id, function (err, sanitizedUser) {
      req.body.profileImageUrl = req.file.path; //grabs file path and assigns to profileImageUrl
        if (!sanitizedUser) {
            req.flash('error', 'No account found');
            return res.redirect('/edit-profile');
        }
        var email = req.body.email;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var profileImageUrl = req.body.profileImageUrl;
        var team = req.body.team;
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
