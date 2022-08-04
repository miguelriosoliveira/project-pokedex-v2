const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Pokemon',
  new mongoose.Schema({
    name: String,
    displayName: String,
    number: Number,
    generation: String,
    evolutionChain: [Object],
    description: String,
    types: [String],
  }),
);
