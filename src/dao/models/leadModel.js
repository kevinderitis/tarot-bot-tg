import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    unique: true,
  },
  mainThreadId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
  chatId: {
    type: String,
    unique: true,
  },
  payment: {
    type: Boolean,
    default: false
  }
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
