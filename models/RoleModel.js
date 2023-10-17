// RoleSchema.js

const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  role_id: {
    type: Number,
    required: true  
  },
  role_name: {
    type: String,
    required: true
  }
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;