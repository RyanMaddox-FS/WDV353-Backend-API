const mongoose = require('mongoose');
const {Schema} = mongoose;

const songSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String ,
  artist: String ,
  album: String ,
});

module.exports = mongoose.model('Song', songSchema);
