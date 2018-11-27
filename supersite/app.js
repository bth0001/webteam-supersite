// Packages
const express = require("express");
const app = express();
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const methodOverride = require("method-override");
const moment = require("moment");

// ROUTES
const db = require("./models/index");
const indexRoutes = require("./routes/index");
const usersRoutes = require("./routes/users");
const trackerRoutes = require("./routes/trackers");
const authRoutes = require("./routes/authentication");
const resetRoutes = require("./routes/forgotPassword");
const dashboardRoutes = require("./routes/dashboard");
const ideaWarehouseRoutes = require("./routes/idea-warehouse");
const hatsOffRoutes = require("./routes/hats-off");
const presenceUrlTrackerRoutes = require("./routes/presence-url-tracker");
const blueprintGeneratorRoutes = require("./routes/blueprint-generator");
const checklistRoutes = require("./routes/checklist");
const projectsRoutes = require("./routes/projects");
const projectCommentsRoutes = require("./routes/projectsComment");
const teamRoutes = require("./routes/teamProfile");
const accountRoutes = require("./routes/accounts");
const versionRoutes = require("./routes/version");
const settingsRoutes = require("./routes/settings");
const errorHandler = require("./handlers/error");

// API ROUTES
const apiTracker = require("./routes/api/apiTracker");

// view engine setup
app.set("view engine", "ejs");
app.set("debug", true);
app.use(express.static("public"));
app.use("/downloads", express.static("routes/word"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

//==============================================================================
//PASSPORT CONFIGURATION
app.use(
  session({
    secret: "Shana is amazing",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  db.User.createStrategy(function (email, password, done) {
    db.User.findOne({ email: email }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Incorrect e-mail." });
      user.comparePassword(password, function (err, isMatch) {
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password." });
        }
      });
    });
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  db.User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.moment = moment;
  res.locals.rmWhitespace = true;
  next();
});


app.use("/api/tracker", apiTracker);
// ----For Route Files----start
app.use("/", [indexRoutes, authRoutes, resetRoutes]);
app.all("*", isLoggedIn); // For Authentication
app.use("/tracker", trackerRoutes);
app.use("/users", usersRoutes);
app.use("/team", teamRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/idea-warehouse", ideaWarehouseRoutes);
app.use("/hats-off", hatsOffRoutes);
app.use("/presence-url-tracker", presenceUrlTrackerRoutes);
app.use("/blueprint-generator", blueprintGeneratorRoutes);
app.use("/checklist", checklistRoutes);
app.use("/projects", projectsRoutes);
app.use("/projects/:id/projectComments", projectCommentsRoutes);
app.use("/settings", settingsRoutes);
app.use("/accounts", isController, accountRoutes);
app.use("/versions", isController, versionRoutes);

//Api Routes
app.use("/api", apiTracker);

// ----For Route Files----end

app.get("/forgot", function (req, res) {
  res.render("forgot", {
    user: req.user
  });
});

//Middleware for app.js
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Log in First!");
  res.redirect("/");
}

function isController(req, res, next) {
  if ((req.isAuthenticated() && req.user.isMaster) || (req.isAuthenticated() && req.user.isAdmin)) {
    return next();
  }
  req.flash("error", "Only Strom Troopers are able to view this page");
  res.redirect("/dashboard");
};

//ERROR HANDLING SETUP
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  req.flash("error", "Page does not Exist: 404");
  res.redirect("/");
});

app.use(errorHandler);

module.exports = app;
