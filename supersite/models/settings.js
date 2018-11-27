const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    buildPkg: {
      type: String,
      default: null
    },
    server: {
      type: String,
      default: null
    },
    starterTemplate: {
      type: String,
      default: null
    },
    taskTypes: [
      {
        taskTypeName: {
          type: String
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
  {
    timestamps: {
      createdAt: "created_at"
    }
  }
);

module.exports = mongoose.model("Settings", settingsSchema);
