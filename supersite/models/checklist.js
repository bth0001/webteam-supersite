const mongoose = require("mongoose");

const developerChecklistSchema = new mongoose.Schema(
  {
    buildPkg: {
      type: String
    },
    date: {
      type: Date
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      firstName: String,
      email: String
    },

    domain: {
      type: String
    },
    archive: {
      type: Boolean,
      default: false
    },
    checklistTask: [
      {
        taskName: {
          type: String
        },
        taskStatus: {
          type: String,
          default: "N/A"
        },
        additionalNotes: {
          type: String
        }
      }
    ]
  },
  { timestamps: { createdAt: "created_at" } }
);

const DeveloperChecklist = mongoose.model(
  "developerChecklist",
  developerChecklistSchema
);

module.exports = DeveloperChecklist;
