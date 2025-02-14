const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email address: ' + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      trim: true,
      min: 18,
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!['male', 'female', 'others'].includes(value)) {
          throw new Error('Invalid gender value');
        }
      },
    },
    photoUrl: {
      type: String,
      trim: true,
      default: 'https://gravatar.com/avatar/HASH ',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Invalid URL');
        }
      },
    },
    about: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user?._id }, 'secret', {
    expiresIn: '7d',
  });
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  return bcrypt.compare(passwordInputByUser, passwordHash);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
