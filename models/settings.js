import mongoose from 'mongoose';

// Define a sub-schema for couches
const couchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
});

// Define a sub-schema for trainees (with required fields set to false)
const traineeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: false, // Not required
  },
  payment: {
    type: Number,
    required: false, // Not required
  },
  extraPracticePayment: {
    type: Number,
    required: false, // New field for extra practice payment, not required
  },
});

// Define the main settings schema
const settingsSchema = new mongoose.Schema({
  regularmonthlyfee: {
    type: Number,
    required: true,
  },
  extrapractice: {
    type: Number,
    required: true,
  },
  membershipfee: {
    type: Number,
    required: true,
  },
  gymfee: {
    type: Number,
    required: true,
  },
  developementfee: {
    type: Number,
    required: false,
  },
  admissionfee: {
    type: Number,
    required: false,
  },
  couches: [couchSchema], // Array of couches
  trainees: [traineeSchema], // Array of trainees with extraPracticePayment
  date: {
    type: Date,
    default: Date.now, // Default to the current date
  },
});

// Export the model
const settings = mongoose.models.settings || mongoose.model('settings', settingsSchema);
export default settings;
