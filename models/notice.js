import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  noticeNo: {
    type: String,
    required: true,
 
  },
  noticeTitle: {
    type: String,
    required: true,
  },
  noticeDesc: {
    type: String,
    required: true,
  },
  noticeDate: {
    type: Date,
    required: true,
  },
  noticeBy: {
    type: String,
    required: true,
  },
  trainees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainee', // Reference to the Trainee model
  }]
});

const Notice = mongoose.models.Notice || mongoose.model('Notice', noticeSchema);

export default Notice;
