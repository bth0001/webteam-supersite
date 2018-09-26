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
    archived: {
      type: Boolean
    },
    checklistTask: [
      {
        taskName: {
          type: String
        },
        taskStatus: {
          type: String
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
