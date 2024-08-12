import mongoose from 'mongoose';

const clubmemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  bloodgroup: {
    type: String,
    required: true,
  },
  phoneno: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  inducername: {
    type: String,
    required: false,
  },
  induceraddress: {
    type: String,
    required: false,
  },
  joiningdate: {
    type: String,
    required: false,
  },
});

const Clubmember = mongoose.models.Clubmember || mongoose.model('Clubmember', clubmemberSchema);
export default Clubmember;
