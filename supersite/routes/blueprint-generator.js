var express = require("express");
var router = express.Router({
    mergeParams: true
});
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');
var flatten = require('flat');
var TeamTracker = require("../models/teamTracker");
var User = require("../models/user");
var Blueprint = require("../models/blueprint");

// Dashboard Index Route
router.get("/", /*isLoggedIn,*/ function(req, res) {
    TeamTracker.find({}, function(eryr, allTracks) {
        User.find({}, function(err, allUsers) {
            Blueprint.find({}, function(err, allBlueprints) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("blueprint-generator/home", {
                        tracking: allTracks,
                        users: allUsers,
                        blueprint: allBlueprints
                    });
                }
            })
        })
    })
});

// See All Blueprints Page
router.get("/see-all", /* isLoggedIn, */ function(req, res){
    TeamTracker.find({}, function(err, allTracks){
      User.find({}, function(err, allUsers){
        Blueprint.find({}, function(err, allBlueprints) {
      if(err){
        console.log(err);
      } else {
        res.render("blueprint-generator/see-all", {
          tracking: allTracks,
          users: allUsers,
          blueprints: allBlueprints
        });
      }
    })
    })
  })
  });


// New Blueprint Page
router.get("/new", /*isLoggedIn,*/ function(req, res) {
    TeamTracker.find({}, function(err, allTracks) {
        User.find({}, function(err, allUsers) {
            Blueprint.find({}, function(err, allBlueprints) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("blueprint-generator/new", {
                        tracking: allTracks,
                        users: allUsers,
                        blueprint: allBlueprints
                    });
                }
            })
        })
    })
});


// CREATE ROUTE
router.post("/new", function(req, res) {
    // create blog and then redirect to the index
    Blueprint.create(req.body.blueprint, function(err, newBlueprint) {
        var data = req.body.blueprint;
        if (err) {
            console.log(err);
        } else {
            var content = fs
                .readFileSync(path.resolve(__dirname, 'word/blueprint_template.docx'), 'binary');
            var zip = new JSZip(content);
            var doc = new Docxtemplater();
            doc.loadZip(zip);
            doc.setData(data).render();
            var buf = doc.getZip()
                .generate({
                    type: 'nodebuffer'
                });
            fs.writeFileSync(path.resolve(__dirname, 'word/blueprint_template_output.docx'), buf);
            res.send("Success");
        }
    });
});



//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}


module.exports = router;