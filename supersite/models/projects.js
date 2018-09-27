const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: String,
    status: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        firstName: String,
        email: String
    },
    owner: [{
        firstName: {
            type: String
        },
        email: {
            type: String
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectComments"
    }],
    history: [{
        historyName: {
            type: String
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        time: {
            type: Date,
            default: Date.now
        }
    }],
}, {
    timestamps: {
        createdAt: 'created_at'
    }
});

module.exports = mongoose.model("Projects", projectSchema);