// models/Subscription.js
import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  billNo: {
    type: Number,
    required: true,
  },
  trainee: {
    type: String,
    required: true,
  },
  traineeid: {
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
        required: false,
      },
      amount: {
        type: Number,
        required: false,
      },
    },
  ],
  extraPracticeMonthsSelected: [
    {
      month: {
        type: String,
        required: false,
      },
      amount: {
        type: Number,
        required: false,
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

const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
export default Subscription;
