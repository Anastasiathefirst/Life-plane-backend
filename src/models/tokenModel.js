import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['refresh', 'verifyEmail', 'resetPassword'],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Статический метод для сохранения токена
tokenSchema.statics.saveToken = async function (token, userId, expires, type, blacklisted = false) {
  const tokenDoc = await this.create({
    token,
    user: userId,
    expiresAt: expires,
    type,
    blacklisted,
  });
  return tokenDoc;
};

const Token = mongoose.model('Token', tokenSchema);

export default Token;
