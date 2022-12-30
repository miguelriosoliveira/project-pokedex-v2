import mongoose from 'mongoose';

export const Pokemon = mongoose.model(
	'Pokemon',
	new mongoose.Schema({
		name: String,
		displayName: String,
		number: Number,
		generation: String,
		evolutionChain: [Object],
		description: String,
		types: [String],
		forms: [String],
		sprite: String,
	}),
);
