const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name: String,
  email: String,
  password: String
});

// method for encrypt password
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// method for compare two hashed passwords
userSchema.statics.comparePasswords = async (password, passwordToCompare) => {
  return await bcrypt.compare(password, passwordToCompare);
}


module.exports = mongoose.model('User', userSchema)
