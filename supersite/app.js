// Packages
var express = require('express');
var app = express();
var flash = require("connect-flash");
var router = express.Router();
var bodyParser = require("body-parser");
var passport = require("passport");
var localStrategy = require("passport-local");
var session = require("express-session");
// Required Files
var db = require("./models/index")
var User = require("./models/user");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var trackerRoutes = require('./routes/trackers');
var authRoutes = require('./routes/authentication');
var dashboardRouter = require('./routes/dashboard');
var ideaWarehouseRouter = require('./routes/idea-warehouse');
var hatsOffRouter = require('./routes/hats-off');
var presenceUrlTracker = require('./routes/presence-url-tracker');
var blueprintGenerator = require('./routes/blueprint-generator');
var checklist = require('./routes/checklist');
var projectsTracker = require('./routes/projects-tracker');

// view engine setup
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser());
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
passport.use(User.createStrategy({
  passReqToCallback : true
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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
  trackerRoutes, 
  authRoutes
]);

app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/idea-warehouse', ideaWarehouseRouter);
app.use('/hats-off', hatsOffRouter);
app.use('/presence-url-tracker', presenceUrlTracker);
app.use('/blueprint-generator', blueprintGenerator);
app.use('/checklist', checklist);
app.use('/projects-tracker', projectsTracker);
// ----For Route Files----end

module.exports = app;
