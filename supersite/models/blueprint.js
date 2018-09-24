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
    ref: "User",
    default: null
  },
  designer: {
      type: String,
      ref: "User",
      default: null
  },
  homeScreenshot: {
    type: String,
    default: null
  },
  interiorScreenshot: {
    type: String,
    default: null
  },
  howManyDoctors: {
    type: Number,
    default: null
  },
  doctors: [{
    doctorName: {
      type: String, 
      default: null
    }
  }],
  practiceName: {
    type: String,
    default: null
  },
  contactName: {
    type: String,
    default: null
  },
  contactEmail: {
    type: String,
    default: null
  },
  contactNumber: {
    type: String,
    default: null
  },
  howManyOffices: {
    type: String,
    default: null
  },
  officeAddress: [{
    address: {
      type: String,
      default: null
    },
    number: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    zip: {
      type: String,
      default: null
    }
  }],
  dearDoctorID: {
    type: String,
    default: null
  },
  practiceEmail: {
    type: String,
    default: null
  },
  practicePhone: {
    type: String,
    default: null
  },
  practiceFax: {
    type: String,
    default: null
  },
  currentSiteURL: {
    type: String,
    default: null
  },
  clientUsername: {
    type: String,
    default: null
  },
  clientPassword: {
    type: String,
    default: null
  },
  tlink: {
    type: String,
    default: null
  },
  copywriteNotes: {
    type: String,
    default: null
  },
  designerNotes: {
    type: String,
    default: null
  },
  specialNotes: {
      notes: {
          type: String,
          default: null
      }
  },
  developerNotes: {
    type: String,
    default: null
  },
  siteArchitecture: [{
      parentPageName: {
        type: String, 
        default: null
      },
      parentPageNotes: {
        type: String,
        default: null
      },
      subpage: [{
        childPageName: {
          type: String,
          default: null
        },
        childPageNotes: {
          type: String,
          default: null
        }
      }]
  }],
  socialMedia: [{
    name: {
      type: String,
      default: null
    },
    link: {
      type: String,
      default: null
    }
  }],
  dateCreated: { 
    type : Date, 
    default: Date.now 
  },
  archive: {
    type: Boolean,
    default: false
  }
});

const BlueprintWizard = mongoose.model("BlueprintWizard", blueprintWizardSchema);

module.exports = BlueprintWizard;