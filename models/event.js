import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['Camp', 'Tournament', 'Notice'], // Restrict to known event types
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  traineeIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainee',
      required: true,
    },
  ],

  // Fields for Camp events
  campLocation: {
    type: String,
    required: function() {
      return this.eventType === 'Camp';
    },
  },
  campName: {
    type: String,
    required: function() {
      return this.eventType === 'Camp';
    },
  },
  campNote: {
    type: String,
    required: false,
  },

  // Fields for Tournament events
  tournamentName: {
    type: String,
    required: function() {
      return this.eventType === 'Tournament';
    },
  },
  tournamentLocation: {
    type: String,
    required: function() {
      return this.eventType === 'Tournament';
    },
  },
  tournamentNote: {
    type: String,
    required: false,
  },

  // Fields for Notice events
  noticeTitle: {
    type: String,
    required: function() {
      return this.eventType === 'Notice';
    },
  },
  noticeDesc: {
    type: String,
    required: function() {
      return this.eventType === 'Notice';
    },
  },
  assignedBy: {
    type: String,
    required: function() {
      return this.eventType === 'Notice';
    },
  },

  // Automatically capture the creation date and time
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
});

// Check if the model exists before creating a new one to avoid model compilation errors
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
