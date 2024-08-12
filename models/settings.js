import mongoose from 'mongoose';

// Define a sub-schema for couches to include the new fields
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
  couches: [couchSchema], // Add couches as an array of couchSchema
  date: {
    type: Date,
    default: Date.now, // Default to the current date
  },
});

const settings = mongoose.models.settings || mongoose.model('settings', settingsSchema);
export default settings;
