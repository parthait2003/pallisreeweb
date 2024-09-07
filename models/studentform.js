import mongoose from 'mongoose';

// Helper function to format date as DD/MM/YYYY
function formatToDDMMYYYY(date) {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

const studentformSchema = new mongoose.Schema({
  image: {
    type: String,
    required: false,
  },
  sportstype: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  fathersname: {
    type: String,
    required: true,
  },
  guardiansname: {
    type: String,
    required: true,
  },
  guardiansoccupation: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  phoneno: {
    type: Number,
    required: true,
  },
  date: {
    type: String, // Store date in DD/MM/YYYY format
    required: true,
  },
  nameoftheschool: {
    type: String,
    required: false,
  },
  bloodgroup: {
    type: String,
    required: false,
  },
  document: {
    type: String,
    required: false,
  },
  adhar: {
    type: String,
    required: false,
  },
  extraPractice: {
    type: String,
    required: false,
    default: 'Yes',
  },
  joiningdate: {
    type: String, // Store joining date in DD/MM/YYYY format
    required: true,
  },
  traineeType: {
    type: String, // New field for trainee type
    required: false,
  },
  entrydate: {
    type: String, // Automatically generated current date in DD/MM/YYYY format
    required: false,
    default: () => formatToDDMMYYYY(new Date()), // Set default to the current date in DD/MM/YYYY format
  },
});

const studentform = mongoose.models.studentform || mongoose.model('studentform', studentformSchema);
export default studentform;
