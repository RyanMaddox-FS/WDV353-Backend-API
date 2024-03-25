const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { String, required: true },
  artist: { String, required: true },
  album: { String, required: true },
});

module.exports = mongoose.model('Song', songSchema);
