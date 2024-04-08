const mongoose = require("mongoose");
const { Schema } = mongoose;

const artistSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  albumName: { type: String, required: true },
  albumYear: { type: Number, required: true },
  ep: { type: Boolean, required: true },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Song",
    required: true,
  },
});

module.exports = mongoose.model("Artist", artistSchema);