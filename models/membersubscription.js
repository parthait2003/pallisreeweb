// models/Subscription.js
import mongoose from 'mongoose';

const memberSubscriptionSchema = new mongoose.Schema({
  billNo: {
    type: Number,
    required: true,
    unique: true, // Ensure the bill number is unique
  },
  member: {
    type: String,
    required: true,
  },
  
  memberid: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  monthsSelected: [
    {
      month: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  
  subscriptionType: [
    {
      type: {
        type: String,
        required: false,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ['cash', 'upi'],
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
});

const memberSubscription = mongoose.models.memberSubscription || mongoose.model('memberSubscription', memberSubscriptionSchema);
export default memberSubscription;
