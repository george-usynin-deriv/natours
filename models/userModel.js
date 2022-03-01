const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    validate: [validator.isEmail, 'Please provide a valid email address'],
    unique: true,
    lowercase: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must have at least 8 characters'],
    // hide this property in queries
    select: false,
  },
  passwordChangedAt: Date,
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords must be the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  // Work only on CREATE and SAVE, not when UPDATE!!!
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return passwordChangedTimestamp > JWTTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
