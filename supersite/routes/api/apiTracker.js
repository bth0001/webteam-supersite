const express = require("express");
const router = express.Router();
const db = require("../../models");

router.get("/", function(req, res) {
    var start = new Date(req.query.startDate);
    var end = new Date(req.query.endDate);
    var user = req.query.users;
    if (user === undefined) {user = req.user._id;}
    console.log(user);
    //db.TeamTracker.find({created_at: {$gte: start, $lt: end}})
    db.TeamTracker.find({ $and: [
      {created_at: {$gte: start, $lt: end}},
      { "author.id": user }
    ]}).then(function(allTracks) {
            res.send(allTracks);
        })
        .catch(function(err) {
            res.send(err);
        });
});

// API to pre-populate tracker form if account # exist
router.get("/check-existing", function(req, res) {
    var number = req.query.search;
    db.TeamTracker.find({"acctNum": number }).then(function(allTracks) {
        console.log(allTracks);
        res.send(allTracks);
    }).catch(function(err) {
      res.send(err);
    });
});

module.exports = router;