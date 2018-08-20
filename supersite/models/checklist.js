const mongoose = require("mongoose");

const developerChecklistSchema = new mongoose.Schema({
  taskName: {
   type: String 
},

  taskStatus: {
  type: String,
},

additionalNotes: {
    type: String
}
    
});

const developerChecklist = mongoose.model("developerChecklist", developerChecklistSchema);

module.exports = developerChecklist;