import mongoose from 'mongoose';

const staffpaymentSchema = new mongoose.Schema({
  staffName: {
    type: String,
    required: true,
  },
  otherCoach: {
    type: String,
    required: false,
    default: '',
  },
  date: {
    type: Date, // Changed to Date type for better date handling
    required: true,
  },
  amount: {
    type: Number, // Changed to Number type for more accurate numerical operations
    required: true,
    min: 0, // Amount should not be negative
  },
  document: {
    type: String,
    required: false,
  },
  things: [
    {
      name: {
        type: String,
        required: false,
        default: '',
      },
      amount: {
        type: Number, // Changed to Number type for consistency
        required: false,
        default: 0,
        min: 0, // Amount should not be negative
      },
    },
  ],
  months: [
    {
      month: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0, // Amount should not be negative
      },
    },
  ],
  billNo: {
    type: Number, // Changed to Number type
    required: true,
    unique: true, // Bill number should be unique
  },
  year: {
    type: Number, // Changed to Number type
    required: true,
  },
});

const staffpayment = mongoose.models.staffpayment || mongoose.model('staffpayment', staffpaymentSchema);
export default staffpayment;
