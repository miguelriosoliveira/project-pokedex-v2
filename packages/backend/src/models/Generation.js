const mongoose = require('mongoose');

module.exports = mongoose.model(
	'Generation',
	new mongoose.Schema({
		name: String,
		number: Number,
		starters: [Number],
	}),
);
