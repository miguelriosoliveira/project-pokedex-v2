import mongoose from 'mongoose';

export interface PokemonSchema {
	number: number;
	name: string;
	display_name: string;
	generation: string;
	description: string;
	sprite: string;
	evolution_chain: string[][];
	types: string[];
	forms: string[];
}

export const Pokemon = mongoose.model(
	'Pokemon',
	new mongoose.Schema<PokemonSchema>({
		number: Number,
		name: String,
		display_name: String,
		generation: String,
		description: String,
		sprite: String,
		evolution_chain: [[String]],
		types: [String],
		forms: [String],
	}),
);
