const mongoose = require('mongoose');
const {Schema} = mongoose;

const artistSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String ,
  
    albumName: String ,
    albumYear: Number ,
    ep:  Boolean ,

});

module.exports = mongoose.model('Artist', artistSchema);
