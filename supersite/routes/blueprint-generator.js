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

// Main landing page for blueprints
router.get("/", function(req, res) {
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

// See all blueprints route (not archived)
router.get("/see-all", function(req, res) {
  TeamTracker.find({}, function(err, allTracks) {
    User.find({}, function(err, allUsers) {
      Blueprint.find({}, function(err, allBlueprints) {
        if (err) {
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

// See all blueprints route (arhived)
router.get("/see-all/archive", function(req, res) {
  TeamTracker.find({}, function(err, allTracks) {
    User.find({}, function(err, allUsers) {
      Blueprint.find({}, function(err, allBlueprints) {
        if (err) {
          console.log(err);
        } else {
          res.render("blueprint-generator/archive", {
            tracking: allTracks,
            users: allUsers,
            blueprints: allBlueprints
          });
        }
      })
    })
  })
});

// New blueprint page
router.get("/new", function(req, res) {
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

// Grabs user input and creates new blueprint
router.post("/new", function(req, res) {
  var author = {
    id: req.user._id,
    firstName: req.user.firstName
  };
  var blueprint = req.body.blueprint;
  const newBP = Object.assign(blueprint, {
    author: author
  });
  Blueprint.create(newBP, function(err, newBlueprint) {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Your blueprint has been created!");
      res.redirect("/blueprint-generator");
    }
  });
});

// Sends data to docx template and downloads the file onto the users computer
router.get("/see-all/download/:id", function(req, res) {
  var data = req.params.id;
  Blueprint.findById(data, function(err, findBlueprint) {
    if (err) {
      console.log(err);
    } else {
      var content = fs.readFileSync(path.resolve(__dirname, 'word/blueprint_template.docx'), 'binary');
      var zip = new JSZip(content);
      var doc = new Docxtemplater();
      doc.loadZip(zip);
      doc.setData(findBlueprint).render();
      var buf = doc.getZip().generate({
        type: 'nodebuffer'
      });
      fs.writeFileSync(path.resolve(__dirname, 'word/blueprint_template_output.docx'), buf);
      req.flash("success", "Starting Download...");
      var file = path.join(__dirname + '/word/blueprint_template_output.docx');
      res.download(file, findBlueprint.practiceName + " Blueprint.docx");
    }
  });
});
// New blueprint page
router.get("/new", function(req, res) {
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

// Find and Update
router.put("/:id", function(req, res){
  var blueprint = req.body.blueprint;
  Blueprint.findByIdAndUpdate(req.params.id, blueprint, function(err, updatedTracker){
     if(err){
         req.flash("error", err.message);
         res.redirect("/blueprint-generator/see-all");
      } else {
          req.flash("success", "You have successfully deleted the blueprint!");
          res.redirect("/blueprint-generator/see-all");
      }
  });
 });

// Delete
router.delete("/see-all/delete/:id", function(req, res) {
  Blueprint.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blueprint-generator/see-all");
    } else {
      req.flash("success", "Blueprint has been deleted!");
      res.redirect("/blueprint-generator/see-all");
    }
  });
});
module.exports = router;