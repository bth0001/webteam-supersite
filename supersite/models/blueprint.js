const mongoose = require("mongoose");

const blueprintWizardSchema = new mongoose.Schema({
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    firstName: String
  },
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
  howManyDoctors: {
    type: Number
  },
  doctors: [{
    doctorName: {
      type: String, 
      default: ""
    }
  }],
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
        type: String, 
        default: ""
      },
      parentPageNotes: {
        type: String,
        default: ""
      },
      subpage: [{
        childPageName: {
          type: String,
          default: ""
        },
        childPageNotes: {
          type: String,
          default: ""
        }
      }]
  }],
  socialMedia: [{
    name: {
      type: String
    },
    link: {
      type: String
    }
  }],
  dateCreated: { 
    type : Date, 
    default: Date.now 
  }
});

const BlueprintWizard = mongoose.model("BlueprintWizard", blueprintWizardSchema);

module.exports = BlueprintWizard;