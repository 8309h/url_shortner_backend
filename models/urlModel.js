const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true 
  },
  shortUrl: {
    type: String,
    unique: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;
