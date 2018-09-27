const mongoose = require("mongoose");

<<<<<<< HEAD
const projectSchema = new mongoose.Schema({
=======
const projectSchema = new mongoose.Schema(
  {
>>>>>>> 33a3f557f9b4f02fa284d0b662d47c76c5471aa8
    name: String,
    description: String,
    date: String,
    status: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        firstName: String,
        email: String
    },
    owner: [{
        firstName: {
            type: String
        },
        email: {
            type: String
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectComments"
    }],
    history: [{
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
    }],
}, {
    timestamps: {
        createdAt: 'created_at'
    }
});
    owners: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        firstName: String,
        email: String
      }
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectComments"
      }
    ]
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Projects", projectSchema);
