import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  campLocation: {
    type: String,
    required: true,
  },
  campName: {
    type: String,
    required: true,
  },
  campNote: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  traineeIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainee',
      required: true,
    },
  ],
});

// Check if the model exists before creating a new one to avoid model compilation errors
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
