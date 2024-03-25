const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  album: {
    albumName: { type: String, required: true },
    albumYear: { type: Number, required: true },
    ep: { type: Boolean, required: true },
  },
});

module.exports = mongoose.model('Artist', artistSchema);
