var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Checklist = require("../models/checklist");

// Dashboard Index Route
router.get("/", function(req, res){
    res.render("checklist");
  });

  
  module.exports = router;