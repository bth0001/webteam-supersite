const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema(
  {
    version: Number,
    description: String,
    status: String,
    releaseDate: Date,
    isReleased: {
      type: Boolean,
      default: false
    },
    closed: {
      type: Boolean,
      default: false
    },
    closedDate: Date,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      firstName: String,
      email: String
    },
    versionItems: [
      {
        item: String
      }
    ],
    bugs: [
      {
        item: String
      }
    ],
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
    ]
  },
  {
    timestamps: {
      createdAt: "created_at"
    }
  }
);

module.exports = mongoose.model("Version", versionSchema);
