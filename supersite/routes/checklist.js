var express = require('express');
var router = express.Router();
var User = require("../models/user");
var DeveloperChecklist = require("../models/checklist");

// Checklist Index Route
router.get("/", function(req, res){
    res.render("checklist");
  });


//POST new checklist
router.post("/", function(req, res){
  var author = {id: req.user._id, firstName: req.user.firstName};
  var checklist = req.body.checklist;
  const newChecklist = Object.assign(checklist, {author: author});
    DeveloperChecklist.create(newChecklist, function(err, newlyChecked){
      if(err){
      console.log(err)
    } else {
      req.flash('success', 'Checklist Updated');
      res.redirect("/checklist");
    }
   });
  });


  module.exports = router;