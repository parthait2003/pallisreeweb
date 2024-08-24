import mongoose from 'mongoose';

const expenditureSchema = new mongoose.Schema({
  billNo: {
    type: Number,
    required: true,
    unique: true, // Ensure that each billNo is unique
  },
  expenditures: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: false,
  },
  document: {
    type: String,
    required: false,
  },
  things: [
    {
      name: {
        type: String,
        required: true,
      },
      amount: {
        type: String,
        required: true,
      },
    },
  ],
});

// Check if the model exists before creating a new one to avoid model compilation errors
const expenditure = mongoose.models.expenditure || mongoose.model('expenditure', expenditureSchema);

export default expenditure;
