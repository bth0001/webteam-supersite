var express = require('express');
var router = express.Router();

// Dashboard Index Route
router.get("/", function(req, res){
  res.render("idea-warehouse");
})

  //middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
  }
  
  
  module.exports = router;