const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: 1,
  },
  password: {
    type: String,
    required: true,
  }
})

//middleware
//hash new user pw
UserSchema.pre('save', function(next){
  bcrypt.hash(this.password, 11, (err, hash) => {
    if(err) return next(err);
    this.password = hash;
    return next();
  })
})

//compare pw to saved pw
UserSchema.methods.comparePasswords = function(password){
  return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);