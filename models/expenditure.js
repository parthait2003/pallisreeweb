import mongoose from 'mongoose';

const expenditureSchema = new mongoose.Schema({
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

const expenditure = mongoose.models.expenditure || mongoose.model('expenditure', expenditureSchema);
export default expenditure;
