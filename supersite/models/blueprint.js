const mongoose = require("mongoose");

const blueprintWizardSchema = new mongoose.Schema({
  onboarder: {
    type: String,
    ref: "User"
},
  designer: {
      type: String,
      ref: "User"
  },
  homeScreenshot: {
    type: String
  },
  interiorScreenshot: {
    type: String
  },
  doctor: {
    type: String
  },
  howManyDoctors: {
    type: Number
  },
  practiceName: {
    type: String
  },
  contactName: {
    type: String
  },
  contactEmail: {
    type: String
  },
  contactNumber: {
    type: String
  },
  address: {
    type: String
  },
  howManyOffices: {
    type: String
  },
  dearDoctorID: {
    type: String
  },
  practiceEmail: {
    type: String
  },
  currentSiteURL: {
    type: String
  },
  clientUsername: {
    type: String
  },
  clientPassword: {
    type: String
  },
  copywriteNotes: {
    type: String
  },
  designerNotes: {
    type: String
  },
  specialNotes: {
      notes: {
          type: String
      }
  },
  developerNotes: {
    type: String
  },
  siteArchitecture: [{
      parentPageName: {
        type: String
      },
      parentPageNotes: {
        type: String
      },
      subpage: [{
        childPageName: {
          type: String
        },
        childPageNotes: {
          type: String
        }
      }]
  }]
});

const BlueprintWizard = mongoose.model("BlueprintWizard", blueprintWizardSchema);

module.exports = BlueprintWizard;