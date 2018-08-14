const mongoose = require("mongoose");

const parentPageSchema = new mongoose.Schema({
    parentPageName: {
        type: String
    },
    parentPageNotes: {
        type: String
    }
})


const ParentPage = mongoose.model("ParentPageBlueprint", parentPageSchema);

module.exports = ParentPage;