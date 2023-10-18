// SiteNameSchema.js

const mongoose = require('mongoose');

const SiteNameSchema = new mongoose.Schema({

  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId() 
  },

  site_name: {
    type: String,
    required: true
  },

  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  }

});

const SiteName = mongoose.model('SiteName', SiteNameSchema);

module.exports = SiteName;