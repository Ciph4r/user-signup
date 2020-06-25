const mongoose = require('mongoose');




const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true },
  username: { type: String, unique: true, required: true, lowercase: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  address: {
      number: String,
      city: String,
      state: String 
  },
  password: { type: String, required: true, min: 3 },
  access : {type:Boolean , default: false}

});

module.exports = mongoose.model('User', UserSchema);
