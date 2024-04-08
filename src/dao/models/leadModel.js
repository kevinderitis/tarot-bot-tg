import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
  chatId: {
    type: String,
    unique: true,
  }
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;