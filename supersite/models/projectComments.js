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
    }
});


module.exports = mongoose.model("ProjectComments", projectCommentSchema);