const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", function(req, res) {
  db.User.find({}, function(err, allUsers) {
    res.render("meetTeam", { users: allUsers });
  }).sort({ firstName: 1 });
});

router.get("/:id", function(req, res) {
  db.User.findById(req.params.id).exec(function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      res.render("meetTeamShow", { user: foundUser });
    }
  });
});
module.exports = router;
