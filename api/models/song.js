const mongoose = require("mongoose");
const { Schema } = mongoose;

const songSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
});

module.exports = mongoose.model("Song", songSchema);