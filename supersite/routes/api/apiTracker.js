const express = require("express");
const router = express.Router();

// Tracker Model
const db = require("../../models");

// @route   GET api/items
// @desc    Get All Items
// @access  Private
router.get("/", (req, res) => {
  db.TeamTracker.find()
    .sort({ date: -1 })
    .then(trackers => res.json(trackers))
    .catch(err => res.status(404).json(err));
});

module.exports = router;
