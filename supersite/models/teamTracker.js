const mongoose = require("mongoose");
const User = require("./user");
const TaskType = require("./taskType");

// var UserSchema = require('mongoose').model('User').schema;
// var TaskTypeSchema = require('mongoose').model('TaskType').schema;

const teamTrackerSchema = new mongoose.Schema({
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User"
  // },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    firstName: String
  },
  date: {
    type: String
  },
  acctNum: {
    type: Number,
    required: true
  },
  taskType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskType"
  },
  buildPkg: {
    type: String
  },
  starterTemplate: {
    type: String,
    default: null
  },
  specialFeatures: {
    type: String,
    default: null
  },
  domain: {
    type: String
  },
  cssPath: {
    type: String,
    default: null
  },
  server: {
    type: String
  },
  notes: {
    type: String
  },
  designer: {
      type: String,
      ref: "User"
  },
  onboarder: {
      type: String,
      ref: "User"
  }
});


const TeamTracker = mongoose.model("TeamTracker", teamTrackerSchema);

module.exports = TeamTracker;