const mongoose = require("mongoose");

const developerChecklistSchema = new mongoose.Schema({
  buildPkg:{
    type: String
  },
developer: {
  type: String
},
  domain: {
    type: String
  },

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