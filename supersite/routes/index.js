var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var TeamTracker = require("../models/teamTracker");
var taskType = require("../models/taskType");

router.get("/", function(req, res){
  res.render("index");
});

module.exports = router;