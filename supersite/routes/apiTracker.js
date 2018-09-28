const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", function(req, res) {
  db.TeamTracker.find()
    .then(function(allTracks) {
      res.json(allTracks);
    })
    .catch(function(err) {
      res.send(err);
    });
});

router.post("/", function(req, res) {
  db.TeamTracker.create(req.body)
    .then(function(newTracked) {
      res.json(newTracked);
    })
    .catch(function(err) {
      res.send(err);
    });
});

module.exports = router;
