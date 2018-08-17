var express = require('express');
var router = express.Router();

// Dashboard Index Route
router.get("/", function(req, res){
  res.render("idea-warehouse");
})

  
module.exports = router;