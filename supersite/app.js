// Packages
var express = require('express');
var app = express();
var flash = require("connect-flash");
var router = express.Router();
var bodyParser = require("body-parser");
var passport = require("passport");
var localStrategy = require("passport-local");
var session = require("express-session");
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var smtpTransport = require('nodemailer-smtp-transport');
var xoauth2 = require('xoauth2');
var methodOverride = require("method-override");
var multer = require('multer');
var moment = require('moment');

// Required Files
var db = require("./models/index")
var User = require("./models/user");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var trackerRoutes = require('./routes/trackers');
var authRoutes = require('./routes/authentication');
var resetRoutes = require('./routes/forgotPassword');
var dashboardRouter = require('./routes/dashboard');
var ideaWarehouseRouter = require('./routes/idea-warehouse');
var hatsOffRouter = require('./routes/hats-off');
var presenceUrlTrackerRouter = require('./routes/presence-url-tracker');
var blueprintGeneratorRouter = require('./routes/blueprint-generator');
var checklistRouter = require('./routes/checklist');
var projectsRouter = require('./routes/projects');
var projectCommentsRouter = require('./routes/projectsComment');

// view engine setup
app.set('view engine', 'ejs');
app.set('debug', true);
app.use(express.static("public"));
app.use('/downloads', express.static('routes/word'))
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
//==============================================================================
//PASSPORT CONFIGURATION
app.use(session({
  secret: "Shana is amazing",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// passport.use(User.createStrategy({
//   passReqToCallback : true
// }));
passport.use(User.createStrategy(function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect e-mail.' });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



//==============================================================================
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// ----For Route Files----start
app.use('/', [
  indexRouter,
  authRoutes,
  resetRoutes
]);

app.all("*", isLoggedIn); // For Authentication 
app.use('/tracker', trackerRoutes);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/idea-warehouse', ideaWarehouseRouter);
app.use('/hats-off', hatsOffRouter);
app.use('/presence-url-tracker', presenceUrlTrackerRouter);
app.use('/blueprint-generator', blueprintGeneratorRouter);
app.use('/checklist', checklistRouter);
app.use('/projects', projectsRouter);
app.use('/projects/:id/projectComments', projectCommentsRouter);
// ----For Route Files----end

app.get('/forgot', function(req, res) {
  res.render('forgot', {
    user: req.user
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.flash("error", "Please Log in First!");
  res.redirect("/");
}

module.exports = app;
