const mongoose = require("mongoose");

const projectCommentSchema = mongoose.Schema({
    text: String, 
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        firstName: String,
        email: String
    },
    time: { 
        type : Date, 
        default: Date.now 
    }
}, {timestamps: {createdAt: 'created_at'}});


module.exports = mongoose.model("ProjectComments", projectCommentSchema);