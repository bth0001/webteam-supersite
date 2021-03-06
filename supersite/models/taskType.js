const mongoose = require("mongoose");

const taskTypeSchema = new mongoose.Schema({  
       
          taskTypeName: {
            type: String
          },
          quantity: {
            type: String
          },
          taskNotes: {
            type: String
          }
       
}, {timestamps: {createdAt: 'created_at'}});


const TaskType = mongoose.model("TaskType", taskTypeSchema);

module.exports = TaskType;