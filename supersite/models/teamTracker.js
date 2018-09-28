const mongoose = require("mongoose");
const User = require("./user");
const TaskType = require("./taskType");

// var UserSchema = require('mongoose').model('User').schema;
// var TaskTypeSchema = require('mongoose').model('TaskType').schema;

const teamTrackerSchema = new mongoose.Schema(
  {
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      firstName: String,
      email: String
    },
    date: {
      type: String
    },
    acctNum: {
      type: Number,
      required: true
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
    homeSS: {
      type: String
    },
    interiorSS: {
      type: String
    },
    designer: {
      type: String,
      ref: "User"
    },
    onboarder: {
      type: String,
      ref: "User"
    },
    archive: {
      type: Boolean,
      default: false
    },
    history: [
      {
        historyName: {
          type: String
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        time: {
          type: Date,
          default: Date.now
        }
      }
    ],
    taskTypes: [
      {
        taskTypeName: {
          type: String,
          required: true
        },
        quantity: {
          type: String,
          default: null
        },
        taskNotes: {
          type: String,
          default: "N/a"
        }
      }
    ]
  },
  { timestamps: { createdAt: "created_at" } }
);

const TeamTracker = mongoose.model("TeamTracker", teamTrackerSchema);

module.exports = TeamTracker;
