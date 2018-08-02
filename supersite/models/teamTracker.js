const mongoose = require("mongoose");

const teamTrackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: Date
  },
  acctNum: {
    type: Number,
    required: true
  },
  taskType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },
  buildPkg: {
    type: String
  },
  starterTemplate: {
    type: String
  },
  specialFeatures: {
    type: String
  },
  domain: {
    type: String
  },
  server: {
    type: String
  },
  notes: {
    type: String
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  onboarder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});


const TeamTracker = mongoose.model("TeamTracker", teamTrackerSchema);

module.exports = TeamTracker;