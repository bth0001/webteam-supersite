var express = require('express');
var router = express.Router();

// Dashboard Index Route
router.get("/", function(req, res){
    res.render("hats-off");
  });

  
  module.exports = router;