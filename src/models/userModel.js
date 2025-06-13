import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import paginate from './plugins/paginatePlugin';
import toJSON from './plugins/toJSONPlugin';
import APIError from '~/utils/apiError';
import Role from './roleModel';
import Token from './tokenModel';
import config from '~/config/config';
import httpStatus from 'http-status';

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true,
      private: true,
      minlength: 8,
      maxlength: 128
    },
    avatar: {
      type: String,
      default: 'avatar.png'
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    verifyToken: {
      type: String,
      private: true
    },
    verifyTokenExpires: {
      type: Date,
      private: true
    },
    resetToken: {
      type: String,
      private: true
    },
    resetTokenExpires: {
      type: Date,
      private: true
    },
    roles: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'roles'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.verifyToken;
        delete ret.verifyTokenExpires;
        delete ret.resetToken;
        delete ret.resetTokenExpires;
        return ret;
      }
    }
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

class UserClass {
  static async isEmailTaken(email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  }

  static async getUserById(id) {
    const user = await this.findById(id).exec();
    if (!user) {
      throw new APIError('User not found', httpStatus.NOT_FOUND);
    }
    return user;
  }

  static async getUserByIdWithRoles(id) {
    const user = await this.findById(id)
      .populate({
        path: 'roles',
        select: 'name description permissions'
      })
      .exec();

    if (!user) {
      throw new APIError('User not found', httpStatus.NOT_FOUND);
    }
    return user;
  }

  static async getUserByEmail(email) {
    return this.findOne({ email }).exec();
  }

  static async createUser(userData) {
    if (await this.isEmailTaken(userData.email)) {
      throw new APIError('Email already taken', httpStatus.BAD_REQUEST);
    }

    if (userData.roles && userData.roles.length > 0) {
      const rolesExist = await Role.countDocuments({
        _id: { $in: userData.roles }
      });

      if (rolesExist !== userData.roles.length) {
        throw new APIError('One or more roles do not exist', httpStatus.BAD_REQUEST);
      }
    }

    return this.create(userData);
  }

  static async updateUserById(userId, updateBody) {
    const user = await this.getUserById(userId);

    if (updateBody.email && (await this.isEmailTaken(updateBody.email, userId))) {
      throw new APIError('Email already taken', httpStatus.BAD_REQUEST);
    }

    if (updateBody.roles && updateBody.roles.length > 0) {
      const rolesExist = await Role.countDocuments({
        _id: { $in: updateBody.roles }
      });

      if (rolesExist !== updateBody.roles.length) {
        throw new APIError('One or more roles do not exist', httpStatus.BAD_REQUEST);
      }
    }

    Object.assign(user, updateBody);
    await user.save();
    return user;
  }

  static async deleteUserById(userId) {
    const user = await this.getUserById(userId);
    await user.remove();
    return user;
  }

  async isPasswordMatch(password) {
    return bcrypt.compare(password, this.password);
  }

  async saveRefreshToken(token, expires) {
    await Token.saveToken(token, this._id, expires, 'refresh');
  }

  async createVerifyToken() {
    const verifyToken = crypto.randomBytes(32).toString('hex');
    this.verifyToken = verifyToken;
    this.verifyTokenExpires =
      Date.now() + config.VERIFY_EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000;
    await this.save();
    return verifyToken;
  }

  async createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = resetToken;
    this.resetTokenExpires =
      Date.now() + config.RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES * 60 * 1000;
    await this.save();
    return resetToken;
  }
}

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.pre('remove', async function (next) {
  await Token.deleteMany({ user: this._id });
  next();
});

userSchema.loadClass(UserClass);

const User = mongoose.model('users', userSchema);

export default User;
