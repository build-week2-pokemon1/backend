const mongoose = require('mongoose');

const PokeSchema = new mongoose.Schema({
  Name: String,
  Type1: String,
  Type2: String,
  Total: Number,
  HP: Number,
  Attack: Number,
  Defense: Number,
  SpAtk: Number,
  SpDef: Number,
  Speed: Number,
  Generation: Number,
  Legendary: Boolean,
})

module.exports = mongoose.model('Monster', PokeSchema);