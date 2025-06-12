import mongoose from 'mongoose';

const supportMessageSchema = new mongoose.Schema({
  userEmail: String,
  message: String,
});

const SupportMessage = mongoose.model('SupportMessage', supportMessageSchema);
export default SupportMessage;
