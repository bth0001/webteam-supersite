const mongoose = require("mongoose");

const taskTypeSchema = new mongoose.Schema({
  name: {
    type: String
  },
  quantity: {
    type: String
  },
  notes: {
    type: String
  }
});


const TaskType = mongoose.model("TaskType", taskTypeSchema);

module.exports = TaskType;