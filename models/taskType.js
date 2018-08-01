var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// create model task
var taskType = new Schema( {
  taskName: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false
  }
}, { timestamps: true});
 // end ItemSchema

function date2String(date){
  var options = {
    weekday:'long', year:'numeric', month: 'short',
    day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'
  };
  return date.toLocaleDateString('en-US', options);
  }

  ItemSchema.methods.getCreatedAt = function() {
    return date2String(this.createdAt);
  };

  ItemSchema.methods.getUpdatedAt = function() {
    return date2String(this.updatedAt);
  };

// make model avail for use
module.exports = mongoose.model('taskType', taskTypeSchema);
