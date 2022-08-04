import mongoose from 'mongoose';

export const Generation = mongoose.model(
	'Generation',
	new mongoose.Schema({
		name: String,
		number: Number,
		starters: [Number],
	}),
);
