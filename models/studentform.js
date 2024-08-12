import mongoose from 'mongoose';

const studentformSchema = new mongoose.Schema({
  image: {
    type: String,
    required: false,
  },
  sportstype: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  fathersname: {
    type: String,
    required: true,
  },
  guardiansname: {
    type: String,
    required: true,
  },
  guardiansoccupation: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  phoneno: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  nameoftheschool: {
    type: String,
    required: false,
  },
  bloodgroup: {
    type: String,
    required: true,
  },
  document: {
    type: String,
    required: false,
  },
  adhar: {
    type: String,
    required: false,
  },
  extraPractice: {  // Nouveau champ ajouté
    type: String,
    required: false,
    default: 'Yes',  // Valeur par défaut
  },
});

const studentform = mongoose.models.studentform || mongoose.model('studentform', studentformSchema);
export default studentform;
