import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    verifyToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 } // удаляется через 1 час
  },
  { timestamps: true }
);

const PendingUser = mongoose.model('PendingUser', pendingUserSchema);
export default PendingUser;
