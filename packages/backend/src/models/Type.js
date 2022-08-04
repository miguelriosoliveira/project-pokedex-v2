const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Type',
  new mongoose.Schema({
    name: String,

    doubleDamageFrom: [String],
    doubleDamageTo: [String],

    halfDamageFrom: [String],
    halfDamageTo: [String],

    noDamageFrom: [String],
    noDamageTo: [String],
  }),
);
