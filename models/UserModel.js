// UserSchema.js

const mongoose = require('mongoose');
const Role = require('./RoleModel');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }
});


UserSchema.methods.comparePassword = function (plaintextPassword) {
  return bcrypt.compare(plaintextPassword, this.password);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;