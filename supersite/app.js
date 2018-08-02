var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var localStrategy = require("passport-local");
var session = require("express-session");

var db = require("./models/index")
var User = require("./models/user");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: true}));
//==============================================================================
//PASSPORT CONFIGURATION
app.use(session({
  secret: "Shana is amazing",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//==============================================================================

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
