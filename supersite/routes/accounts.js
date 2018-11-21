var express = require("express");
var router = express.Router({ mergeParams: true });
var passport = require("passport");
var localStrategy = require("passport-local");
var session = require("express-session");
var db = require("../models");
//----Image Upload Start
var multer = require("multer");
var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname); // sets file name
  },
  destination: function (req, file, cb) {
    cb(null, "uploads"); //file upload destination
  }
});
var imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
var upload = multer({
  // options
  storage: storage,
  fileFilter: imageFilter
});
//----Image Upload End

router.get("/", function (req, res, next) {
  var perPage = 10;
  var pageQuery = parseInt(req.query.page);
  var pageNumber = pageQuery ? pageQuery : 1;
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    db.User.find({ firstName: regex })
      .collation({ locale: "en", caseLevel: false, caseFirst: "off" })
      .sort({ isMaster: -1 })
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function (err, foundUsers) {
        db.User.countDocuments({ firstName: regex }).exec(function (err, count) {
          if (err) {
            req.flash("error", "No Users Found");
            res.redirect("/accounts");
          } else {
            if (foundUsers.length < 1) {
              noMatch = "No users match that search, please try again.";
              req.flash("error", noMatch);
              return res.redirect("/accounts");
            }
            res.render("accounts/index", {
              users: foundUsers,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: req.query.search
            });
          }
        });
      });
  } else {
    // get all campgrounds from DB
    db.User.find({})
      .collation({ locale: "en", caseLevel: false, caseFirst: "off" })
      .sort({ isMaster: -1 })
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function (err, foundUsers) {
        db.User.countDocuments().exec(function (err, count) {
          if (err) {
            console.log(err);
          } else {
            res.render("accounts/index", {
              users: foundUsers,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: false
            });
          }
        });
      });
  }
});

router.get("/:id", function (req, res, next) {
  db.User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      req.flash("error", "User does not exist");
      res.redirect("/accounts");
    }
    res.render("accounts/edit", { user: foundUser });
  });
});

router.post("/:id", upload.single("image"), function (req, res) {
  db.User.findById(req.params.id, function (err, sanitizedUser) {
    if (!sanitizedUser) {
      req.flash("error", "No account found");
      return res.redirect("/accounts");
    }
    const { email, firstName, lastName, bio, socials, skills, team, quote, funFacts, birthday } = req.body;
    if (req.body.adminCode === "true") {
      sanitizedUser.isAdmin = true;
      sanitizedUser.isMaster = false;
    }
    if (req.body.masterCode === "true") {
      sanitizedUser.isMaster = true;
      sanitizedUser.isAdmin = false;
    }
    if (req.body.basicCode === "true") {
      sanitizedUser.isAdmin = false;
      sanitizedUser.isMaster = false;
    }
    // Check to see if image was inserted
    if (req.file === undefined || req.file === null) {
      profileImageUrl = sanitizedUser.profileImageUrl;
    } else {
      req.body.profileImageUrl = req.file.path;
      var profileImageUrl = req.body.profileImageUrl;
    }
    // validate
    if (!email || !firstName || !lastName) {
      // simplified: '' is a falsey
      req.flash("error", "One or more fields are empty");
      return res.redirect("/accounts"); // modified
    }
    // no need for else since you are returning early ^
    sanitizedUser.email = email;
    sanitizedUser.firstName = firstName;
    sanitizedUser.lastName = lastName;
    sanitizedUser.profileImageUrl = profileImageUrl;
    sanitizedUser.team = team;
    sanitizedUser.bio = bio;
    sanitizedUser.socials = socials;
    sanitizedUser.skills = skills;
    sanitizedUser.quote = quote;
    sanitizedUser.funFacts = funFacts;
    sanitizedUser.birthday = birthday;
    // don't forget to save!
    sanitizedUser.setPassword(req.body.password, function () {
      sanitizedUser.save(function (err) {
        if (err) {
          if (err.name === "MongoError" && err.code === 11000) {
            req.flash("error", "This email address is already in use.");
            return res.redirect("/accounts");
          }
          return res.status(500).send(err);
        }
        req.flash("success", "Your profile has successfully been updated.");
        res.redirect("/accounts");
      });
    });
  });
});

router.delete("/:id", function (req, res) {
  db.User.findByIdAndRemove(req.params.id, function (err, foundUser) {
    if (err) {
      req.flash("error", err);
      res.redirect("/accounts");
    } else {
      req.flash(
        "success",
        `${foundUser.firstName}'s account has been deleted.`
      );
      res.redirect("/accounts");
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
