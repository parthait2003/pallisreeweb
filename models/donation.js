import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  billNo: {
    type: Number,
    required: true,
   
  },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ['cash', 'upi', 'cheque', 'draft'],
    required: true,
  },
  transactionNo: {
    type: String,
    required: false,
  },
  utrNo: {
    type: String,
    required: false,
  },
  chequeNo: {
    type: String,
    required: false,
  },
  draftNo: {
    type: String,
    required: false,
  },
});

const Donation = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
export default Donation;
