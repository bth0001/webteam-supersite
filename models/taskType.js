var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create model taskType
var TaskTypeSchema = new Schema( {
  taskName: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false
  }
}, { timestamps: true});
 // end TaskTypeSchema

function date2String(date){
  var options = {
    weekday:'long', year:'numeric', month: 'short',
    day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'
  };
  return date.toLocaleDateString('en-US', options);
  }

  TaskTypeSchema.methods.getCreatedAt = function() {
    return date2String(this.createdAt);
  };

  TaskTypeSchema.methods.getUpdatedAt = function() {
    return date2String(this.updatedAt);
  };

// make model avail for use
module.exports = mongoose.model('taskType', TaskTypeSchema);
